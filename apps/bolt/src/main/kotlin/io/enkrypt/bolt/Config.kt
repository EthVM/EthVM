package io.enkrypt.bolt

data class AppConfig(
  val kafka: KafkaConfig
)

data class KafkaConfig(
  val bootstrapServers: String,
  val startingOffset: String,
  val transactionalId: String,
  val schemaRegistryUrl: String,
  val topicsConfig: KafkaTopicsConfig
)

data class KafkaTopicsConfig(
  val blockSummaries: String,
  val pendingTransactions: String,
  val metadata: String
)
