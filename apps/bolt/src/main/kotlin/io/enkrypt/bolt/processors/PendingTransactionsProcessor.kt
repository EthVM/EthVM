package io.enkrypt.bolt.processors

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.WriteModel
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.kafka.processors.MongoProcessor
import io.enkrypt.bolt.kafka.serdes.RLPTransactionSerde
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document
import org.ethereum.core.Transaction
import org.ethereum.util.ByteUtil
import org.koin.standalone.get
import java.util.Properties

/**
 * This processor process Pending Txs in the node.
 */
class PendingTransactionsProcessor : AbstractBaseProcessor() {

  override val id: String = "pending-transactions-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // Create Serde
    val serde = RLPTransactionSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.pendingTransactions, Consumed.with(Serdes.ByteArray(), serde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .process({ get<PendingTransactionMongoProcessor>() }, null)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

}

class PendingTransactionMongoProcessor : MongoProcessor<String, Transaction?>() {

  private val pendingTransactionsCollection: MongoCollection<Document> by lazy {
    mongoDB.getCollection(config.mongo.pendingTransactionsCollection)
  }

  override val batchSize = 100

  private val batch = ArrayList<Pair<String, Transaction?>>()
  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: String, value: Transaction?) {
    batch.add(Pair(key, value))
    if (batch.size == batchSize) {
      tryToWrite()
    }
  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val ops = batch.map<Pair<String, Transaction?>, WriteModel<Document>> { pair ->
      val hash = pair.first
      val txn = pair.second

      val filter = Document(mapOf("_id" to hash))
      val replaceOptions = ReplaceOptions().upsert(true)

      if (txn == null) {
        DeleteOneModel<Document>(filter)
      } else {
        ReplaceOneModel(filter, txn.toDocument(null, null, null), replaceOptions)
      }
    }

    try {
      pendingTransactionsCollection.bulkWrite(ops)

      context.commit()

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} pending transactions updated in $elapsedMs ms" }

      batch.clear()

    } catch (e: Exception) {
      logger.error { "Failed to update pending transactions. $e" }
    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}
