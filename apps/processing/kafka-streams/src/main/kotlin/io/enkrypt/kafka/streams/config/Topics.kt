package io.enkrypt.kafka.streams.config

object Topics {

  const val Blocks = "blocks"
  const val Transactions = "transactions"
  const val Uncles = "uncles"
  const val BlockMetrics = "block-metrics"
  const val BlockStatistics = "block-statistics"

  const val TokenTransfers = "token-transfers"
  const val FungibleTokenMovements = "fungible-token-movements"
  const val Balances = "balances"

  const val ContractCreations = "contract-creations"
  const val ContractDestructions = "contract-destructions"
}
