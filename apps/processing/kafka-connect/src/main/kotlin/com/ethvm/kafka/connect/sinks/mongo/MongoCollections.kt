package com.ethvm.kafka.connect.sinks.mongo

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
      "blocks" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Blocks,
      "uncles" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Uncles,
      "transactions" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Transactions,
      "contract-creations" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Contracts,
      "contract-destructions" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Contracts,
      "contract-metadata" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Contracts,
      "token-transfers" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.TokenTransfers,
      "balances" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Balances,
      "block-metrics-by-block" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.BlockMetrics,
      "aggregate-block-metrics-by-day" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.AggregateBlockMetrics,
      "pending-transactions" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.PendingTransactions,
      "processing-metadata" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.ProcessingMetadata,
      "miner-list" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.AccountMetadata,
      "address-tx-counts" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.AccountMetadata,
      "contract-creator-list" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.AccountMetadata,
      "token-exchange-rates" to com.ethvm.kafka.connect.sinks.mongo.MongoCollections.TokenExchangeRates
    )

    fun forTopic(topic: String): com.ethvm.kafka.connect.sinks.mongo.MongoCollections? = com.ethvm.kafka.connect.sinks.mongo.MongoCollections.Companion.collectionsByTopic[topic]
  }
}
