package com.ethvm.processing.cmd

import com.ethvm.common.config.ChainId
import com.ethvm.common.config.NetConfig
import com.ethvm.processing.*
import com.ethvm.processing.processors.Processor
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.options.split
import com.github.ajalt.clikt.parameters.types.int
import org.koin.core.KoinApplication
import org.koin.core.context.startKoin
import org.koin.core.qualifier.named
import org.koin.dsl.module
import java.io.File

abstract class AbstractCliktCommand(help: String) : CliktCommand(help) {

  protected val jdbcUrl: String by option(
    help = "Database connect url",
    envvar = "JDBC_URL"
  )
    .default(Cli.DEFAULT_JDBC_URL)

  protected val jdbcUsername: String by option(
    help = "Database username",
    envvar = "JDBC_USERNAME"
  )
    .default(Cli.DEFAULT_JDBC_USERNAME)

  protected val jdbcPassword: String by option(
    help = "Database password",
    envvar = "JDBC_PASSWORD"
  )
    .default(Cli.DEFAULT_JDBC_PASSWORD)

  protected val jdbcMaxConnections: Int by option(
    help = "Max db connections",
    envvar = "JDBC_MAX_CONNECTIONS"
  )
    .int()
    .default(Cli.DEFAULT_JDBC_MAX_CONNECTIONS)

  protected val bootstrapServers: String by option(
    help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster",
    envvar = "KAFKA_BOOTSTRAP_SERVERS"
  )
    .default(Cli.DEFAULT_BOOTSTRAP_SERVERS)

  protected val schemaRegistryUrl: String by option(
    help = "Kafka schema registry url",
    envvar = "KAFKA_SCHEMA_REGISTRY_URL"
  )
    .default(Cli.DEFAULT_SCHEMA_REGISTRY_URL)

  protected val storageDir: String by option(
    help = "Base dir for local kafka streams state",
    envvar = "ETHVM_STORAGE_DIR"
  )
    .default(Cli.DEFAULT_STORAGE_DIR)

  protected val wsUrl: String by option(
    help = "The websocket url for web3",
    envvar = "WEB3_WS_URL"
  )
    .default(Cli.DEFAULT_WEB3_WS_URL)

  protected val network: String by option(
    "-n", "--network",
    help = "Ethereum network we are processing e.g. mainnet, ropsten...",
    envvar = "ETH_NETWORK"
  )
    .default(Cli.DEFAULT_NETWORK)

  protected val processorsList: List<String> by option(
    "-p", "--processors",
    help = "List of processors to use",
    envvar = "PROCESSOR_LIST"
  )
    .split(",")
    .default(Cli.DEFAULT_PROCESSORS)

  protected fun inject(): KoinApplication {

    // deteermine network related configs
    val chainId = ChainId.forName(network)
    requireNotNull(chainId) { "Chain id not found for network: $network" }

    val netConfig = NetConfig.forChainId(chainId)
    requireNotNull(netConfig) { "Network config not found for chainId = $chainId" }

    // create storage directory if it doesn't exist
    val storage = File(storageDir)
    storage.mkdirs()

    // create config module
    val configModule = module {

      single<NetConfig> { netConfig }

      single(named("storageDir")) { storageDir }

      single(named("wsUrl")) { wsUrl }

      single(named("scheduledThreadCount")) { 3 }

      single { DbConfig(jdbcUrl, jdbcUsername, jdbcPassword, jdbcMaxConnections) }

      single { KafkaConfig(bootstrapServers, schemaRegistryUrl) }
    }

    val modules = listOf(configModule, threadingModule, dbModule, kafkaModule, web3Module)

    return startKoin {
      printLogger()
      modules(modules)
    }
  }

  protected fun instantiateProcessors(processorList: List<String>): List<Processor> {

    return processorList
      .map { name ->
        val processorEnum = ProcessorEnum.forName(name)
        requireNotNull(processorEnum) { "Processor not found with name = $name" }
        // instantiate the processor
        processorEnum.newInstance()
      }
  }
}
