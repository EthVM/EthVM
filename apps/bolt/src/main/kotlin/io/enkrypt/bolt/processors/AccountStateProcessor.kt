package io.enkrypt.bolt.processors

import com.mongodb.client.model.UpdateOptions
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.serdes.RLPAccountSerde
import io.enkrypt.kafka.models.Account
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.bson.Document
import org.ethereum.util.ByteUtil
import java.util.Properties

/**
 * This processor processes addresses balances.
 */
class AccountStateProcessor : AbstractBaseProcessor() {

  private val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, "account-state-processor")
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // RLP Account Serde
    val accountSerde = RLPAccountSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.accountState, Consumed.with(Serdes.ByteArray(), accountSerde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .foreach(::persist)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun persist(key: String, account: Account?) {
    val filter = Document(mapOf("_id" to key))
    val options = UpdateOptions().upsert(true)

    if (account != null) {
      val document = Document(mapOf("\$set" to account.toDocument()))
      addressesCollection.updateOne(filter, document, options)
    }

    // TODO: Explore if data should be removed if balance is zero
//    if (state != null) {
//      val update = Document(mapOf("\$set" to state.toDocument()))
//      addressesCollection.updateOne(idQuery, update, options)
//      logger.info { "Account state stored: $idQuery " }
//    } else {
//      addressesCollection.deleteOne(idQuery)
//      logger.info { "Account state deleted: $idQuery " }
//    }
  }

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }

}
