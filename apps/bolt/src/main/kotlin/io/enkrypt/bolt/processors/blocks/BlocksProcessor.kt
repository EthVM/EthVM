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
import org.apache.kafka.streams.kstream.*
import org.apache.kafka.streams.state.*
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

  private val mongoUri: MongoClientURI by inject()
  private val mongoClient: MongoClient by inject()
  private val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database!!) }
  private val mongoSession by lazy { mongoClient.startSession() }

  private val blocksCollection by lazy { mongoDB.getCollection("blocks") }
  private val addressesCollection by lazy { mongoDB.getCollection("addresses") }

  private val logger = KotlinLogging.logger {}

  private lateinit var streams: KafkaStreams

  enum class BlockOperation {
    Apply, Reverse, Ignore
  }

  override fun onPrepareProcessor() {


    // Avro Serdes - Specific
    val serdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)
    val blockSerde = SpecificAvroSerde<Block>().apply { configure(serdeProps, false) }

    // Create stream builder
    val builder = StreamsBuilder()

    // Raw Blocks Stream
    val (blocksTopic) = appConfig.topicsConfig

    val blocks = builder
      .stream(blocksTopic, Consumed.with(Serdes.String(), blockSerde))
      .map{ key, block -> KeyValue(key, Block.newBuilder(block).build())}

    val latestBlocksWindow = blocks
      .groupByKey(Serialized.with(Serdes.String(), blockSerde))
      .reduce(
        { memo, next -> next },
        Materialized.`as`(Stores.persistentKeyValueStore("latest-blocks"))
      )

    val blockWithOperation = blocks.join(
      latestBlocksWindow,
      { block, lastSeenBlock ->

        val isCanonical = block.getStatus() == KBlock.Status.CANONICAL.ordinal
        var wasCanonical = lastSeenBlock?.getStatus() == KBlock.Status.CANONICAL.ordinal

        if(lastSeenBlock != null) {
          wasCanonical = (lastSeenBlock.getStatus() == KBlock.Status.CANONICAL.ordinal) ?: false
        }

        val operation = when(Pair(isCanonical, wasCanonical)) {
          Pair(true, true) -> BlockOperation.Apply
          Pair(true, false) -> BlockOperation.Apply
          Pair(false, true) -> BlockOperation.Reverse
          else -> BlockOperation.Ignore
        }

        Pair(operation, block)
      },
      Joined.with(Serdes.String(), blockSerde, blockSerde)
    )

    blockWithOperation
      .map { key, (op, block) -> KeyValue(key, Pair(op, KBlock(block)))}
      .map(::calculateStatistics)
      .foreach(::persistToMongo)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun calculateStatistics(key: String, blockWithOp: Pair<BlockOperation, KBlock>): KeyValue<String, Pair<BlockOperation, KBlock>> {

    val block = blockWithOp.second
    val blockTimeMs = Period(block.timestamp, DateTime.now()).millis

    var numSuccessfulTxs = 0
    var numFailedTxs = 0
    val totalGasPrice = BigDecimal(0)
    val totalTxsFees = BigDecimal(0)
    val totalTxs = 0
    var totalInternalTxs = 0

    val txs = block.transactions
    txs.forEach { txn ->

      if (txn.status == KTransaction.RECEIPT_STATUS_SUCCESSFUL) {
        numSuccessfulTxs += 1
      } else {
        numFailedTxs += 1
      }

      totalGasPrice.add(txn.gasPrice!!)

      val txsFee = txn.gasUsed!!.times(txn.gasPrice!!)
      totalTxsFees.add(txsFee)

      totalInternalTxs += txn.trace!!.transfers.size
    }

    val txsCount = txs.size.toBigDecimal()

    var avgGasPrice = BigDecimal.ZERO
    var avgTxsFees = BigDecimal.ZERO

    if (txsCount.intValueExact() > 0) {
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

    return KeyValue(key, blockWithOp)
  }

  private fun persistToMongo(key: String, blockWithOp: Pair<BlockOperation, KBlock>) {

    val block = blockWithOp.second

    mongoSession.transaction {

      val replaceOptions = ReplaceOptions().upsert(true)

      // nullify the number field of the previous canonical block

      val numberFilter = Document(mapOf("number" to block.number))
      val numberUpdate = Document(mapOf("\$set" to mapOf("number" to null)))
      blocksCollection.updateMany(mongoSession, numberFilter, numberUpdate)

      // upsert the new block
      val blockQuery = Document().append("_id", block.hash)
      blocksCollection.replaceOne(mongoSession, blockQuery, block.toDocument(), replaceOptions)

    }.also {
      when {
        it.isLeft() -> {
          logger.info { "Block stored: ${block.hash} " }
        }
        it.isRight() -> logger.error { "Error storing block: ${block.hash} | Exception: ${it.right()}" }
      }
    }
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
