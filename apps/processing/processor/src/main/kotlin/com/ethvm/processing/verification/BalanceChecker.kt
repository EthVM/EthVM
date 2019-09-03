package com.ethvm.processing.verification

import com.ethvm.db.Tables.BALANCE
import com.ethvm.db.tables.records.BalanceRecord
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import mu.KotlinLogging
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.websocket.WebSocketService
import java.math.BigDecimal
import java.util.concurrent.CompletableFuture
import kotlin.system.exitProcess

class BalanceChecker(val wsUrl: String) : Runnable {

  private val logger = KotlinLogging.logger {}

  private val dataSourceConfig = HikariConfig().apply {
    jdbcUrl = "jdbc:postgresql://localhost/ethvm_dev?ssl=false"
    username = "postgres"
    password = "1234"
    maximumPoolSize = 10
    isAutoCommit = false
    addDataSourceProperty("cachePrepStmts", "true")
    addDataSourceProperty("prepStmtCacheSize", "250")
    addDataSourceProperty("prepStmtCacheSqlLimit", "2048")
  }

  private val dataSource = HikariDataSource(dataSourceConfig)

  private val web3: Web3j by lazy {
    val wsService = WebSocketService(wsUrl, false)
    wsService.connect()
    Web3j.build(wsService)
  }

  private val dbContext = DSL.using(dataSource, SQLDialect.POSTGRES)

  override fun run() {

    val cursor = dbContext
      .selectFrom(BALANCE)
      .where(BALANCE.CONTRACT_ADDRESS.isNull)
//      .and(BALANCE.BLOCK_NUMBER.mod(10).eq(BigDecimal.ZERO))
      .orderBy(BALANCE.BLOCK_NUMBER.asc())
      .fetchSize(1000)
      .fetchLazy()

    var matched = 0
    var failed = 0

    val batchSize = 256
    var batch = emptyList<BalanceRecord>()

    while (cursor.hasNext()) {

      val balance = cursor.fetchNext()

      batch = batch + balance
      if (batch.size == batchSize) {
        val (matches, failures) = processBatch(batch)
        matched += matches
        failed += failures
        batch = emptyList()

        logger.info { "Matched = $matched, failures = $failed" }
      }
    }

    cursor.close()

    processBatch(batch)

    logger.info { "Final report. Matched = $matched, failures = $failed" }

    dbContext.close()

    exitProcess(0)
  }

  private fun processBatch(batch: List<BalanceRecord>): Pair<Int, Int> {

    val futures = batch
      .map { balance ->

          web3
          .ethGetBalance(balance.address, DefaultBlockParameter.valueOf(balance.blockNumber.toBigInteger()))
          .sendAsync()
            .thenApply { result -> Pair(balance, result.balance) }
      }

    CompletableFuture.allOf(*futures.toTypedArray()).join()

    return futures
      .map { it.join() }
      .map { (ethvmBalance, parityBalance) ->

        when (parityBalance) {
            ethvmBalance.balance.toBigIntegerExact() -> Pair(1, 0)
            else -> {

              logger.error { "Comparison failure. Address = ${ethvmBalance.address}, ethvm = ${ethvmBalance.balance}, parity = $parityBalance" }

              Pair(0, 1)
            }
        }
      }
      .reduce { a, b -> Pair(a.first + b.first, a.second + b.second) }
  }
}

fun main(args: Array<String>) {

  val checker = BalanceChecker("ws://localhost:8546")

  checker.run()
}
