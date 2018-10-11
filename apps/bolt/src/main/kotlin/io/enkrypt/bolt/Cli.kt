package io.enkrypt.bolt

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import io.enkrypt.bolt.processors.AccountMongoProcessor
import io.enkrypt.bolt.processors.AccountStateProcessor
import io.enkrypt.bolt.processors.BlockMongoTransformer
import io.enkrypt.bolt.processors.BlocksProcessor
import io.enkrypt.bolt.processors.CanonicalChainProcessor
import io.enkrypt.bolt.processors.ChartsProcessor
import io.enkrypt.bolt.processors.PendingTransactionMongoProcessor
import io.enkrypt.bolt.processors.PendingTransactionsProcessor
import io.enkrypt.bolt.processors.Processor
import io.enkrypt.bolt.processors.TokenDetectorTransformer
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

  // Input Topics - CLI
  private val blocksTopic: String by option(
    help = "Name of the blocks stream topic on which Bolt will listen",
    envvar = "KAFKA_BLOCKS_TOPIC"
  ).default(DEFAULT_BLOCKS_TOPIC)

  private val processedBlocksTopic: String by option(
    help = "Name of the processed blocks stream topic on which Bolt will listen",
    envvar = "KAFKA_PROCESSED_BLOCKS_TOPIC"
  ).default(DEFAULT_PROCESSED_BLOCKS_TOPIC)

  private val canonicalChainTopic: String by option(
    help = "Name of the canonical chain stream topic on which Bolt will listen",
    envvar = "KAFKA_PROCESSED_BLOCKS_TOPIC"
  ).default(DEFAULT_CANONICAL_CHAIN_TOPIC)

  private val pendingTxsTopic: String by option(
    help = "Name of the pending transactions topic on which Bolt will listen",
    envvar = "KAFKA_PENDING_TXS_TOPIC"
  ).default(DEFAULT_PENDING_TXS_TOPIC)

  private val accountStateTopic: String by option(
    help = "Name of the account state topic on which Bolt will listen",
    envvar = "KAFKA_ACCOUNT_STATE_TOPIC"
  ).default(DEFAULT_ACCOUNT_STATE_TOPIC)

  private val metadataTopic: String by option(
    help = "Name of the metadata topic on which Bolt will listen",
    envvar = "KAFKA_METADATA_TOPIC"
  ).default(DEFAULT_METADATA_TOPIC)

  // Mongo - CLI
  private val mongoUri: String by option(
    help = "Mongo URI",
    envvar = "MONGO_URI"
  ).default(DEFAULT_MONGO_URI)

  // DI
  private val boltModule = module {

    single {
      MongoCollectionsConfig(
        "accounts",
        "blocks",
        "pending_transactions",
        "statistics"
      )
    }

    single {
      TopicsConfig(
        blocksTopic,
        processedBlocksTopic,
        canonicalChainTopic,
        pendingTxsTopic,
        accountStateTopic,
        metadataTopic
      )
    }

    single {
      AppConfig(
        bootstrapServers,
        startingOffset,
        get(),
        get()
      )
    }

    single { MongoClientURI(mongoUri) }
    single { MongoClient(get<MongoClientURI>()) }
    single {
      val client = get<MongoClient>()
      val uri = get<MongoClientURI>()

      client.getDatabase(uri.database!!)
    }

    factory { BlockMongoTransformer() }
    factory { TokenDetectorTransformer() }
    factory { AccountMongoProcessor() }
    factory { PendingTransactionMongoProcessor() }

    module("kafka") {
      single {
        Properties().apply {
          // App
          put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)

          // Processing
          put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.AT_LEAST_ONCE)
          put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, startingOffset)

          // Serdes - Defaults
          put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
          put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().javaClass.name)
        }
      }
    }
  }

  override fun run() {

    startKoin(listOf(boltModule))

    listOf<Processor>(
      BlocksProcessor(),
      CanonicalChainProcessor(),
      ChartsProcessor(),
      AccountStateProcessor(),
      PendingTransactionsProcessor()
    ).forEach {
      it.onPrepareProcessor()
      it.start()
    }
  }

  companion object Defaults {
    const val DEFAULT_BOOTSTRAP_SERVERS = "localhost:9092"
    const val DEFAULT_AUTO_OFFSET = "earliest"

    const val DEFAULT_MONGO_URI = "mongodb://localhost:27017/ethvm_local"

    const val DEFAULT_BLOCKS_TOPIC = "blocks"
    const val DEFAULT_PROCESSED_BLOCKS_TOPIC = "processed-blocks"
    const val DEFAULT_CANONICAL_CHAIN_TOPIC = "canonical-chain"
    const val DEFAULT_PENDING_TXS_TOPIC = "pending-transactions"
    const val DEFAULT_ACCOUNT_STATE_TOPIC = "account-state"
    const val DEFAULT_METADATA_TOPIC = "account-state"
  }
}
