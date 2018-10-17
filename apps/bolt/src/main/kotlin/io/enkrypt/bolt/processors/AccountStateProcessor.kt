package io.enkrypt.bolt.processors

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.WriteModel
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.kafka.processors.MongoProcessor
import io.enkrypt.bolt.kafka.serdes.RLPAccountStateSerde
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
import org.ethereum.core.AccountState
import org.ethereum.util.ByteUtil
import org.koin.standalone.get
import java.util.*

/**
 * This processor processes addresses balances and type (if is a smart contract or not).
 */
class AccountStateProcessor : AbstractBaseProcessor() {

  override val id: String = "account-state-processor"

  private val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // RLP Account Serde
    val accountSerde = RLPAccountStateSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.accountState, Consumed.with(Serdes.ByteArray(), accountSerde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .process({ get<AccountStateMongoProcessor>() }, null)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

}

class AccountStateMongoProcessor : MongoProcessor<String, AccountState>() {

  private val accountsCollection: MongoCollection<Document> by lazy {
    mongoDB.getCollection(config.mongo.accountsCollection)
  }

  override val batchSize = 100

  private var batch = mapOf<String, AccountState>()
  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: String, value: AccountState) {
    batch += key to value
    if (batch.size == batchSize) {
      tryToWrite()
    }
  }

  private fun tryToWrite() {
    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val ops = batch.toList().map<Pair<String, AccountState>, WriteModel<Document>> { pair ->

      val address = pair.first
      val state = pair.second

      val filter = Document(mapOf("_id" to address))
      val updateOptions = UpdateOptions().upsert(true)

      if (state.isEmpty) {
        DeleteOneModel(filter)
      } else {
        val update = Document(mapOf("\$set" to state.toDocument()))
        UpdateOneModel(filter, update, updateOptions)
      }
    }

    try {

      accountsCollection.bulkWrite(ops)

      context.commit()

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} accounts updated in $elapsedMs ms" }

      batch = emptyMap()

    } catch (e: Exception) {
      logger.error { "Failed to update accounts. $e" }
    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}
