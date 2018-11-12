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

object OutputTopics {

  const val FungibleTokenMovements = "fungible-token-movements"
  const val FungibleTokenBalances = "fungible-token-balances"
  const val NonFungibleTokenBalances = "non-fungible-token-balances"
  const val ContractCreations = "contract-creations"
  const val ContractSuicides = "contract-suicides"
  const val ContractClassifications = "contract-classifications"
  const val BlockMetrics = "block-metrics"
  const val BlockStatistics = "block-statistics"

}
