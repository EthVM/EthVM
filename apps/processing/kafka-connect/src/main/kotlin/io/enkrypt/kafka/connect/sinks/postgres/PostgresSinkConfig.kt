package io.enkrypt.kafka.connect.sinks.postgres

import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.common.config.ConfigDef.Importance.HIGH
import org.apache.kafka.common.config.ConfigDef.Importance.MEDIUM
import org.apache.kafka.common.config.ConfigDef.Type.INT
import org.apache.kafka.common.config.ConfigDef.Type.STRING

enum class PostgresSinkConfig(
  val key: String,
  val type: ConfigDef.Type,
  val importance: ConfigDef.Importance,
  val doc: String,
  val default: String? = null
) {

  Url("postgres.url", STRING, HIGH, "Postgres JDBC style url"),

  PoolSize("postgres.poolSize", INT, MEDIUM, "Max number of connections to use in the connection pool", "20");

  fun define(configDef: ConfigDef) = configDef.apply {
    define(key, type, default, importance, doc)
  }

  fun getString(props: MutableMap<String, String>): String =
    when (default) {
      null -> props[key]!!
      else -> props.getOrDefault(key, default)
    }

  fun getInt(props: MutableMap<String, String>) = getString(props).toInt()

  fun getBoolean(props: MutableMap<String, String>) = getString(props).toBoolean()

  companion object {

    val configDef = ConfigDef().apply {
      PostgresSinkConfig.values().forEach { it.define(this) }
    }
  }
}
