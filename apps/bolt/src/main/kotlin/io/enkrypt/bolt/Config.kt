package io.enkrypt.bolt

data class AppConfig(
  val applicationId: String,
  val bootstrapServers: String,
  val startingOffset: String,
  val schemaRegistryUrl: String,
  val topicsConfig: TopicsConfig
)

data class TopicsConfig(
  val rawBlocks: String,
  val rawPendingTxs: String
)
