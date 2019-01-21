package io.enkrypt.kafka.streams

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.types.int
import io.enkrypt.common.config.NetConfig
import io.enkrypt.kafka.streams.config.AppConfig
import io.enkrypt.kafka.streams.config.KafkaConfig
import io.enkrypt.kafka.streams.di.Modules.kafkaStreams
import io.enkrypt.kafka.streams.processors.BlockProcessor
import io.enkrypt.kafka.streams.processors.KafkaProcessor
import io.enkrypt.kafka.streams.processors.StateProcessor
import org.koin.dsl.module.module
import org.koin.standalone.StandAloneContext.startKoin
import java.lang.IllegalArgumentException

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

  private val resetStreamsState: Int by option(
    help = "Whether or not to reset local persisted streams processing state",
    envvar = "KAFKA_STREAMS_RESET"
  ).int().default(DEFAULT_STREAMS_RESET)

  private val networkConfig: String by option(
    help = "The network config to use, one of: mainnet, testnet, ropsten",
    envvar = "ENKRYPTIO_NET_CONFIG"
  ).default("mainnet")

  // DI

  private val configModule = module {

    single {
      KafkaConfig(
        bootstrapServers,
        startingOffset,
        transactionalId,
        schemaRegistryUrl
      )
    }

    single { AppConfig(false, get()) }

    single {
      when (networkConfig) {
        "mainnet" -> NetConfig.mainnet
        "testnet" -> NetConfig.testnet
        "ropsten" -> NetConfig.ropsten
        else -> throw IllegalArgumentException("Unrecognised network config name: $networkConfig")
      }
    }
  }

  override fun run() {

    startKoin(listOf(configModule, kafkaStreams))

    listOf<KafkaProcessor>(
      BlockProcessor(),
      StateProcessor()
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
  }
}
