package io.enkrypt.bolt.processors.blocks

import arrow.core.right
import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.model.ReplaceOptions
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.AppConfig
import io.enkrypt.bolt.extensions.transaction
import io.enkrypt.bolt.models.avro.Block
import io.enkrypt.bolt.models.kafka.KBlock
import io.enkrypt.bolt.models.kafka.KBlockStats
import io.enkrypt.bolt.models.kafka.KTransaction
import io.enkrypt.bolt.processors.Processor
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.KStream
import org.bson.Document
import org.joda.time.DateTime
import org.joda.time.Period
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.Properties

class BlocksProcessor : KoinComponent, Processor {

  private val appConfig: AppConfig by inject()
  private val kafkaProps: Properties by inject(name = "kafka.Properties")

  private val blocksProducer: BlocksProducer by inject()

  private val mongoUri: MongoClientURI by inject()
  private val mongoClient: MongoClient by inject()
  private val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database!!) }
  private val mongoSession by lazy { mongoClient.startSession() }

  private val blocksCollection by lazy { mongoDB.getCollection("blocks") }
  private val addressesCollection by lazy { mongoDB.getCollection("addresses") }

  private val logger = KotlinLogging.logger {}

  private lateinit var streams: KafkaStreams

  override fun onPrepareProcessor() {

    // Avro Serdes - Specific
    val serdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)
    val blockSerde = SpecificAvroSerde<Block>().apply { configure(serdeProps, false) }

    // Create stream builder
    val builder = StreamsBuilder()

    // Raw Blocks Stream
    val (blocksTopic) = appConfig.topicsConfig
    val blocks: KStream<String, Block> = builder.stream(blocksTopic, Consumed.with(Serdes.String(), blockSerde))

    blocks
      .filter { _, block -> block.getStatus() == KBlock.Status.CANONICAL.ordinal }
      .map { key, block -> KeyValue(key, KBlock(block)) }
      .map(::calculateStatistics)
      // Store process
      .foreach { key, block ->
        mongoSession.transaction {
          val replaceOptions = ReplaceOptions().upsert(true)

          // Store kBlock
          val blockQuery = Document().append("_id", block.hash)
          blocksCollection.replaceOne(mongoSession, blockQuery, block.toDocument(), replaceOptions)

          // Process addresses
//          addresses.forEach { balance ->
//            val balanceQuery = DocumenfeOne(mongoSession, balanceQuery, balance.toDocument(), replaceOptions)
//          }
        }.also {
          when {
            it.isLeft() -> {
              logger.info { "Block stored: ${block.hash} " }
            }
            it.isRight() -> logger.error { "Error storing block: ${block.hash} | Exception: ${it.right()}" }
          }
        }
      }

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  fun calculateStatistics(key: String, block: KBlock): KeyValue<String, KBlock> {

    if (block.status != KBlock.Status.CANONICAL.ordinal) {
      // we only calculate statistics for canonical blocks
      return KeyValue(key, block)
    }

    val blockTimeMs = Period(block.timestamp, DateTime.now()).millis

    var numSuccessfulTxs = 0
    var numFailedTxs = 0
    val totalGasPrice = BigDecimal(0)
    val totalTxsFees = BigDecimal(0)
    val totalTxs = 0
    val totalInternalTxs = 0

    // TODO count internal transactions

    val txs = block.transactions
    txs.forEach { txn ->

      logger.info { "Txn: ${txn.toDocument()} "}

      if(txn.to === null && txn.contractAddress != null) {

        logger.info{ "Contract detected via method 1"}
        logger.info { "Txn: ${txn.toDocument()} "}

      }

      if (txn.status == KTransaction.RECEIPT_STATUS_SUCCESSFUL) {
        numSuccessfulTxs += 1
      } else {
        numFailedTxs += 1
      }

      totalGasPrice.add(txn.gasPrice!!)

      val txsFee = txn.gasUsed!!.times(txn.gasPrice!!)
      totalTxsFees.add(txsFee)

    }

    val txsCount = txs.size.toBigDecimal()

    var avgGasPrice = BigDecimal.ZERO
    var avgTxsFees = BigDecimal.ZERO

    if(txsCount.intValueExact() > 0) {
      avgGasPrice = totalGasPrice.divide(txsCount, RoundingMode.CEILING)
      avgTxsFees = totalTxsFees.divide(txsCount, RoundingMode.CEILING)
    }

    block.stats = KBlockStats(
      blockTimeMs,
      numFailedTxs,
      numSuccessfulTxs,
      totalTxs,
      totalInternalTxs,
      avgGasPrice,
      avgTxsFees
    )

    return KeyValue(key, block)
  }

  override fun start() {
    streams.apply {
      logger.info { "Performing cleanup" }.also { cleanUp() }
      logger.info { "Starting blocks processor..." }.also { start() }
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }

}
