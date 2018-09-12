package io.enkrypt.bolt

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.mongodb.MongoClientURI
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.GenericAvroSerde
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.processors.blocks.BlocksProcessor
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.StreamsConfig
import org.koin.dsl.module.module
import org.koin.standalone.StandAloneContext.startKoin
import org.litote.kmongo.KMongo
import java.util.Properties

class Cli : CliktCommand() {

  // General - CLI
  private val applicationId: String by option(
    help = "Identifier for the stream processing application",
    envvar = "APPLICATION_ID"
  ).default(DEFAULT_APPLICATION_ID)

  private val bootstrapServers: String by option(
    help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster",
    envvar = "KAFKA_BOOTSTRAP_SERVERS"
  ).default(DEFAULT_BOOTSTRAP_SERVERS)

  private val startingOffset: String by option(
    help = "From which offset is going to start Bolt processing events",
    envvar = "KAFKA_START_OFFSET"
  ).default(DEFAULT_AUTO_OFFSET)

  private val schemaRegistryUrl: String by option(
    help = "Specifies in which server are stored AVRO schemas",
    envvar = "KAFKA_SCHEMA_REGISTRY_URL"
  ).default(DEFAULT_SCHEMA_REGISTRY_URL)

  // Input Topics - CLI
  private val rawBlocksTopic: String by option(
    help = "Name of the raw blocks stream topic on which Bolt will listen",
    envvar = "KAFA_RAW_BLOCKS_TOPIC"
  ).default(DEFAULT_RAW_BLOCK_TOPIC)

  private val rawPendingTxsTopic: String by option(
    help = "Name of the raw blocks stream topic on which Bolt will listen",
    envvar = "KAFKA_PENDING_TXS_TOPIC"
  ).default(DEFAULT_RAW_PENDING_TXS_TOPIC)

  private val mongoUri: String by option(
    help = "Mongo URI",
    envvar = "MONGO_URI"
  ).default(DEFAULT_MONGO_URI)

  // DI
  private val boltModule = module {
    single { TopicsConfig(rawBlocksTopic, rawPendingTxsTopic) }
    single { AppConfig(applicationId, bootstrapServers, startingOffset, schemaRegistryUrl, get()) }

    single { MongoClientURI(mongoUri) }
    single { KMongo.createClient(MongoClientURI(mongoUri)) }

    module("kafka") {
      single {
        Properties().apply {
          // App
          put(StreamsConfig.APPLICATION_ID_CONFIG, applicationId)
          put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
          put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl)

          // Processing
          put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.AT_LEAST_ONCE)
          put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, startingOffset)

          // Serdes
          put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
          put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, GenericAvroSerde::class.java)
        }
      }
    }

    single { BlocksProcessor() }
  }

  override fun run() {
    startKoin(listOf(boltModule))
    BlocksProcessor().apply {
      onPrepare()
      start()
    }
  }

  companion object Defaults {
    const val DEFAULT_APPLICATION_ID = "blocks-processor"
    const val DEFAULT_BOOTSTRAP_SERVERS = "localhost:9092"
    const val DEFAULT_AUTO_OFFSET = "earliest"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://localhost:8081"

    const val DEFAULT_MONGO_URI = "mongodb://localhost:27017/ethvm_local"

    const val DEFAULT_RAW_BLOCK_TOPIC = "raw-blocks"
    const val DEFAULT_RAW_PENDING_TXS_TOPIC = "raw-pending-txs"
  }
}
