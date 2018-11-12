package io.enkrypt.bolt

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.types.int
import io.enkrypt.bolt.Modules.kafkaModule
import io.enkrypt.bolt.Modules.processorsModule
import io.enkrypt.bolt.processors.*
import org.koin.dsl.module.module
import org.koin.standalone.StandAloneContext.startKoin

class Cli : CliktCommand() {

  // General - CLI

  private val transactionalId: String by option(
    help = "A unique instance id for use in kafka transactions",
    envvar = "KAFKA_TRANSACTIONAL_ID"
  ).default(DEFAULT_TRANSACTIONAL_ID)

  private val bootstrapServers: String by option(
    help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster",
    envvar = "KAFKA_BOOTSTRAP_SERVERS"
  ).default(DEFAULT_BOOTSTRAP_SERVERS)

  private val startingOffset: String by option(
    help = "From which offset is going to start Bolt processing events",
    envvar = "KAFKA_START_OFFSET"
  ).default(DEFAULT_AUTO_OFFSET)

  private val resetStreamsState: Int by option(
    help = "Whether or not to reset local persisted streams processing state",
    envvar = "KAFKA_STREAMS_RESET"
  ).int().default(DEFAULT_STREAMS_RESET)

  // Input Topics - CLI
  private val blockSummariesTopic: String by option(
    help = "Name of the block summaries stream topic on which Bolt will listen",
    envvar = "KAFKA_BLOCKS_TOPIC"
  ).default(DEFAULT_BLOCK_SUMMARIES_TOPIC)

  private val pendingTxsTopic: String by option(
    help = "Name of the pending transactions topic on which Bolt will listen",
    envvar = "KAFKA_PENDING_TXS_TOPIC"
  ).default(DEFAULT_PENDING_TXS_TOPIC)

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

  private val configModule = module {

    single {

    }

    single {
      KafkaConfig(
        bootstrapServers,
        startingOffset,
        transactionalId,
        KafkaTopicsConfig(
          blockSummariesTopic,
          pendingTxsTopic,
          metadataTopic
        ))
    }

    single { AppConfig(get()) }

  }

  override fun run() {

    startKoin(listOf(configModule, kafkaModule, processorsModule))

    listOf<BoltProcessor>(
      BlockSummaryBoltProcessor(),
      StateBoltProcessor()
    ).forEach {
      it.onPrepareProcessor()
      it.start(resetStreamsState == 1)
    }
  }

  companion object Defaults {

    const val DEFAULT_TRANSACTIONAL_ID = "bolt-1"
    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka-1:9091,kafka-2:9092,kafka-3:9093"
    const val DEFAULT_AUTO_OFFSET = "earliest"
    const val DEFAULT_STREAMS_RESET = 0

    const val DEFAULT_MONGO_URI = "mongodb://localhost:27017/ethvm_local"

    const val DEFAULT_BLOCK_SUMMARIES_TOPIC = "block-summaries"
    const val DEFAULT_PENDING_TXS_TOPIC = "pending-transactions"
    const val DEFAULT_METADATA_TOPIC = "metadata"
  }
}
