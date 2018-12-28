package io.enkrypt.kafka.connect.utils

import java.util.Properties

object Versions {

  private const val UNKNOWN = "unknown"

  fun of(path: String): String {
    return try {
      val inputStream = Versions::class.java.getResourceAsStream(path) ?: return UNKNOWN
      val props = Properties()
      props.load(inputStream)
      props.getProperty("version", UNKNOWN).trim { it <= ' ' }
    } catch (e: Exception) {
      UNKNOWN
    }
  }
}
