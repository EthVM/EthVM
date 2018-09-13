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
import io.enkrypt.bolt.models.kafka.KAddress
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

      // Calculate block stats
      .map { key, kBlock ->
        val blockTimeMs = Period(kBlock.timestamp, DateTime.now()).millis

        var numSuccessfulTxs = 0
        var numFailedTxs = 0
        val totalGasPrice = BigDecimal(0)
        val totalTxsFees = BigDecimal(0)
        val totalTxs = 0
        val totalInternalTxs = 0

        val txs = kBlock.transactions
        txs.forEach { txn ->
          if (txn.status == KTransaction.RECEIPT_STATUS_SUCCESSFUL) {
            numSuccessfulTxs += 1
          } else {
            numFailedTxs += 1
          }
        }

//        txs.forEach { txn ->
//          if (!(txn.getFrom() == null || txn.getFromBalance() === null)) {
//            balances.add(KAddress(txn.getFrom().toHex()!!, txn.getFromBalance().toBigDecimal()!!))
//          }
//
//          if (!(txn.getTo() == null || txn.getToBalance() === null)) {
//            balances.add(KAddress(txn.getTo().toHex()!!, txn.getToBalance().toBigDecimal()!!))
//          }
//
//          if (txn.getStatus().int > 0) {
//            numSuccessfulTxs += 1
//          } else {
//            numFailedTxs += 1
//          }
//
//          totalGasPrice += txn.getGasPrice()
//          totalTxsFees += txn.getGasUsed() * txn.getGasPrice()
//        }

        val avgGasPrice = BigDecimal(0) //Math.round(Math.ceil(totalGasPrice * 1.0 / txs.size))
        val avgTxsFees = BigDecimal(0) // Math.round(Math.ceil(totalTxsFees * 1.0 / txs.size))

        kBlock.stats = KBlockStats(
          blockTimeMs,
          numFailedTxs,
          numSuccessfulTxs,
          totalTxs,
          totalInternalTxs,
          avgGasPrice,
          avgTxsFees
        )

        KeyValue(key, kBlock)
      }

      // Calculate addresses balances
      .map { key, kBlock ->
        // Calculate addresses balances
        val addresses = mutableListOf<KAddress>()
        KeyValue(key, Pair(kBlock, addresses))
      }

      // Store process
      .foreach { key, (kBlock, _) ->
        mongoSession.transaction {
          val replaceOptions = ReplaceOptions().upsert(true)

          // Store kBlock
          val blockQuery = Document().append("_id", kBlock.hash)
          blocksCollection.replaceOne(mongoSession, blockQuery, kBlock.toDocument(), replaceOptions)

          // Process addresses
//          addresses.forEach { balance ->
//            val balanceQuery = Document().append("_id", balance.address)
//            addressesCollection.replaceOne(mongoSession, balanceQuery, balance.toDocument(), replaceOptions)
//          }
        }.also {
          when {
            it.isLeft() -> {
              logger.info { "Block stored: ${kBlock.hash} " }
//              blocksProducer.send(key, kBlock.toBlock())
            }
            it.isRight() -> logger.error { "Error storing block: ${kBlock.hash} | Exception: ${it.right()}" }
          }
        }
      }

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
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
