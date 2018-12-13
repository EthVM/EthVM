package io.enkrypt.kafka.connect.sources.tokens

import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance.HIGH
import org.apache.kafka.common.config.ConfigDef.Type.STRING
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector

class EthListsTokensSourceConnector : SourceConnector() {

  private lateinit var config: MutableMap<String, String>

  override fun version() = Versions.of("eth-lists-tokens-source-version.properties")

  override fun start(props: MutableMap<String, String>?) {
    config = props!!
  }

  override fun stop() {
  }

  override fun taskClass(): Class<out Task> = EthListsTokensSourceTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {
    if (maxTasks != 1) throw IllegalStateException("Exactly 1 task must be configured")
    return listOf(config).toMutableList()
  }

  override fun config(): ConfigDef = ConfigDef().apply {

    define(
      Config.TOPIC_CONFIG, STRING, "contract-metadata", HIGH,
      Config.TOPIC_CONFIG_DOC
    )
    define(
      Config.TOKENS_URL_CONFIG,
      STRING,
      "https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.min.json",
      HIGH,
      Config.TOKENS_URL_DOC
    )
    define(
      Config.SYNC_INTERVAL_CONFIG,
      ConfigDef.Type.INT,
      21600,
      HIGH,
      Config.SYNC_INTERVAL_DOC
    ) // every 6 hours by default
  }

  object Config {

    const val TOPIC_CONFIG = "topic"
    const val TOPIC_CONFIG_DOC = "Topic into which to publish"

    const val TOKENS_URL_CONFIG = "tokens.url"
    const val TOKENS_URL_DOC = "Url of json file from which to download info"

    const val SYNC_INTERVAL_CONFIG = "sync.interval"
    const val SYNC_INTERVAL_DOC = "How often to check for updates in seconds"

    fun topic(props: MutableMap<String, String>) = props[TOPIC_CONFIG]!!

    fun tokensUrl(props: MutableMap<String, String>) = props[TOKENS_URL_CONFIG]!!

    fun syncInterval(props: MutableMap<String, String>) = props[SYNC_INTERVAL_CONFIG]!!.toInt()
  }
}
