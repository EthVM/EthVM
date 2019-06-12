package com.ethvm.kafka.connect.sources.exchanges

import com.ethvm.kafka.connect.sources.exchanges.provider.ExchangeProvider
import com.ethvm.kafka.connect.sources.exchanges.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.concurrent.TimeUnit

class ExchangeRatesSourceTask(
  private val sleep: Long = SLEEP
) : SourceTask() {

  private lateinit var exchangeProvider: ExchangeProvider
  private var syncInterval: Int = 0

  private var lastSyncAt: Instant = Instant.EPOCH

  private val logger = KotlinLogging.logger {}

  override fun start(props: MutableMap<String, String>) {

    exchangeProvider = ExchangeRatesSourceConnector.Config.provider(props)
    syncInterval = ExchangeRatesSourceConnector.Config.syncInterval(props)

    logger.info { "Starting ExchangeRatesSourceTask - Provider: $exchangeProvider / Sync Interval (secs): $syncInterval" }
  }

  override fun stop() {
    logger.debug { "Stopping ExchangeRatesSourceTask" }
  }

  override fun version(): String = Versions.CURRENT

  override fun poll(): List<SourceRecord> {

    try {

      if (!shouldSync()) {
        Thread.sleep(sleep)
        return emptyList()
      }

      val records = exchangeProvider.fetch()
      lastSyncAt = Instant.now()

      return records
    } catch (ex: Exception) {

      logger.error(ex) { "ExchangeRatesSourceTask - Exception detected" }

      return when (ex) {

        // return an empty list as we can try another poll
        is RetriableException -> emptyList()

        // otherwise re-throw
        else -> throw ex
      }
    }
  }

  private fun shouldSync() = ChronoUnit.SECONDS.between(lastSyncAt, Instant.now()) > syncInterval

  companion object {

    val SLEEP = TimeUnit.SECONDS.toMillis(5)
  }
}
