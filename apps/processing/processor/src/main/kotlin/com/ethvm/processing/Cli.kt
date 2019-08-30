package com.ethvm.processing

import com.ethvm.common.config.ChainId
import com.ethvm.common.config.NetConfig
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.types.int
import java.io.File

class Cli : CliktCommand() {

  // General - CLI

  private val jdbcUrl: String by option(
    help = "Database connect url",
    envvar = "JDBC_URL"
  ).default(DEFAULT_JDBC_URL)

  private val jdbcUsername: String by option(
    help = "Database username",
    envvar = "JDBC_USERNAME"
  ).default(DEFAULT_JDBC_USERNAME)

  private val jdbcPassword: String by option(
    help = "Database password",
    envvar = "JDBC_PASSWORD"
  ).default(DEFAULT_JDBC_PASSWORD)

  private val jdbcMaxConnections: Int by option(
    help = "Max db connections",
    envvar = "JDBC_MAX_CONNECTIONS"
  ).int().default(DEFAULT_JDBC_MAX_CONNECTIONS)

  private val bootstrapServers: String by option(
    help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster",
    envvar = "KAFKA_BOOTSTRAP_SERVERS"
  ).default(DEFAULT_BOOTSTRAP_SERVERS)

  private val schemaRegistryUrl: String by option(
    help = "Kafka schema registry url",
    envvar = "KAFKA_SCHEMA_REGISTRY_URL"
  ).default(DEFAULT_SCHEMA_REGISTRY_URL)

  private val storageDir: String by option(
    help = "Base dir for local kafka streams state",
    envvar = "ETHVM_STORAGE_DIR"
  ).default(DEFAULT_STORAGE_DIR)

  private val wsUrl: String by option(
    help = "The websocket url for web3",
    envvar = "WEB3_WS_URL"
  ).default(DEFAULT_WEB3_WS_URL)

  private val topicBlocks: String by option(
    help = "",
    envvar = "TOPIC_BLOCKS"
  ).default(DEFAULT_TOPIC_BLOCKS)

  private val topicTraces: String by option(
    help = "",
    envvar = "TOPIC_TRACES"
  ).default(DEFAULT_TOPIC_TRACES)

  private val topicParitySyncState: String by option(
    help = "",
    envvar = "TOPIC_PARITY_SYNC_STATE"
  ).default(DEFAULT_TOPIC_PARITY_SYNC_STATE)

  private val network: String by option(
    help = "",
    envvar = "ETH_NETWORK"
  ).default(DEFAULT_NETWORK)

  override fun run() {

    val chainId = ChainId.forName(network)
    requireNotNull(chainId) { "Chain id not found for network: $network" }

    val netConfig = NetConfig.forChainId(chainId)
    requireNotNull(netConfig) { "Network config not found for chainId = $chainId" }

    // create storage directory if it doesn't exist
    val storage = File(storageDir)
    storage.mkdirs()

    val app = ProcessorApp(
      netConfig,
      jdbcUrl,
      jdbcUsername,
      jdbcPassword,
      jdbcMaxConnections,
      bootstrapServers,
      schemaRegistryUrl,
      storageDir,
      topicBlocks,
      topicTraces,
      topicParitySyncState,
      wsUrl
    )

    app.start()

  }

  companion object Defaults {

    const val DEFAULT_JDBC_URL="jdbc:postgresql://localhost/ethvm_dev?ssl=false"
    const val DEFAULT_JDBC_USERNAME="postgres"
    const val DEFAULT_JDBC_PASSWORD="1234"
    const val DEFAULT_JDBC_MAX_CONNECTIONS=30

    const val DEFAULT_TOPIC_BLOCKS = "ropsten_blocks"
    const val DEFAULT_TOPIC_TRACES = "ropsten_traces"
    const val DEFAULT_TOPIC_PARITY_SYNC_STATE = "ropsten_parity_sync_state"

    const val DEFAULT_NETWORK = "ropsten"

    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka-1:9091"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://kafka-schema-registry:8081"
    const val DEFAULT_STORAGE_DIR = "./processor-state"
    const val DEFAULT_WEB3_WS_URL = "ws://localhost:8546"
  }

}

fun main(args: Array<String>) {
  Cli().main(args)
}
