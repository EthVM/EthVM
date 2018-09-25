package io.enkrypt.bolt

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.GenericAvroSerde
import io.enkrypt.bolt.processors.AccountStateProcessor
import io.enkrypt.bolt.processors.BlocksProcessor
import io.enkrypt.bolt.processors.TransactionsProcessor
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.StreamsConfig
import org.koin.dsl.module.module
import org.koin.standalone.StandAloneContext.startKoin
import java.util.Properties

class Cli : CliktCommand() {

  // General - CLI
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
  private val blocksTopic: String by option(
    help = "Name of the blocks stream topic on which Bolt will listen",
    envvar = "KAFA_BLOCKS_TOPIC"
  ).default(DEFAULT_BLOCKS_TOPIC)

  private val blocksInfoTopic: String by option(
    help = "Name of the blocks info topic on which Bolt will listen",
    envvar = "KAFKA_BLOCKS_INFO_TOPIC"
  ).default(DEFAULT_BLOCKS_INFO_TOPIC)

  private val txsTopic: String by option(
    help = "Name of the transactions topic on which Bolt will listen",
    envvar = "KAFKA_PENDING_TXS_TOPIC"
  ).default(DEFAULT_TXS_TOPIC)

  private val accountStateTopic: String by option(
    help = "Name of the account state topic on which Bolt will listen",
    envvar = "KAFKA_ACCOUNT_STATE_TOPIC"
  ).default(DEFAULT_ACCOUNT_STATE_TOPIC)

  // Mongo - CLI
  private val mongoUri: String by option(
    help = "Mongo URI",
    envvar = "MONGO_URI"
  ).default(DEFAULT_MONGO_URI)

  // DI
  private val boltModule = module {
    single { TopicsConfig(blocksTopic, blocksInfoTopic, txsTopic, accountStateTopic) }
    single { AppConfig(bootstrapServers, schemaRegistryUrl, startingOffset, get()) }

    single { MongoClientURI(mongoUri) }
    single { MongoClient(MongoClientURI(mongoUri)) }

    module("kafka") {
      single {
        Properties().apply {
          // App
          put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
          put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl)

          // Processing
          put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.AT_LEAST_ONCE)
          put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, startingOffset)

          // Serdes - Defaults
          put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
          put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, GenericAvroSerde::class.java)
        }
      }
    }
  }

  override fun run() {
    startKoin(listOf(boltModule))

    BlocksProcessor().apply {
      onPrepareProcessor()
      start()
    }

    AccountStateProcessor().apply {
      onPrepareProcessor()
      start()
    }

    TransactionsProcessor().apply {
      onPrepareProcessor()
      start()
    }
  }

  companion object Defaults {
    const val DEFAULT_BOOTSTRAP_SERVERS = "localhost:9092"
    const val DEFAULT_AUTO_OFFSET = "earliest"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://localhost:8081"

    const val DEFAULT_MONGO_URI = "mongodb://localhost:27017/ethvm_local"

    const val DEFAULT_BLOCKS_TOPIC = "blocks"
    const val DEFAULT_BLOCKS_INFO_TOPIC = "blocks-info"

    const val DEFAULT_TXS_TOPIC = "transactions"

    const val DEFAULT_ACCOUNT_STATE_TOPIC = "account-state"
  }
}
