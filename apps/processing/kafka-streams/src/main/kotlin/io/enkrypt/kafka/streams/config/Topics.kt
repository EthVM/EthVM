package io.enkrypt.kafka.streams.config

object Topics {

  const val Blocks = "blocks"
  const val Transactions = "transactions"
  const val Uncles = "uncles"

  const val BlockMetricsByBlock = "block-metrics-by-block"
  const val BlockMetricsByDay = "block-metrics-by-day"
  const val AggregateBlocksMetricsByDay = "aggregate-block-metrics-by-day"

  const val TokenTransfers = "token-transfers"
  const val FungibleTokenMovements = "fungible-token-movements"
  const val Balances = "balances"

  const val ContractCreations = "contract-creations"
  const val ContractDestructions = "contract-destructions"

  const val CoinGeckoExchangeRates = "coingecko-exchange-rates"
  const val ExchangeRates = "exchange-rates"
}
