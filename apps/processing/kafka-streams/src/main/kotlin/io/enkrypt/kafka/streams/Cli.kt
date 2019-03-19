package io.enkrypt.kafka.streams

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.types.int
import io.enkrypt.common.config.NetConfig
import io.enkrypt.kafka.streams.config.AppConfig
import io.enkrypt.kafka.streams.config.KafkaConfig
import io.enkrypt.kafka.streams.di.Modules.kafkaStreams
import io.enkrypt.kafka.streams.processors.EtherBalanceProcessor
import io.enkrypt.kafka.streams.processors.KafkaProcessor
import io.enkrypt.kafka.streams.processors.LoggerProcessor
import io.enkrypt.kafka.streams.processors.TransactionFeesProcessor
import org.koin.dsl.module.module
import org.koin.standalone.StandAloneContext.startKoin

class Cli : CliktCommand() {

  // General - CLI

  private val transactionalId: String by option(
    help = "A unique instance id for use in kafkaStreams transactions",
    envvar = "KAFKA_TRANSACTIONAL_ID"
  ).default(DEFAULT_TRANSACTIONAL_ID)

  private val bootstrapServers: String by option(
    help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster",
    envvar = "KAFKA_BOOTSTRAP_SERVERS"
  ).default(DEFAULT_BOOTSTRAP_SERVERS)

  private val schemaRegistryUrl: String by option(
    help = "Kafka schema registry url",
    envvar = "KAFKA_SCHEMA_REGISTRY_URL"
  ).default(DEFAULT_SCHEMA_REGISTRY_URL)

  private val startingOffset: String by option(
    help = "From which offset is going to start Bolt processing events",
    envvar = "KAFKA_START_OFFSET"
  ).default(DEFAULT_AUTO_OFFSET)

  private val streamsStateDir: String by option(
    help = "Base dir for local kafka streams state",
    envvar = "KAFKA_STREAMS_STATE_DIR"
  ).default(DEFAULT_STREAMS_STATE_DIR)

  private val resetStreamsState: Int by option(
    help = "Whether or not to reset local persisted streams processing state",
    envvar = "KAFKA_STREAMS_RESET"
  ).int().default(DEFAULT_STREAMS_RESET)

  private val networkConfig: String by option(
    help = "The network config to use, one of: mainnet, ropsten",
    envvar = "ENKRYPTIO_NET_CONFIG"
  ).default("mainnet")

  // DI

  private val configModule = module {

    single {
      KafkaConfig(
        bootstrapServers,
        startingOffset,
        transactionalId,
        schemaRegistryUrl,
        streamsStateDir
      )
    }

    single { AppConfig(false, get()) }

    single<NetConfig> {
      when (networkConfig) {
        "mainnet" -> NetConfig.mainnet
        "ropsten" -> NetConfig.ropsten
        else -> throw IllegalArgumentException("Unrecognised network config name: $networkConfig")
      }
    }
  }

  override fun run() {

    startKoin(listOf(configModule, kafkaStreams))

    listOf<KafkaProcessor>(
      TransactionFeesProcessor(),
      EtherBalanceProcessor(),
      LoggerProcessor()
//      BlockProcessor(),
//      StateProcessor(),
//      EthTokensProcessor(),
//      ExchangeRatesProcessor()
    ).forEach {
      it.buildTopology()
      it.start(resetStreamsState == 1)
    }
  }

  companion object Defaults {

    const val DEFAULT_TRANSACTIONAL_ID = "bolt-1"
    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka-1:9091"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://kafka-schema-registry:8081"
    const val DEFAULT_AUTO_OFFSET = "earliest"
    const val DEFAULT_STREAMS_RESET = 0
    const val DEFAULT_STREAMS_STATE_DIR = "/tmp/kafka-streams"
  }
}
