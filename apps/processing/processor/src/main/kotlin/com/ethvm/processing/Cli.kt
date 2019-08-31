package com.ethvm.processing

import com.ethvm.common.config.ChainId
import com.ethvm.common.config.NetConfig
import com.ethvm.processing.processors.BasicDataProcessor
import com.ethvm.processing.processors.BlockMetricsHeaderProcessor
import com.ethvm.processing.processors.BlockMetricsTraceProcessor
import com.ethvm.processing.processors.ContractLifecycleProcessor
import com.ethvm.processing.processors.EtherBalanceProcessor
import com.ethvm.processing.processors.ParitySyncStatusProcessor
import com.ethvm.processing.processors.Processor
import com.ethvm.processing.processors.TokenBalanceProcessor
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.options.split
import com.github.ajalt.clikt.parameters.types.choice
import com.github.ajalt.clikt.parameters.types.int
import com.github.ajalt.clikt.parameters.types.long
import mu.KotlinLogging
import org.koin.core.Koin
import org.koin.core.context.startKoin
import org.koin.core.qualifier.named
import org.koin.dsl.module
import java.io.File
import java.math.BigInteger
import java.util.concurrent.ExecutorService
import kotlin.reflect.KClass
import kotlin.system.exitProcess

class Cli : CliktCommand() {

  private val logger = KotlinLogging.logger {}

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

  private val network: String by option(
    "-n", "--network",
    help = "Ethereum network we are processing e.g. mainnet, ropsten...",
    envvar = "ETH_NETWORK"
  ).default(DEFAULT_NETWORK)

  private val processorsList: List<String> by option(
    "-p", "--processors",
    help = "List of processors to use",
    envvar = "PROCESSOR_LIST"
  ).split(",").default(DEFAULT_PROCESSORS)

  private val action: String by option(
    "-a", "--action",
    help = "Action to perform"
  ).choice(*Action.values().map { it.name.toLowerCase() }.toTypedArray())
    .default(Action.Server.name.toLowerCase())

  private val blockNumber: Long? by option(
    "-b", "--block-number",
    help = "Block number"
  ).long()

  override fun run() {

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

    val app = startKoin {
      printLogger()
      modules(modules)
    }

    //

    when (Action.forName(action)) {
      Action.Server -> runAsServer(app.koin, processorsList)
      Action.Reset -> reset(processorsList)
      Action.Rewind -> {
        requireNotNull(blockNumber) { "blockNumber must be specified" }
        rewind(blockNumber!!.toBigInteger(), processorsList)
      }
      else -> {}  // do nothing, action validation by clickt prevents this
    }

  }

  private fun instantiateProcessors(processorList: List<String>): List<Processor> {
    // instantiate
    logger.info { "Instantiating processors: $processorList" }

    return processorList
      .map { name ->
        val processorEnum = ProcessorEnum.forName(name)
        requireNotNull(processorEnum) { "Processor not found with name = $name" }
        // instantiate the processor
        processorEnum.newInstance()
      }
  }

  private fun reset(processorList: List<String>) {

    // instantiate
    val processors = instantiateProcessors(processorList)

    processors
      .forEach {
        it.initialise()
        it.reset()
      }

    exitProcess(0)
  }

  private fun rewind(blockNumber: BigInteger, processorList: List<String>) {

    // instantiate
    val processors = instantiateProcessors(processorList)

    processors
      .forEach {
        it.initialise()
        it.rewindUntil(blockNumber)
      }

    exitProcess(0)
  }

  private fun runAsServer(koin: Koin, processorList: List<String>) {

    // instantiate
    val processors = instantiateProcessors(processorList)

    // register shutdown hook

    val executor = koin.get<ExecutorService>()

    Runtime.getRuntime()
      .addShutdownHook(Thread(Runnable {

        logger.info { "Shutdown detected, stopping processors" }

        processors
          .forEach { it.stop() }

        logger.info { "All processors stopped" }

      }))

    // initialise

    logger.info { "Initialising processors" }

    processors
      .forEach { processor ->
        processor.initialise()
        logger.info { "Initialisation complete for ${processor.javaClass}" }
      }

    // run

    logger.info { "Starting processors" }

    processors
      .forEach{ executor.submit(it) }

  }

  companion object Defaults {

    const val DEFAULT_JDBC_URL = "jdbc:postgresql://localhost/ethvm_dev?ssl=false"
    const val DEFAULT_JDBC_USERNAME = "postgres"
    const val DEFAULT_JDBC_PASSWORD = "1234"
    const val DEFAULT_JDBC_MAX_CONNECTIONS = 30

    const val DEFAULT_TOPIC_BLOCKS = "ropsten_blocks"
    const val DEFAULT_TOPIC_TRACES = "ropsten_traces"
    const val DEFAULT_TOPIC_PARITY_SYNC_STATE = "ropsten_parity_sync_state"

    const val DEFAULT_NETWORK = "ropsten"

    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka-1:9091"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://kafka-schema-registry:8081"
    const val DEFAULT_STORAGE_DIR = "./processor-state"
    const val DEFAULT_WEB3_WS_URL = "ws://localhost:8546"

    val DEFAULT_PROCESSORS = ProcessorEnum
      .values()
      .map { it.name }

  }

}

enum class Action {

  Server,
  Reset,
  Rewind;

  companion object {
    fun forName(name: String) = values().firstOrNull { it.name.toLowerCase() == name.toLowerCase() }
  }



}

enum class ProcessorEnum(val clazz: KClass<out Processor>) {

  BasicData(BasicDataProcessor::class),
  BlockMetricsHeader(BlockMetricsHeaderProcessor::class),
  BlockMetricsTrace(BlockMetricsTraceProcessor::class),
  ContractLifecycle(ContractLifecycleProcessor::class),
  EtherBalance(EtherBalanceProcessor::class),
  TokenBalance(TokenBalanceProcessor::class),
  ParitySyncStatus(ParitySyncStatusProcessor::class);

  companion object {
    fun forName(name: String) = values().firstOrNull { it.name == name }
  }

  fun newInstance() = clazz.constructors.first().call()

}

fun main(args: Array<String>) {
  Cli().main(args)
}
