package com.ethvm.kafka.connect.sources.exchanges

import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.CURRENCY_SYMBOL_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.CURRENCY_SYMBOL_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.CURRENCY_SYMBOL_DOC
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.EXCHANGE_PROVIDER_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.EXCHANGE_PROVIDER_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.EXCHANGE_PROVIDER_DOC
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.SYNC_INTERVAL_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.SYNC_INTERVAL_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.SYNC_INTERVAL_DOC
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.TOKENS_LIST_URL_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.TOKENS_LIST_URL_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.TOKENS_LIST_URL_DOC
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.TOPIC_CONFIG
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.TOPIC_CONFIG_DEFAULT
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRateSourceConnector.Config.TOPIC_CONFIG_DOC
import com.ethvm.kafka.connect.sources.exchanges.provider.CoinGeckoExchangeProvider
import com.ethvm.kafka.connect.sources.exchanges.provider.ExchangeProvider
import com.ethvm.kafka.connect.sources.exchanges.provider.ExchangeProviders
import com.ethvm.kafka.connect.sources.exchanges.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance
import org.apache.kafka.common.config.ConfigDef.Type
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector
import java.lang.IllegalArgumentException
import java.util.concurrent.TimeUnit

class ExchangeRateSourceConnector : SourceConnector() {

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

    define(EXCHANGE_PROVIDER_CONFIG, Type.STRING, EXCHANGE_PROVIDER_DEFAULT, Importance.HIGH, EXCHANGE_PROVIDER_DOC)
    define(TOPIC_CONFIG, Type.STRING, TOPIC_CONFIG_DEFAULT, Importance.HIGH, TOPIC_CONFIG_DOC)
    define(SYNC_INTERVAL_CONFIG, Type.INT, SYNC_INTERVAL_DEFAULT, Importance.HIGH, SYNC_INTERVAL_DOC)
    define(CURRENCY_SYMBOL_CONFIG, Type.STRING, CURRENCY_SYMBOL_DEFAULT, Importance.HIGH, CURRENCY_SYMBOL_DOC)
    define(TOKENS_LIST_URL_CONFIG, Type.STRING, TOKENS_LIST_URL_DEFAULT, Importance.HIGH, TOKENS_LIST_URL_DOC)
  }

  object Config {

    const val EXCHANGE_PROVIDER_CONFIG = "exchange.provider"
    const val EXCHANGE_PROVIDER_DOC = "Exchange Rates provider"
    const val EXCHANGE_PROVIDER_DEFAULT = "CoinGecko"

    const val TOPIC_CONFIG = "topic"
    const val TOPIC_CONFIG_DOC = "Topic into which to publish exchange rates"
    const val TOPIC_CONFIG_DEFAULT = "token_exchange_rates"

    const val SYNC_INTERVAL_CONFIG = "sync.interval"
    const val SYNC_INTERVAL_DOC = "How often to check for updates in seconds"
    val SYNC_INTERVAL_DEFAULT = TimeUnit.MINUTES.toSeconds(5L).toInt()

    const val CURRENCY_SYMBOL_CONFIG = "currency.symbol"
    const val CURRENCY_SYMBOL_DOC = "Currency to fetch values"
    const val CURRENCY_SYMBOL_DEFAULT = "usd"

    const val TOKENS_LIST_URL_CONFIG = "tokens.url"
    const val TOKENS_LIST_URL_DOC = "URL of Tokens list (to allow proper filtering on the API)"
    const val TOKENS_LIST_URL_DEFAULT = "https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.min.json"

    const val TOKENS_REFRESH_INTERVAL_CONFIG = "tokens.url.interval"
    const val TOKENS_REFRESH_INTERVAL_DOC = "Refresh interval for Tokens"
    val TOKENS_REFRESH_INTERVAL_DEFAULT = TimeUnit.HOURS.toSeconds(24L).toInt()

    fun provider(props: MutableMap<String, String>): ExchangeProvider {
      val value = props[EXCHANGE_PROVIDER_CONFIG] ?: EXCHANGE_PROVIDER_DEFAULT

      val provider = ExchangeProviders.of(value)
      assert(provider == null) { "Invalid provider name" }

      return when (provider) {
        ExchangeProviders.COIN_GECKO -> CoinGeckoExchangeProvider(topic(props), currency(props))
        else -> throw IllegalArgumentException("Invalid provider name")
      }
    }

    fun topic(props: MutableMap<String, String>): String {
      val value = props[TOPIC_CONFIG] ?: TOPIC_CONFIG_DEFAULT
      assert(value.isNotBlank()) { "Topic name must not be empty" }
      return value
    }

    fun syncInterval(props: MutableMap<String, String>): Int {
      val value = props[SYNC_INTERVAL_CONFIG]?.toInt() ?: SYNC_INTERVAL_DEFAULT
      assert(value > 0) { "Interval must be greater than 0" }
      return value
    }

    fun currency(props: MutableMap<String, String>): String {
      val value = props[CURRENCY_SYMBOL_CONFIG] ?: CURRENCY_SYMBOL_DEFAULT
      assert(value.isNotBlank()) { "Currency must not be empty" }
      return value
    }
  }
}
