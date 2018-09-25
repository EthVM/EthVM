package io.enkrypt.bolt

data class AppConfig(
  val bootstrapServers: String,
  val schemaRegistryUrl: String,
  val startingOffset: String,
  val topicsConfig: TopicsConfig
)

data class TopicsConfig(
  val blocks: String,
  val blocksInfo: String,
  val transactions: String,
  val accountState: String
)
