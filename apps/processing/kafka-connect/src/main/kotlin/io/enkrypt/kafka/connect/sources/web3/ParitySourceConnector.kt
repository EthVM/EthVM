package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.SCHEMA_REGISTRY_URL_CONFIG
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.SCHEMA_REGISTRY_URL_DEFAULT
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.SCHEMA_REGISTRY_URL_DOC
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.TOPIC_BLOCKS_CONFIG
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.TOPIC_BLOCKS_DEFAULT
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.TOPIC_BLOCKS_DOC
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.WS_URL_CONFIG
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.WS_URL_DEFAULT
import io.enkrypt.kafka.connect.sources.web3.ParitySourceConnector.Config.WS_URL_DOC
import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector

// @Alpha - Not ready for prime time
class ParitySourceConnector : SourceConnector() {

  private lateinit var config: MutableMap<String, String>

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>?) {
    config = props!!
  }

  override fun stop() {
  }

  override fun taskClass(): Class<out Task> = ParitySourceTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {
    if (maxTasks != 1) throw IllegalStateException("Exactly 1 task must be configured")
    return listOf(config).toMutableList()
  }

  override fun config(): ConfigDef = ConfigDef().apply {

    define(WS_URL_CONFIG, ConfigDef.Type.STRING, WS_URL_DEFAULT, ConfigDef.Importance.HIGH, WS_URL_DOC)
    define(TOPIC_BLOCKS_CONFIG, ConfigDef.Type.STRING, TOPIC_BLOCKS_DEFAULT, ConfigDef.Importance.HIGH, TOPIC_BLOCKS_DOC)
    define(SCHEMA_REGISTRY_URL_CONFIG, ConfigDef.Type.STRING, SCHEMA_REGISTRY_URL_DEFAULT, ConfigDef.Importance.HIGH, SCHEMA_REGISTRY_URL_DOC)
  }

  object Config {

    const val WS_URL_CONFIG = "ws.url"
    const val WS_URL_DEFAULT = "ws://parity:8546"
    const val WS_URL_DOC = "Websocket of the rpc node"

    const val TOPIC_BLOCKS_CONFIG = "topic.blocks"
    const val TOPIC_BLOCKS_DEFAULT = "blocks"
    const val TOPIC_BLOCKS_DOC = "The topic into which blocks are published"

    const val SCHEMA_REGISTRY_URL_CONFIG = "schema.registry.url"
    const val SCHEMA_REGISTRY_URL_DEFAULT = "http://kafka-schema-registry:8081"
    const val SCHEMA_REGISTRY_URL_DOC = "The url of the of the kafka schema registry"

    fun name(props: MutableMap<String, String>) = props["name"]!!

    fun wsUrl(props: MutableMap<String, String>) = props.getOrDefault(WS_URL_CONFIG, WS_URL_DEFAULT)

    fun blocksTopic(props: MutableMap<String, String>) = props.getOrDefault(TOPIC_BLOCKS_CONFIG, TOPIC_BLOCKS_DEFAULT)

    fun schemaRegistryUrl(props: MutableMap<String, String>) =
      props.getOrDefault(SCHEMA_REGISTRY_URL_CONFIG, SCHEMA_REGISTRY_URL_DEFAULT)

  }
}
