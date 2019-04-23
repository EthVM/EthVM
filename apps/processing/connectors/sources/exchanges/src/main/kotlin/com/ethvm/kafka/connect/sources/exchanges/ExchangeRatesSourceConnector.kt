package com.ethvm.kafka.connect.sources.exchanges

import arrow.core.Some
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.EXCHANGE_PROVIDER_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.EXCHANGE_PROVIDER_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.EXCHANGE_PROVIDER_DOC
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.EXCHANGE_PROVIDER_OPTIONS_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.EXCHANGE_PROVIDER_OPTIONS_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.EXCHANGE_PROVIDER_OPTIONS_DOC
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.SYNC_INTERVAL_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.SYNC_INTERVAL_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.SYNC_INTERVAL_DOC
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.TOPIC_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.TOPIC_CONFIG_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector.Config.TOPIC_CONFIG_DOC
import com.ethvm.kafka.connect.sources.exchanges.provider.CoinGeckoTokenExchangeProvider
import com.ethvm.kafka.connect.sources.exchanges.provider.ExchangeProvider
import com.ethvm.kafka.connect.sources.exchanges.provider.ExchangeProviders
import com.ethvm.kafka.connect.sources.exchanges.provider.TokenIdEntry
import com.ethvm.kafka.connect.sources.exchanges.utils.Versions
import com.fasterxml.jackson.module.kotlin.readValue
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance
import org.apache.kafka.common.config.ConfigDef.Type
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector
import java.util.concurrent.TimeUnit

class ExchangeRatesSourceConnector : SourceConnector() {

  private lateinit var config: Map<String, String>

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {
    assert(maxTasks == 1) { "Exactly 1 task must be configured" }
    return mutableListOf(config.toMutableMap())
  }

  override fun start(props: MutableMap<String, String>) {
    config = props.toMap()
  }

  override fun stop() {
  }

  override fun version() = Versions.CURRENT

  override fun taskClass(): Class<out Task> = ExchangeRatesSourceTask::class.java

  override fun config(): ConfigDef = ConfigDef().apply {

    define(TOPIC_CONFIG, Type.STRING, TOPIC_CONFIG_DEFAULT, Importance.HIGH, TOPIC_CONFIG_DOC)
    define(SYNC_INTERVAL_CONFIG, Type.INT, SYNC_INTERVAL_DEFAULT, Importance.HIGH, SYNC_INTERVAL_DOC)
    define(EXCHANGE_PROVIDER_CONFIG, Type.STRING, EXCHANGE_PROVIDER_DEFAULT, Importance.HIGH, EXCHANGE_PROVIDER_DOC)
    define(EXCHANGE_PROVIDER_OPTIONS_CONFIG, Type.STRING, EXCHANGE_PROVIDER_OPTIONS_DEFAULT, Importance.HIGH, EXCHANGE_PROVIDER_OPTIONS_DOC)
  }

  object Config {

    const val TOPIC_CONFIG = "topic"
    const val TOPIC_CONFIG_DOC = "Topic into which to publish exchange rates"
    const val TOPIC_CONFIG_DEFAULT = "token_exchange_rates"

    const val SYNC_INTERVAL_CONFIG = "sync.interval"
    const val SYNC_INTERVAL_DOC = "How often to check for updates in seconds"
    val SYNC_INTERVAL_DEFAULT = TimeUnit.MINUTES.toSeconds(5L).toInt()

    const val EXCHANGE_PROVIDER_CONFIG = "exchange.provider"
    const val EXCHANGE_PROVIDER_DOC = "Exchange rates provider"
    const val EXCHANGE_PROVIDER_DEFAULT = "CoinGecko"

    const val EXCHANGE_PROVIDER_OPTIONS_CONFIG = "exchange.provider.options"
    const val EXCHANGE_PROVIDER_OPTIONS_DOC = "Options that will be passed to the Exchange rates provider"
    const val EXCHANGE_PROVIDER_OPTIONS_DEFAULT = "{}"

    private fun topic(props: MutableMap<String, String>): String {
      val value = props[TOPIC_CONFIG] ?: TOPIC_CONFIG_DEFAULT
      assert(value.isNotBlank()) { "Topic name must not be empty" }
      return value
    }

    fun syncInterval(props: MutableMap<String, String>): Int {
      val value = props[SYNC_INTERVAL_CONFIG]?.toInt() ?: SYNC_INTERVAL_DEFAULT
      assert(value > 0) { "Interval must be greater than 0" }
      return value
    }

    fun provider(props: MutableMap<String, String>): ExchangeProvider {
      val value = props[EXCHANGE_PROVIDER_CONFIG] ?: EXCHANGE_PROVIDER_DEFAULT
      val opts = props[EXCHANGE_PROVIDER_OPTIONS_CONFIG] ?: EXCHANGE_PROVIDER_OPTIONS_DEFAULT

      when (val provider = ExchangeProviders.of(value)) {
        is Some -> {
          return when (provider.t) {
            ExchangeProviders.COIN_GECKO -> {
              val options = mutableMapOf<String, Any>("topic" to topic(props))

              javaClass.getResourceAsStream(opts)
                ?.let { stream ->
                  CoinGeckoTokenExchangeProvider.jackson.readValue<Map<String, Any>>(stream)
                }
                ?.forEach { (k, v) -> options[k] = v }

              javaClass.getResourceAsStream("/coingecko/coingecko-eth.json")
                ?.let { stream ->
                  CoinGeckoTokenExchangeProvider.jackson.readValue<List<TokenIdEntry>>(stream).let { options["tokens_ids"] = it }
                }

              CoinGeckoTokenExchangeProvider(options)
            }
          }
        }
        else -> throw IllegalArgumentException("Invalid provider name")
      }
    }
  }
}
