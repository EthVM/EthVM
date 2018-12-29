package io.enkrypt.kafka.streams.config

data class AppConfig(
  val unitTesting: Boolean,
  val kafka: KafkaConfig
)
