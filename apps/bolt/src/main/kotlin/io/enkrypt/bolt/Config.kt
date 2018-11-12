package io.enkrypt.bolt

data class AppConfig(
  val kafka: KafkaConfig
)

data class KafkaConfig(
  val bootstrapServers: String,
  val startingOffset: String,
  val transactionalId: String,
  val schemaRegistryUrl: String,
  val inputTopicsConfig: KafkaInputTopicsConfig
)

data class KafkaInputTopicsConfig(
  val blockSummaries: String,
  val pendingTransactions: String,
  val metadata: String
)

enum class OutputTopics(private val topic: String) {

  FungibleTokenMovements("fungible-token-movements"),
  FungibleTokenBalances("fungible-token-balances"),
  NonFungibleTokenBalances("non-fungible-token-balances"),
  ContractCreations("contract-creations"),
  ContractSuicides("contract-suicides"),
  BlockMetrics("block-metrics"),
  BlockStatistics("block-statistics");

  override fun toString(): String{
    return this.topic
  }


}
