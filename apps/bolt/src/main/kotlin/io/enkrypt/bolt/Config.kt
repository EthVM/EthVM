package io.enkrypt.bolt

data class AppConfig(
  val kafka: KafkaConfig,
  val mongo: MongoConfig
)

data class KafkaConfig(
  val bootstrapServers: String,
  val startingOffset: String,
  val transactionalId: String,
  val topicsConfig: KafkaTopicsConfig
)

data class KafkaTopicsConfig(
  val blocks: String,
  val pendingTransactions: String,
  val accountState: String,
  val tokenTransfers: String,
  val metadata: String
)

data class MongoConfig(
  val uri: String,
  val accountsCollection: String,
  val blocksCollection: String,
  val pendingTransactionsCollection: String,
  val statisticsCollection: String,
  val tokenTransfersCollection: String,
  val tokenBalancesCollection: String
)
