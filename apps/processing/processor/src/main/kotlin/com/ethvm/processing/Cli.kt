package com.ethvm.processing

import com.ethvm.processing.cmd.Init
import com.ethvm.processing.cmd.LastChangeBlockNumberOverride
import com.ethvm.processing.cmd.LogLastChangeBlockNumber
import com.ethvm.processing.cmd.Process
import com.ethvm.processing.cmd.Reset
import com.ethvm.processing.cmd.Rewind
import com.ethvm.processing.cmd.Verify
import com.ethvm.processing.processors.*
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.subcommands
import kotlin.reflect.KClass

class Cli : CliktCommand() {

  enum class ProcessorEnum(private val clazz: KClass<out Processor>) {

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

  override fun run() {
  }

  companion object Defaults {

    const val DEFAULT_JDBC_URL = "jdbc:postgresql://localhost/ethvm_dev?ssl=false"
    const val DEFAULT_JDBC_USERNAME = "postgres"
    const val DEFAULT_JDBC_PASSWORD = "1234"
    const val DEFAULT_JDBC_MAX_CONNECTIONS = 20

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

fun main(args: Array<String>) {
  Cli()
    .subcommands(Init(), LogLastChangeBlockNumber(), LastChangeBlockNumberOverride(), Process(), Rewind(), Reset(), Verify())
    .main(args)
}
