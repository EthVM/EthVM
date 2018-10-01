package io.enkrypt.bolt.processors

import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOptions
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.serdes.RLPTransactionSerde
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.bson.Document
import org.ethereum.core.Transaction
import org.ethereum.util.ByteUtil
import org.litote.kmongo.deleteOneById
import java.util.*

/**
 * This processor process Pending Txs in the node.
 */
class PendingTransactionsProcessor : AbstractBaseProcessor() {

  override val id: String = "pending-transactions-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // Create Serde
    val serde = RLPTransactionSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.pendingTransactions, Consumed.with(Serdes.ByteArray(), serde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .foreach(::persist)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun persist(hash: String, txn: Transaction?) {

    logger.info { "Pending txn: $hash $txn"}

    val replaceOptions = ReplaceOptions().upsert(true)

    val idQuery = Document(mapOf("_id" to hash))

    if(txn == null) {
      pendingTransactionsCollection.deleteOneById(hash)
    } else {
      pendingTransactionsCollection.replaceOne(idQuery, txn.toDocument(), replaceOptions)
    }
  }

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }

}
