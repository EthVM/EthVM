package io.enkrypt.bolt.processors

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.BulkWriteOptions
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import io.enkrypt.bolt.eth.utils.StandardTokenDetector
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.kafka.serdes.RLPBlockSummarySerde
import io.enkrypt.bolt.kafka.transformers.MongoTransformer
import io.enkrypt.bolt.models.Contract
import mu.KotlinLogging
import org.apache.commons.lang3.ArrayUtils
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.apache.kafka.streams.processor.TimestampExtractor
import org.bson.Document
import org.ethereum.core.BlockSummary
import org.koin.standalone.get
import java.util.Properties

/**
 * This processor process Blocks and Txs at the same time.
 */
class BlocksProcessor : AbstractBaseProcessor() {

  override val id: String = "blocks-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {

    // RLP Serde
    val blockSerde = RLPBlockSummarySerde()

    // Create stream builder
    val builder = StreamsBuilder()

    val (blocks) = appConfig.kafka.topicsConfig

    builder
      .stream(blocks, Consumed.with(Serdes.ByteArray(), blockSerde))
      .transform({ get<BlockMongoTransformer>() }, null)
      .transform({ get<TokenDetectorTransformer>() }, null)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)

  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }

}


class BlockMongoTransformer : MongoTransformer<ByteArray, BlockSummary?>() {

  private val blocksCollection: MongoCollection<Document>by lazy {
    mongoDB.getCollection(config.mongo.blocksCollection)
  }

  override val batchSize = 50
  private val batch: MutableList<Pair<ByteArray, BlockSummary>> = ArrayList()

  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun transform(key: ByteArray, value: BlockSummary?): KeyValue<ByteArray, BlockSummary?>? {

    if(value != null) {
      batch.add(Pair(key, value))
    }

    if (batch.size == batchSize) {
      tryToWrite()
    }

    // we will forward later
    return null
  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val blocksOps = batch.map { pair ->

      val key = pair.first
      val summary = pair.second

      val block = summary.block

      // Mongo
      val replaceOptions = ReplaceOptions().upsert(true)

      // Blocks
      val blockQuery = Document(mapOf("_id" to block.number))
      val blockUpdate = block.toDocument(summary)

      ReplaceOneModel(blockQuery, blockUpdate, replaceOptions)
    }

    try {

      val bulkOptions = BulkWriteOptions().ordered(false)
      blocksCollection.bulkWrite(blocksOps, bulkOptions)

      // forward to downstream processors and commit
      batch.forEach { pair -> context.forward(pair.first, pair.second) }

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} blocks stored in $elapsedMs ms" }

      batch.clear()

    } catch (e: Exception) {

      // TODO handle error
      logger.error { "Failed to store blocks. $e" }

    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}

class TokenDetectorTransformer : MongoTransformer<ByteArray, BlockSummary?>() {

  private val accountsCollection: MongoCollection<Document>by lazy {
    mongoDB.getCollection(config.mongo.accountsCollection)
  }

  override val batchSize = 50
  private val batch: MutableList<Contract> = ArrayList()

  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun transform(key: ByteArray, value: BlockSummary?): KeyValue<ByteArray, BlockSummary?>? {

    if(value == null) return null

    val block = value.block
    val txs = block?.transactionsList ?: emptyList()

    txs
      .asSequence()
      .filter { it.isContractCreation }
      .map { c ->
        val type = StandardTokenDetector.detect(ArrayUtils.nullToEmpty(c.data))

        logger.info { "Smart contract detected: ${c.contractAddress.toHex()} | Type: $type" }

        val contract = Contract(c.contractAddress, type.first)

        batch.add(contract)
      }

    if (batch.size == batchSize) {
      tryToWrite()
    }

    return KeyValue(key, value) // Don't change the state as this transformer just only reads information on the fly
  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val contractOps = batch.map { contract ->
      // Mongo
      val updateOptions = UpdateOptions().upsert(true)

      // Contracts
      val query = Document(mapOf("_id" to contract.address.toHex()))
      val document = Document(mapOf("\$set" to contract.toDocument()))

      UpdateOneModel<Document>(query, document, updateOptions)
    }

    try {

      val bulkOptions = BulkWriteOptions().ordered(false)
      accountsCollection.bulkWrite(contractOps, bulkOptions)

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} contracts accounts updated in $elapsedMs ms" }

      batch.clear()

    } catch (e: Exception) {

      // TODO handle error
      logger.error { "Failed to store smart contracts detection. Error: $e" }

    }
  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }
}

class BlockSummaryTimestampExtractor : TimestampExtractor {

  override fun extract(record: ConsumerRecord<Any, Any>?, previousTimestamp: Long): Long {
    var timestamp: Long = -1
    val summary = record?.value() as BlockSummary
    if (summary != null) {
      timestamp = summary.block.timestamp * 1000   // timestamp is in unix time
    }
    return if (timestamp < 0) {
      // Invalid timestamp!  Attempt to estimate a new timestamp,
      // otherwise fall back to wall-clock time (processing-time).
      if (previousTimestamp >= 0) {
        previousTimestamp
      } else {
        System.currentTimeMillis()
      }
    } else timestamp
  }

}
