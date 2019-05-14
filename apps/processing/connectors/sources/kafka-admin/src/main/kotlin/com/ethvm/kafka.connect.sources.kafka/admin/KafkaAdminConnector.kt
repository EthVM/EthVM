package com.ethvm.kafka.connect.sources.kafka.admin

import com.ethvm.kafka.connect.sources.kafka.admin.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.source.SourceConnector
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.BOOTSTRAP_SERVERS_CONFIG
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.BOOTSTRAP_SERVERS_DEFAULT
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.BOOTSTRAP_SERVERS_DOC
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.CONSUMER_GROUPS_CONFIG
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.CONSUMER_GROUPS_DEFAULT
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.CONSUMER_GROUPS_DOC
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.INTERVAL_CONFIG
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.INTERVAL_DEFAULT
import com.ethvm.kafka.connect.sources.kafka.admin.KafkaAdminConnector.Config.INTERVAL_DOC


class KafkaAdminConnector : SourceConnector() {


  private lateinit var config: MutableMap<String, String>

  override fun version(): String = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {
    config = props
  }

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {
    return mutableListOf(config)
  }


  override fun stop() {
    TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
  }


  override fun taskClass(): Class<out Task> = KafkaAdminSourceTask::class.java


  override fun config(): ConfigDef = ConfigDef().apply {

    define(BOOTSTRAP_SERVERS_CONFIG, ConfigDef.Type.STRING, BOOTSTRAP_SERVERS_DEFAULT, ConfigDef.Importance.HIGH, BOOTSTRAP_SERVERS_DOC)
    define(CONSUMER_GROUPS_CONFIG, ConfigDef.Type.LIST, CONSUMER_GROUPS_DEFAULT, ConfigDef.Importance.HIGH, CONSUMER_GROUPS_DOC)
    define(INTERVAL_CONFIG, ConfigDef.Type.LIST, INTERVAL_DEFAULT, ConfigDef.Importance.LOW, INTERVAL_DOC)
  }

  object Config {

    const val BOOTSTRAP_SERVERS_CONFIG = "bootstrapServers"
    const val BOOTSTRAP_SERVERS_DEFAULT = "localhost:9092"
    const val BOOTSTRAP_SERVERS_DOC = "Kafka broker connection details"

    const val CONSUMER_GROUPS_CONFIG = "consumerGroups"
    const val CONSUMER_GROUPS_DEFAULT = ""
    const val CONSUMER_GROUPS_DOC = "The list of consumer groups to get info for"

    const val INTERVAL_CONFIG = "intervalMs"
    const val INTERVAL_DEFAULT = "10000"
    const val INTERVAL_DOC = "How frequently to poll the broker"

    fun bootstrapServers(props: MutableMap<String, String>) = props.getOrDefault(BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS_DEFAULT)

    fun consumerGroups(props: MutableMap<String, String>) = props.getOrDefault(CONSUMER_GROUPS_CONFIG, CONSUMER_GROUPS_DEFAULT).split(",").filter { it != "" }

    fun interval(props: MutableMap<String, String>) = props.getOrDefault(INTERVAL_CONFIG, INTERVAL_DEFAULT).toLong()

  }
}
