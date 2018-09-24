package io.enkrypt.bolt

data class AppConfig(
  val bootstrapServers: String,
  val schemaRegistryUrl: String,
  val startingOffset: String,
  val topicsConfig: TopicsConfig
)

data class TopicsConfig(
  val rawBlocks: String,
  val rawPendingTxs: String,
  val processedBlocks: String
)
