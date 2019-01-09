package io.enkrypt.kafka.streams.config

data class KafkaConfig(
  val bootstrapServers: String,
  val startingOffset: String,
  val transactionalId: String,
  val schemaRegistryUrl: String
)
