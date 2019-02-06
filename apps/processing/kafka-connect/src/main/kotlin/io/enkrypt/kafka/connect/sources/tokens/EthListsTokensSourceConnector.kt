package io.enkrypt.kafka.connect.sources.tokens

import io.enkrypt.kafka.connect.sources.tokens.EthListsTokensSourceConnector.Config.SYNC_INTERVAL_DEFAULT
import io.enkrypt.kafka.connect.sources.tokens.EthListsTokensSourceConnector.Config.TOKENS_DEFAULT_URL
import io.enkrypt.kafka.connect.sources.tokens.EthListsTokensSourceConnector.Config.TOPIC_CONFIG_DEFAULT
import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance.HIGH
import org.apache.kafka.common.config.ConfigDef.Type.STRING
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector
import java.util.concurrent.TimeUnit

class EthListsTokensSourceConnector : SourceConnector() {

  private lateinit var config: Map<String, String>

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {
    config = props.toMap()
  }

  override fun stop() {
  }

  override fun taskClass(): Class<out Task> = EthListsTokensSourceTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {
    if (maxTasks != 1) throw IllegalStateException("Exactly 1 task must be configured")
    return mutableListOf(config.toMutableMap())
  }

  override fun config(): ConfigDef = ConfigDef().apply {

    define(
      Config.TOPIC_CONFIG,
      STRING,
      TOPIC_CONFIG_DEFAULT,
      HIGH,
      Config.TOPIC_CONFIG_DOC
    )

    define(
      Config.TOKENS_URL_CONFIG,
      STRING,
      TOKENS_DEFAULT_URL,
      HIGH,
      Config.TOKENS_URL_DOC
    )

    define(
      Config.SYNC_INTERVAL_CONFIG,
      ConfigDef.Type.INT,
      SYNC_INTERVAL_DEFAULT,
      HIGH,
      Config.SYNC_INTERVAL_DOC
    )
  }

  object Config {

    const val TOPIC_CONFIG = "topic"
    const val TOPIC_CONFIG_DOC = "Topic into which to publish"
    const val TOPIC_CONFIG_DEFAULT = "eth-tokens-list"

    const val TOKENS_URL_CONFIG = "tokens.url"
    const val TOKENS_URL_DOC = "Url of json file from which to download info"
    const val TOKENS_DEFAULT_URL = "https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.min.json"

    const val SYNC_INTERVAL_CONFIG = "sync.interval"
    const val SYNC_INTERVAL_DOC = "How often to check for updates in seconds"
    val SYNC_INTERVAL_DEFAULT = TimeUnit.HOURS.toSeconds(6L).toInt() // every 6 hours by default

    fun topic(props: MutableMap<String, String>) = props[TOPIC_CONFIG] ?: TOPIC_CONFIG_DEFAULT

    fun tokensUrl(props: MutableMap<String, String>) = props[TOKENS_URL_CONFIG] ?: TOKENS_DEFAULT_URL

    fun syncInterval(props: MutableMap<String, String>) = props[SYNC_INTERVAL_CONFIG]?.toInt() ?: SYNC_INTERVAL_DEFAULT
  }
}
