package com.ethvm.kafka.streams.config

import com.ethvm.kafka.streams.Serdes
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.GlobalKTable
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.KTable
import org.apache.kafka.streams.kstream.Produced

data class KafkaTopic<K, V>(
  val name: String,
  val keySerde: Serde<K>,
  val valueSerde: Serde<V>
) {

  val consumer = Consumed.with(keySerde, valueSerde)
  val producer = Produced.with(keySerde, valueSerde)

  fun stream(builder: StreamsBuilder): KStream<K, V> = builder.stream(name, consumer)

  fun sinkFor(vararg streams: KStream<K, V>) = streams.forEach { it.to(name, producer) }

  fun table(builder: StreamsBuilder): KTable<K, V> = builder.table(name, consumer)

  fun globalTable(builder: StreamsBuilder): GlobalKTable<K, V> = builder.globalTable(name, consumer)
}

object Topics {

  val CanonicalBlockHeader = KafkaTopic("canonical_block_header", Serdes.CanonicalKey(), Serdes.BlockHeader())
  val CanonicalTransactions = KafkaTopic("canonical_transactions", Serdes.CanonicalKey(), Serdes.TransactionList())
  val CanonicalReceipts = KafkaTopic("canonical_receipts", Serdes.CanonicalKey(), Serdes.ReceiptList())
  val CanonicalTraces = KafkaTopic("canonical_traces", Serdes.CanonicalKey(), Serdes.TraceList())

  val Transaction = KafkaTopic("transaction", Serdes.TransactionKey(), Serdes.Transaction())
  val TransactionReceipt = KafkaTopic("transaction_receipt", Serdes.TransactionReceiptKey(), Serdes.TransactionReceipt())
  val TransactionTrace = KafkaTopic("transaction_trace", Serdes.TraceKey(), Serdes.Trace())

  val CanonicalTracesEtherDeltas = KafkaTopic("canonical_traces_ether_deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
  val CanonicalTransactionFeesEtherDeltas = KafkaTopic("canonical_transaction_fees_ether_deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
  val CanonicalMinerFeesEtherDeltas = KafkaTopic("canonical_miner_fees_ether_deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDelta())

  val CanonicalReceiptErc20Deltas = KafkaTopic("canonical_receipt_erc20_deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
  val CanonicalReceiptErc721Deltas = KafkaTopic("canonical_receipt_erc721_deltas", Serdes.CanonicalKey(), Serdes.NonFungibleBalanceDeltaList())

  val FungibleBalanceDeltas = KafkaTopic("fungible_balance_deltas", Serdes.FungibleBalanceKey(), Serdes.FungibleBalanceDelta())
  val FungibleBalance = KafkaTopic("fungible_balance", Serdes.FungibleBalanceKey(), Serdes.FungibleBalance())

  val NonFungibleBalanceDeltas = KafkaTopic("non_fungible_balance_deltas", Serdes.NonFungibleBalanceKey(), Serdes.NonFungibleBalanceDelta())
  val NonFungibleBalance = KafkaTopic("non_fungible_balance", Serdes.NonFungibleBalanceKey(), Serdes.NonFungibleBalance())

  val BlockTimestamp = KafkaTopic("block_timestamp", Serdes.CanonicalKey(), Serdes.BlockTimestamp())
  val BlockHeaderMetrics = KafkaTopic("block_header_metrics", Serdes.CanonicalKey(), Serdes.BlockHeaderMetrics())
  val BlockTransactionMetrics = KafkaTopic("block_transaction_metrics", Serdes.CanonicalKey(), Serdes.BlockTransactionMetrics())
  val BlockTransactionTraceMetrics = KafkaTopic("block_transaction_trace_metrics", Serdes.CanonicalKey(), Serdes.BlockTransactionTraceMetrics())
  val BlockTransactionFeeMetrics = KafkaTopic("block_transaction_fee_metrics", Serdes.CanonicalKey(), Serdes.BlockTransactionFeeMetrics())

  val CanonicalGasPrices = KafkaTopic("canonical_gas_prices", Serdes.CanonicalKey(), Serdes.TransactionGasPriceList())
  val CanonicalGasUsed = KafkaTopic("canonical_gas_used", Serdes.CanonicalKey(), Serdes.TransactionGasUsedList())
  val CanonicalTransactionFees = KafkaTopic("canonical_transaction_fees", Serdes.CanonicalKey(), Serdes.TransactionFeeList())

  val CanonicalBlockAuthor = KafkaTopic("canonical_block_author", Serdes.CanonicalKey(), Serdes.BlockAuthor())

  val CanonicalContractLifecycle = KafkaTopic("canonical_contract_lifecycle", Serdes.CanonicalKey(), Serdes.ContractLifecycleList())
  val ContractLifecycleEvents = KafkaTopic("contract_lifecycle_events", Serdes.ContractKey(), Serdes.ContractLifecycle())
  val Contract = KafkaTopic("contract", Serdes.ContractKey(), Serdes.Contract())

  const val ContractMetadata = "contract_metadata"

  const val EthTokensList = "eth_tokens_list"
  const val EthTokensListBySymbol = "eth_tokens_list_by_symbol"

  const val RawExchangeRates = "raw_exchange_rates"
  const val TokenExchangeRates = "token_exchange_rates"
}
