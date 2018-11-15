package io.enkrypt.kafka.connect

import io.enkrypt.kafka.connect.MongoSinkConfig.MONGO_URI
import io.enkrypt.kafka.connect.MongoSinkConfig.MONGO_URI_DOC
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance.HIGH
import org.apache.kafka.common.config.ConfigDef.Type.STRING
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.sink.SinkConnector

class MongoSinkConnector : SinkConnector() {

  private lateinit var config: MutableMap<String, String>

  override fun version() = "0.0.1"    // TODO load from resources

  override fun start(props: MutableMap<String, String>?) {
    config = props!!
  }

  override fun stop() {
    // TODO determine if we need to do anything here
  }

  override fun taskClass(): Class<out Task> = MongoSinkTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> =
    (1..maxTasks).map { config }.toMutableList()

  override fun config(): ConfigDef = ConfigDef().apply {

    define(MONGO_URI, STRING, "mongo://localhost:27017/kafka", HIGH, MONGO_URI_DOC)

  }


}
