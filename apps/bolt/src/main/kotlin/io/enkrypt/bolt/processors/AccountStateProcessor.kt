package io.enkrypt.bolt.processors

import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.model.UpdateOptions
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.AccountState
import io.enkrypt.bolt.AppConfig
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
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.Properties

class AccountStateProcessor : KoinComponent, Processor {

  private val appConfig: AppConfig by inject()
  private val baseKafkaProps: Properties by inject(name = "kafka.Properties")

  private val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, "account-state-processor")
    }

  private val mongoUri: MongoClientURI by inject()
  private val mongoClient: MongoClient by inject()
  private val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database!!) }

  private val addressStateCollection by lazy { mongoDB.getCollection("account-state") }

  private val logger = KotlinLogging.logger {}

  private lateinit var streams: KafkaStreams

  override fun onPrepareProcessor() {
    // Avro Serdes - Specific
    val serdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)

    val accountStateSerde = SpecificAvroSerde<AccountState>().apply { configure(serdeProps, false) }

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream("account-state", Consumed.with(Serdes.ByteArray(), accountStateSerde))
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
      addressStateCollection.updateOne(idQuery, update, options)
      logger.info { "Account state stored: $idQuery " }
    } else {
      addressStateCollection.deleteOne(idQuery)
      logger.info { "Account state deleted: $idQuery " }
    }
  }

  override fun start() {
    streams.apply {
      logger.info { "Performing cleanup" }.also { cleanUp() }
      logger.info { "Starting address state processor..." }.also { start() }
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }

}
