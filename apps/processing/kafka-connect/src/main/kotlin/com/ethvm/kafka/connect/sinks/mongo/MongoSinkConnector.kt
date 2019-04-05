package com.ethvm.kafka.connect.sinks.mongo

import com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_DEFAULT_URI_VALUE
import com.ethvm.kafka.connect.utils.Versions
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance.HIGH
import org.apache.kafka.common.config.ConfigDef.Type.STRING
import org.apache.kafka.connect.connector.Task
import org.apache.kafka.connect.sink.SinkConnector

class MongoSinkConnector : SinkConnector() {

  private var config: MutableMap<String, String> = HashMap()

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {
    config = props
  }

  override fun stop() {
  }

  override fun taskClass(): Class<out Task> = com.ethvm.kafka.connect.sinks.mongo.MongoSinkTask::class.java

  override fun taskConfigs(maxTasks: Int): MutableList<MutableMap<String, String>> =
    (1..maxTasks).map { config }.toMutableList()

  override fun config(): ConfigDef = ConfigDef().apply {

    define(
      com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_URI_CONFIG, STRING, MONGO_DEFAULT_URI_VALUE, HIGH,
      com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_URI_DOC
    )
  }

  object Config {

    const val MONGO_URI_CONFIG = "mongo.uri"
    const val MONGO_URI_DOC = "Mongo uri for connecting to the mongo instance"
    const val MONGO_DEFAULT_URI_VALUE = "mongodb://localhost:27017/kafka"

    fun mongoUri(props: MutableMap<String, String>): String {
      return props[com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.MONGO_URI_CONFIG] ?: MONGO_DEFAULT_URI_VALUE
    }
  }
}
