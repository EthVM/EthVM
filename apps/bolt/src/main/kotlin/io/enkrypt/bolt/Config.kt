package io.enkrypt.bolt

data class AppConfig(
  val bootstrapServers: String,
  val startingOffset: String,
  val topicsConfig: TopicsConfig,
  val mongo: MongoCollectionsConfig
)

data class TopicsConfig(
  val blocks: String,
  val processedBlocks: String,
  val canonicalChain: String,
  val pendingTransactions: String,
  val accountState: String,
  val metadata: String
)

data class MongoCollectionsConfig(
  val accountsCollection: String,
  val blocksCollection: String,
  val pendingTransactionsCollection: String,
  val statisticsCollection: String
)
