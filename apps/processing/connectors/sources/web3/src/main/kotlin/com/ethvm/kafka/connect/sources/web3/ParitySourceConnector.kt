package com.ethvm.kafka.connect.sources.web3

import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.ENTITIES_LIST_CONFIG
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.ENTITIES_LIST_DEFAULT
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.ENTITIES_LIST_DOC
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.SCHEMA_REGISTRY_URL_CONFIG
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.SCHEMA_REGISTRY_URL_DEFAULT
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.SCHEMA_REGISTRY_URL_DOC
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.START_BLOCK_CONFIG
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.START_BLOCK_DEFAULT
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.START_BLOCK_DOC
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.WS_URL_CONFIG
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.WS_URL_DEFAULT
import com.ethvm.kafka.connect.sources.web3.ParitySourceConnector.Config.WS_URL_DOC
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector

class ParitySourceConnector : SourceConnector() {

  private lateinit var config: MutableMap<String, String>

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {
    config = props
  }

  override fun stop() {
  }

  override fun taskClass(): Class<out Task> = ParitySourceTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {

    val entities = Config.entitiesList(config)
    val chunkSize = Math.ceil(entities.size / maxTasks * 1.0).toInt()

    return entities
      .chunked(chunkSize)
      .map { entitiesChunk -> Config.setEntitiesList(HashMap(config), entitiesChunk) }
      .toMutableList()
  }

  override fun config(): ConfigDef = ConfigDef().apply {

    define(WS_URL_CONFIG, ConfigDef.Type.STRING, WS_URL_DEFAULT, ConfigDef.Importance.HIGH, WS_URL_DOC)
    define(SCHEMA_REGISTRY_URL_CONFIG, ConfigDef.Type.STRING, SCHEMA_REGISTRY_URL_DEFAULT, ConfigDef.Importance.HIGH, SCHEMA_REGISTRY_URL_DOC)
    define(START_BLOCK_CONFIG, ConfigDef.Type.INT, START_BLOCK_DEFAULT, ConfigDef.Importance.LOW, START_BLOCK_DOC)
    define(ENTITIES_LIST_CONFIG, ConfigDef.Type.LIST, ENTITIES_LIST_DEFAULT, ConfigDef.Importance.LOW, ENTITIES_LIST_DOC)
  }

  object Config {

    const val WS_URL_CONFIG = "ws.url"
    const val WS_URL_DEFAULT = "ws://parity:8546"
    const val WS_URL_DOC = "Websocket of the rpc node"

    const val SCHEMA_REGISTRY_URL_CONFIG = "schema.registry.url"
    const val SCHEMA_REGISTRY_URL_DEFAULT = "http://kafka-schema-registry:8081"
    const val SCHEMA_REGISTRY_URL_DOC = "The url of the of the kafka schema registry"

    const val START_BLOCK_CONFIG = "sync.startBlock"
    const val START_BLOCK_DEFAULT = 0
    const val START_BLOCK_DOC = "Specifies the starting block number from which to sync"

    const val ENTITIES_LIST_CONFIG = "entities"
    val ENTITIES_LIST_DEFAULT = listOf("full_block").joinToString(",")
    const val ENTITIES_LIST_DOC = "The list of entities to pull"

    fun wsUrl(props: MutableMap<String, String>) = props.getOrDefault(WS_URL_CONFIG, WS_URL_DEFAULT)

    fun startBlockNumber(props: MutableMap<String, String>) = props.getOrDefault(START_BLOCK_CONFIG, START_BLOCK_DEFAULT.toString()).toBigInteger()

    fun entitiesList(props: MutableMap<String, String>) =
      props.getOrDefault(ENTITIES_LIST_CONFIG, ENTITIES_LIST_DEFAULT).split(",")

    fun setEntitiesList(props: MutableMap<String, String>, entities: List<String>): MutableMap<String, String> {
      props[ENTITIES_LIST_CONFIG] = entities.joinToString(",")
      return props
    }
  }
}
