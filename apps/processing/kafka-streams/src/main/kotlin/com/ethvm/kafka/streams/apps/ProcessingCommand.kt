package com.ethvm.kafka.streams.apps

import com.ethvm.common.config.NetConfig
import com.ethvm.kafka.streams.config.AppConfig
import com.ethvm.kafka.streams.config.KafkaConfig
import com.ethvm.kafka.streams.config.Web3Config
import com.ethvm.kafka.streams.Modules.kafkaStreams
import com.ethvm.kafka.streams.Modules.web3
import com.ethvm.kafka.streams.processors.BlockMetricsProcessor
import com.ethvm.kafka.streams.processors.CanonicalBlockHeaderProcessor
import com.ethvm.kafka.streams.processors.CanonicalCountProcessor
import com.ethvm.kafka.streams.processors.CanonicalReceiptsProcessor
import com.ethvm.kafka.streams.processors.CanonicalTracesProcessor
import com.ethvm.kafka.streams.processors.CanonicalTransactionsProcessor
import com.ethvm.kafka.streams.processors.CanonicalUnclesProcessor
import com.ethvm.kafka.streams.processors.ContractMetadataProcessor
import com.ethvm.kafka.streams.processors.FungibleBalanceDeltaProcessor
import com.ethvm.kafka.streams.processors.FungibleBalanceProcessor
import com.ethvm.kafka.streams.processors.KafkaProcessor
import com.ethvm.kafka.streams.processors.NonFungibleBalanceProcessor
import com.ethvm.kafka.streams.processors.TransactionCountProcessor
import com.ethvm.kafka.streams.processors.TransactionFeesProcessor

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.types.int
import org.koin.core.context.startKoin
import org.koin.dsl.module

class ProcessingCommand : CliktCommand() {

  // General - CLI

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

  private val replicationFactor: Int by option(
    help = "Replication factor for internal topics",
    envvar = "KAFKA_REPLICATION_FACTOR"
  ).int().default(DEFAULT_STREAMS_REPLICATION_FACTOR)

  private val resetStreamsState: Int by option(
    help = "Whether or not to reset local persisted streams processing state",
    envvar = "KAFKA_STREAMS_RESET"
  ).int().default(DEFAULT_STREAMS_RESET)

  private val networkConfig: String by option(
    help = "The network config to use, one of: mainnet, ropsten, dev",
    envvar = "ETH_NET_CONFIG"
  ).default(DEFAULT_ETH_NET_CONFIG)

  private val wsUrl: String by option(
    help = "The websocket url for web3",
    envvar = "WEB3_WS_URL"
  ).default(DEFAULT_WEB3_WS_URL)

  // DI

  private val configModule = module {

    single {
      KafkaConfig(
        bootstrapServers,
        startingOffset,
        schemaRegistryUrl,
        streamsStateDir,
        replicationFactor
      )
    }

    single {
      Web3Config(
        wsUrl
      )
    }

    single { AppConfig(false, get(), get()) }

    single<NetConfig> {
      when (networkConfig) {
        "mainnet" -> NetConfig.mainnet
        "ropsten" -> NetConfig.ropsten
        "dev" -> NetConfig.dev
        else -> throw IllegalArgumentException("Unrecognised network config name: $networkConfig")
      }
    }
  }

  override fun run() {

    startKoin {
      modules(configModule, kafkaStreams, web3)
    }

    listOf<KafkaProcessor>(
      CanonicalBlockHeaderProcessor(),
      CanonicalTransactionsProcessor(),
      CanonicalReceiptsProcessor(),
      CanonicalTracesProcessor(),
      CanonicalUnclesProcessor(),
      CanonicalCountProcessor(),
      TransactionCountProcessor(),
      TransactionFeesProcessor(),
      FungibleBalanceDeltaProcessor(),
      FungibleBalanceProcessor(),
      NonFungibleBalanceProcessor(),
      BlockMetricsProcessor(),
      ContractMetadataProcessor()
    ).forEach {
      it.buildTopology()
      it.start(resetStreamsState == 1)
    }
  }

  companion object Defaults {

    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka-1:9091"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://kafka-schema-registry:8081"
    const val DEFAULT_AUTO_OFFSET = "earliest"
    const val DEFAULT_STREAMS_RESET = 0
    const val DEFAULT_STREAMS_REPLICATION_FACTOR = 1
    const val DEFAULT_STREAMS_STATE_DIR = "/tmp/kafka-streams"
    const val DEFAULT_WEB3_WS_URL = "ws://localhost:8546"
    const val DEFAULT_ETH_NET_CONFIG = "mainnet"
  }
}

fun main(args: Array<String>) {
  ProcessingCommand().main(args)
}
