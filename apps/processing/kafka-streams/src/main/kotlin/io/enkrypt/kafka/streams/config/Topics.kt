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

  const val ContractMetadata = "contract-metadata"
  const val ContractCreations = "contract-creations"
  const val ContractDestructions = "contract-destructions"

  const val AddressTxEvents = "address-tx-events"
  const val AddressTxCounts = "address-tx-counts"

  const val MinerList = "miner-list"
  const val ContractCreatorList = "contract-creator-list"

  const val EthTokensList = "eth-tokens-list"
  const val EthTokensListBySymbol = "eth-tokens-list-by-symbol"

  const val RawExchangeRates = "raw-exchange-rates"
  const val TokenExchangeRates = "token-exchange-rates"
}
