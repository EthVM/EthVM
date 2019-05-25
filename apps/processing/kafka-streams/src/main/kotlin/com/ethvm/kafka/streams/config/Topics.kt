package com.ethvm.kafka.streams.config

import com.ethvm.kafka.streams.Serdes.BlockAuthor
import com.ethvm.kafka.streams.Serdes.BlockHeader
import com.ethvm.kafka.streams.Serdes.BlockKey
import com.ethvm.kafka.streams.Serdes.BlockMetricKey
import com.ethvm.kafka.streams.Serdes.BlockMetricsHeader
import com.ethvm.kafka.streams.Serdes.BlockMetricsTransaction
import com.ethvm.kafka.streams.Serdes.BlockMetricsTransactionFee
import com.ethvm.kafka.streams.Serdes.BlockMetricsTransactionTrace
import com.ethvm.kafka.streams.Serdes.BlockTimestamp
import com.ethvm.kafka.streams.Serdes.CanonicalKey
import com.ethvm.kafka.streams.Serdes.Contract
import com.ethvm.kafka.streams.Serdes.ContractKey
import com.ethvm.kafka.streams.Serdes.ContractLifecycle
import com.ethvm.kafka.streams.Serdes.ContractLifecycleList
import com.ethvm.kafka.streams.Serdes.Erc20Metadata
import com.ethvm.kafka.streams.Serdes.Erc721Metadata
import com.ethvm.kafka.streams.Serdes.FungibleBalance
import com.ethvm.kafka.streams.Serdes.FungibleBalanceDelta
import com.ethvm.kafka.streams.Serdes.FungibleBalanceDeltaList
import com.ethvm.kafka.streams.Serdes.FungibleBalanceKey
import com.ethvm.kafka.streams.Serdes.NonFungibleBalance
import com.ethvm.kafka.streams.Serdes.NonFungibleBalanceDelta
import com.ethvm.kafka.streams.Serdes.NonFungibleBalanceDeltaList
import com.ethvm.kafka.streams.Serdes.NonFungibleBalanceKey
import com.ethvm.kafka.streams.Serdes.ReceiptList
import com.ethvm.kafka.streams.Serdes.TraceKey
import com.ethvm.kafka.streams.Serdes.TraceList
import com.ethvm.kafka.streams.Serdes.Transaction
import com.ethvm.kafka.streams.Serdes.TransactionFeeList
import com.ethvm.kafka.streams.Serdes.TransactionGasPriceList
import com.ethvm.kafka.streams.Serdes.TransactionGasUsedList
import com.ethvm.kafka.streams.Serdes.TransactionKey
import com.ethvm.kafka.streams.Serdes.TransactionList
import com.ethvm.kafka.streams.Serdes.TransactionReceipt
import com.ethvm.kafka.streams.Serdes.TransactionReceiptKey
import com.ethvm.kafka.streams.Serdes.Uncle
import com.ethvm.kafka.streams.Serdes.UncleKey
import com.ethvm.kafka.streams.Serdes.UncleList
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

  val CanonicalBlockHeader = KafkaTopic("canonical_block_header", CanonicalKey(), BlockHeader())
  val CanonicalTransactions = KafkaTopic("canonical_transactions", CanonicalKey(), TransactionList())
  val CanonicalReceipts = KafkaTopic("canonical_receipts", CanonicalKey(), ReceiptList())
  val CanonicalTraces = KafkaTopic("canonical_traces", CanonicalKey(), TraceList())
  val CanonicalUncles = KafkaTopic("canonical_uncles", CanonicalKey(), UncleList())

  val Transaction = KafkaTopic("transaction", TransactionKey(), Transaction())
  val TransactionReceipt = KafkaTopic("transaction_receipt", TransactionReceiptKey(), TransactionReceipt())
  val TransactionTrace = KafkaTopic("transaction_trace", TraceKey(), TraceList())
  val Uncle = KafkaTopic("uncle", UncleKey(), Uncle())

  val CanonicalTracesEtherDeltas = KafkaTopic("canonical_traces_ether_deltas", CanonicalKey(), FungibleBalanceDeltaList())
  val CanonicalTransactionFeesEtherDeltas = KafkaTopic("canonical_transaction_fees_ether_deltas", CanonicalKey(), FungibleBalanceDeltaList())
  val CanonicalMinerFeesEtherDeltas = KafkaTopic("canonical_miner_fees_ether_deltas", CanonicalKey(), FungibleBalanceDelta())

  val CanonicalReceiptErc20Deltas = KafkaTopic("canonical_receipt_erc20_deltas", CanonicalKey(), FungibleBalanceDeltaList())
  val CanonicalReceiptErc721Deltas = KafkaTopic("canonical_receipt_erc721_deltas", CanonicalKey(), NonFungibleBalanceDeltaList())

  val FungibleBalanceDelta = KafkaTopic("fungible_balance_delta", FungibleBalanceKey(), FungibleBalanceDelta())
  val FungibleBalance = KafkaTopic("fungible_balance", FungibleBalanceKey(), FungibleBalance())

  val NonFungibleBalanceDelta = KafkaTopic("non_fungible_balance_delta", NonFungibleBalanceKey(), NonFungibleBalanceDelta())
  val NonFungibleBalance = KafkaTopic("non_fungible_balance", NonFungibleBalanceKey(), NonFungibleBalance())

  val BlockMetricsHeader = KafkaTopic("block_metrics_header", BlockMetricKey(), BlockMetricsHeader())
  val BlockMetricsTransaction = KafkaTopic("block_metrics_transaction", BlockMetricKey(), BlockMetricsTransaction())
  val BlockMetricsTransactionTrace = KafkaTopic("block_metrics_transaction_trace", BlockMetricKey(), BlockMetricsTransactionTrace())
  val BlockMetricsTransactionFee = KafkaTopic("block_metrics_transaction_fee", BlockMetricKey(), BlockMetricsTransactionFee())

  val CanonicalGasPrices = KafkaTopic("canonical_gas_prices", CanonicalKey(), TransactionGasPriceList())
  val CanonicalGasUsed = KafkaTopic("canonical_gas_used", CanonicalKey(), TransactionGasUsedList())
  val CanonicalTransactionFees = KafkaTopic("canonical_transaction_fees", CanonicalKey(), TransactionFeeList())

  val CanonicalBlockAuthor = KafkaTopic("canonical_block_author", CanonicalKey(), BlockAuthor())

  val CanonicalContractLifecycle = KafkaTopic("canonical_contract_lifecycle", CanonicalKey(), ContractLifecycleList())
  val ContractLifecycleEvents = KafkaTopic("contract_lifecycle_events", ContractKey(), ContractLifecycle())
  val Contract = KafkaTopic("contract", ContractKey(), Contract())

  val Erc20Metadata = KafkaTopic("erc20_metadata", ContractKey(), Erc20Metadata())
  val Erc721Metadata = KafkaTopic("erc721_metadata", ContractKey(), Erc721Metadata())

  const val ContractMetadata = "contract_metadata"

  const val EthTokensList = "eth_tokens_list"
  const val EthTokensListBySymbol = "eth_tokens_list_by_symbol"

  const val RawExchangeRates = "raw_exchange_rates"
  const val TokenExchangeRates = "token_exchange_rates"
}
