package com.ethvm.processing.cmd

import com.ethvm.processing.Cli
import com.ethvm.processing.threadingModule
import com.ethvm.processing.verification.BalanceChecker
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import com.github.ajalt.clikt.parameters.options.split
import com.github.ajalt.clikt.parameters.types.int
import org.koin.core.context.startKoin
import java.util.concurrent.ExecutorService

class Verify : CliktCommand(help = "Verification tool to check that data is stored as it should") {

  private val wsUrl: String by option(
    help = "The websocket url for web3",
    envvar = "WEB3_WS_URL"
  )
    .default(Cli.DEFAULT_WEB3_WS_URL)

  private val jdbcUrl: String by option(
    help = "The jdbc Url url to connect",
    envvar = "JDBC_URL"
  )
    .default("jdbc:postgresql://localhost:5432/ethvm_dev?ssl=false")

  private val jdbcUsername: String by option(
    help = "The jdbc username to connect",
    envvar = "JDBC_USERNAME"
  )
    .default("postgres")

  private val jdbcPassword: String by option(
    help = "The jdbc password to connect",
    envvar = "JDBC_PASSWORD"
  )
    .default("1234")

  private val jdcUser: String by option(
    help = "The websocket url for web3",
    envvar = "WEB3_WS_URL"
  )
    .default("jdbc:postgresql://localhost:5432/ethvm_dev?ssl=false")

  private val startBlock: String by option(
    "-s", "--start-block",
    help = "Starting block number"
  )
    .default("0")

  private val interval: Int by option(
    help = "Interval at which checks are going to be made"
  )
    .int()
    .default(5)

  private val validators: List<String> by option(
    help = "List of validators to execute"
  )
    .split(",")
    .default(listOf("balances"))

  override fun run() {
    val app = startKoin {
      modules(threadingModule)
    }

    val executor = app.koin.get<ExecutorService>()

    validators.map {
      when (it) {
        "balances" -> BalanceChecker(wsUrl, startBlock.toBigInteger(), interval, jdbcUrl, jdbcUsername, jdbcPassword)
        else -> Runnable {}
      }
    }.forEach {
      executor.submit(it)
    }

    Runtime.getRuntime()
      .addShutdownHook(Thread(Runnable {
        executor.shutdownNow()
      }))
  }
}
