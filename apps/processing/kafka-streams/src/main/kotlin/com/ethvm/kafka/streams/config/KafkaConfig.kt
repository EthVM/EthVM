package com.ethvm.kafka.streams.config

data class KafkaConfig(
  val bootstrapServers: String,
  val startingOffset: String,
  val schemaRegistryUrl: String,
  val streamsStateDir: String
)
