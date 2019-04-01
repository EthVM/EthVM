package io.enkrypt.kafka.connect.sources.exchanges

import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.common.config.ConfigDef
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

  override fun taskClass(): Class<out Task> = CoinGeckoExchangeRateSourceTask::class.java

  override fun config(): ConfigDef = ConfigDef().apply {

    // Topic Name
    define(
      Config.TOPIC_CONFIG,
      ConfigDef.Type.STRING,
      Config.TOPIC_CONFIG_DEFAULT,
      ConfigDef.Importance.HIGH,
      Config.TOPIC_CONFIG_DOC
    )

    // Sync Interval
    define(
      Config.SYNC_INTERVAL_CONFIG,
      ConfigDef.Type.INT,
      Config.SYNC_INTERVAL_DEFAULT,
      ConfigDef.Importance.HIGH,
      Config.SYNC_INTERVAL_DOC
    )
  }

  object Config {

    const val TOPIC_CONFIG = "topic"
    const val TOPIC_CONFIG_DOC = "Topic into which to publish exchange rates"
    const val TOPIC_CONFIG_DEFAULT = "raw_exchange_rates"

    const val SYNC_INTERVAL_CONFIG = "sync.interval"
    const val SYNC_INTERVAL_DOC = "How often to check for updates in seconds"
    val SYNC_INTERVAL_DEFAULT = TimeUnit.HOURS.toSeconds(1L).toInt() // every 1 hour

    fun topic(props: MutableMap<String, String>) = props[TOPIC_CONFIG] ?: TOPIC_CONFIG_DEFAULT

    fun syncInterval(props: MutableMap<String, String>) = props[SYNC_INTERVAL_CONFIG]?.toInt() ?: SYNC_INTERVAL_DEFAULT
  }
}
