package io.enkrypt.kafka.connect.sinks.postgres

import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance.HIGH
import org.apache.kafka.common.config.ConfigDef.Type.STRING
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.sink.SinkConnector

class PostgresSinkConnector : SinkConnector() {

  private lateinit var config: MutableMap<String, String>

  override fun version() = Versions.CURRENT

  override fun config(): ConfigDef = PostgresSinkConfig.configDef

  override fun start(props: MutableMap<String, String>) {
    config = props
  }

  override fun stop() {

  }

  override fun taskClass() = PostgresSinkTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> {

  }






}
