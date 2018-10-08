package io.enkrypt.bolt

data class AppConfig(
  val bootstrapServers: String,
  val startingOffset: String,
  val topicsConfig: TopicsConfig
)

data class TopicsConfig(
  val blocks: String,
  val pendingTransactions: String,
  val accountState: String,
  val metadata: String
)
