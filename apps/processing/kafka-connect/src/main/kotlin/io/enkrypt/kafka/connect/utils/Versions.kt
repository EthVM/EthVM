package io.enkrypt.kafka.connect.utils

import java.util.Properties

object Versions {

  private const val UNKNOWN = "unknown"

  fun of(file: String): String {
    return try {
      val props = Properties()
      props.load(Versions::class.java.getResourceAsStream(file))
      props.getProperty("version", UNKNOWN).trim { it <= ' ' }
    } catch (e: Exception) {
      UNKNOWN
    }
  }
}