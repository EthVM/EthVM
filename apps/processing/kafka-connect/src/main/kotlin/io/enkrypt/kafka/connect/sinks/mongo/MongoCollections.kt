package io.enkrypt.kafka.connect.sinks.mongo

enum class MongoCollections(val id: String) {

  Blocks("blocks"),
  Uncles("uncles"),
  Transactions("transactions"),
  Contracts("contracts"),
  TokenTransfers("token_transfers"),
  Balances("balances"),
  BlockMetrics("block_metrics"),
  AggregateBlockMetrics("aggregate_block_metrics"),
  PendingTransactions("pending_transactions"),
  ProcessingMetadata("processing_metadata"),
  AccountMetadata("account_metadata"),
  TokenExchangeRates("token_exchange_rates");

  companion object {

    private val collectionsByTopic = mapOf(
      "blocks" to Blocks,
      "uncles" to Uncles,
      "transactions" to Transactions,
      "contract-creations" to Contracts,
      "contract-destructions" to Contracts,
      "contract-metadata" to Contracts,
      "token-transfers" to TokenTransfers,
      "balances" to Balances,
      "block-metrics-by-block" to BlockMetrics,
      "aggregate-block-metrics-by-day" to AggregateBlockMetrics,
      "pending-transactions" to PendingTransactions,
      "processing-metadata" to ProcessingMetadata,
      "miner-list" to AccountMetadata,
      "address-tx-counts" to AccountMetadata,
      "contract-creator-list" to AccountMetadata,
      "token-exchange-rates" to TokenExchangeRates
    )

    fun forTopic(topic: String): MongoCollections? = collectionsByTopic[topic]
  }
}
