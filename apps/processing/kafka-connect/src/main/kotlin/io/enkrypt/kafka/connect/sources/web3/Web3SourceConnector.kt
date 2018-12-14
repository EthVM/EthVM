package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector

// @Alpha - Not ready for prime time
class Web3SourceConnector : SourceConnector() {

  private lateinit var config: MutableMap<String, String>

  override fun version() = Versions.of("web3-source-version.properties")

  override fun start(props: MutableMap<String, String>?) {
    config = props!!
  }

  override fun stop() {
  }

  override fun taskClass(): Class<out Task> = Web3SourceTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {
    if (maxTasks != 1) throw IllegalStateException("Exactly 1 task must be configured")
    return listOf(config).toMutableList()
  }

  override fun config(): ConfigDef = ConfigDef().apply {

    define(
      Config.WS_URL_CONFIG,
      ConfigDef.Type.STRING,
      Config.WS_URL_DEFAULT,
      ConfigDef.Importance.HIGH,
      Config.WS_URL_DOC
    )
    define(
      Config.TOPIC_BLOCKS_CONFIG,
      ConfigDef.Type.STRING,
      Config.TOPIC_BLOCKS_DEFAULT,
      ConfigDef.Importance.HIGH,
      Config.TOPIC_BLOCKS_DOC
    )
    define(
      Config.REPLAY_BUFFER_CONFIG,
      ConfigDef.Type.INT,
      Config.REPLAY_BUFFER_DEFAULT,
      ConfigDef.Importance.HIGH,
      Config.REPLAY_BUFFER_DOC
    )

    define(
      Config.SCHEMA_REGISTRY_URL_CONFIG,
      ConfigDef.Type.STRING,
      Config.SCHEMA_REGISTRY_URL_DEFAULT,
      ConfigDef.Importance.HIGH,
      Config.SCHEMA_REGISTRY_URL_DOC
    )
    define(
      Config.SCHEMA_BLOCK_KEY_ID_CONFIG,
      ConfigDef.Type.INT,
      null,
      ConfigDef.Importance.HIGH,
      Config.SCHEMA_BLOCK_KEY_ID_DOC
    )
    define(
      Config.SCHEMA_BLOCK_VALUE_ID_CONFIG,
      ConfigDef.Type.INT,
      null,
      ConfigDef.Importance.HIGH,
      Config.SCHEMA_BLOCK_VALUE_ID_DOC
    )
  }

  object Config {

    const val WS_URL_CONFIG = "ws.url"
    const val WS_URL_DEFAULT = "ws://pantheon:8546"
    const val WS_URL_DOC = "Websocket of the rpc node"

    const val TOPIC_BLOCKS_CONFIG = "topic.blocks"
    const val TOPIC_BLOCKS_DEFAULT = "blocks"
    const val TOPIC_BLOCKS_DOC = "The topic into which blocks are published"

    const val REPLAY_BUFFER_CONFIG = "replay.buffer"
    const val REPLAY_BUFFER_DEFAULT = "192"
    const val REPLAY_BUFFER_DOC =
      "A number which is subtracted from the last processed block number on startup before replay is initiated. Intended to ensure we don't miss any forks"

    const val SCHEMA_REGISTRY_URL_CONFIG = "schema.registry.url"
    const val SCHEMA_REGISTRY_URL_DEFAULT = "http://kafka-schema-registry:8081"
    const val SCHEMA_REGISTRY_URL_DOC = "The url of the of the kafka schema registry"

    const val SCHEMA_BLOCK_KEY_ID_CONFIG = "schema.block.key.id"
    const val SCHEMA_BLOCK_KEY_ID_DOC = "The avro schema id for the key object"

    const val SCHEMA_BLOCK_VALUE_ID_CONFIG = "schema.block.value.id"
    const val SCHEMA_BLOCK_VALUE_ID_DOC = "The avro schema id for the value object"

    fun wsUrl(props: MutableMap<String, String>) = props.getOrDefault(WS_URL_CONFIG, WS_URL_DEFAULT)

    fun blocksTopic(props: MutableMap<String, String>) = props.getOrDefault(TOPIC_BLOCKS_CONFIG, TOPIC_BLOCKS_DEFAULT)

    fun replayBuffer(props: MutableMap<String, String>) =
      props.getOrDefault(REPLAY_BUFFER_CONFIG, REPLAY_BUFFER_DEFAULT).toInt()

    fun schemaRegistryUrl(props: MutableMap<String, String>) =
      props.getOrDefault(SCHEMA_REGISTRY_URL_CONFIG, SCHEMA_REGISTRY_URL_DEFAULT)

    fun blockKeySchemaId(props: MutableMap<String, String>) = props[SCHEMA_BLOCK_KEY_ID_CONFIG]!!.toInt()

    fun blockValueSchemaId(props: MutableMap<String, String>) = props[SCHEMA_BLOCK_VALUE_ID_CONFIG]!!.toInt()
  }
}
