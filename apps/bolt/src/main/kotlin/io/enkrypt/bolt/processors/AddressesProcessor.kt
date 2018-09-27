package io.enkrypt.bolt.processors

import com.mongodb.client.model.UpdateOptions
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.AccountState
import io.enkrypt.bolt.extensions.toDocument
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

class AddressesProcessor : AbstractBaseProcessor() {

  private val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, "account-state-processor")
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // Avro Serdes - Specific
    val serdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)

    val accountStateSerde = SpecificAvroSerde<AccountState>().apply { configure(serdeProps, false) }

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.accountState, Consumed.with(Serdes.ByteArray(), accountStateSerde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .foreach(::persistAccountState)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun persistAccountState(address: String, state: AccountState?) {
    val options = UpdateOptions().upsert(true)
    val idQuery = Document(mapOf("_id" to address))

    if (state != null) {
      val update = Document(mapOf("\$set" to state.toDocument()))
      addressesCollection.updateOne(idQuery, update, options)
      logger.info { "Account state stored: $idQuery " }
    } else {
      addressesCollection.deleteOne(idQuery)
      logger.info { "Account state deleted: $idQuery " }
    }
  }

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }

}
