package com.ethvm.kafka.streams.config

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.ContractKeyRecord
import com.ethvm.avro.capture.ContractLifecycleListRecord
import com.ethvm.avro.capture.ContractLifecycleRecord
import com.ethvm.avro.capture.ContractRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleListRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.avro.processing.BlockAuthorRecord
import com.ethvm.avro.processing.BlockMetricKeyRecord
import com.ethvm.avro.processing.BlockMetricsHeaderRecord
import com.ethvm.avro.processing.BlockMetricsTransactionFeeRecord
import com.ethvm.avro.processing.BlockMetricsTransactionRecord
import com.ethvm.avro.processing.BlockMetricsTransactionTraceRecord
import com.ethvm.avro.processing.Erc20MetadataRecord
import com.ethvm.avro.processing.Erc721MetadataRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.FungibleBalanceRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.NonFungibleBalanceKeyRecord
import com.ethvm.avro.processing.NonFungibleBalanceRecord
import com.ethvm.avro.processing.TraceKeyRecord
import com.ethvm.avro.processing.TransactionFeeListRecord
import com.ethvm.avro.processing.TransactionGasPriceListRecord
import com.ethvm.avro.processing.TransactionGasUsedListRecord
import com.ethvm.avro.processing.TransactionKeyRecord
import com.ethvm.avro.processing.TransactionReceiptKeyRecord
import com.ethvm.avro.processing.UncleKeyRecord
import com.ethvm.kafka.streams.Serdes.BlockAuthor
import com.ethvm.kafka.streams.Serdes.BlockHeader
import com.ethvm.kafka.streams.Serdes.BlockMetricKey
import com.ethvm.kafka.streams.Serdes.BlockMetricsHeader
import com.ethvm.kafka.streams.Serdes.BlockMetricsTransaction
import com.ethvm.kafka.streams.Serdes.BlockMetricsTransactionFee
import com.ethvm.kafka.streams.Serdes.BlockMetricsTransactionTrace
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
import org.apache.avro.Schema
import org.apache.avro.specific.SpecificRecord
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.GlobalKTable
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.KTable
import org.apache.kafka.streams.kstream.Produced
import kotlin.reflect.full.declaredMembers

data class KafkaTopic<K, V>(
  val name: String,
  val keySchema: Schema,  // TODO replace with reflection
  val keySerde: Serde<K>,
  val valueSchema: Schema,
  val valueSerde: Serde<V>
) {

  val consumer = Consumed.with(keySerde, valueSerde)
  val producer = Produced.with(keySerde, valueSerde)

  val keySubject = "$name-key"
  val valueSubject = "$name-value"

  fun stream(builder: StreamsBuilder): KStream<K, V> = builder.stream(name, consumer)

  fun sinkFor(vararg streams: KStream<K, V>) = streams.forEach { it.to(name, producer) }

  fun table(builder: StreamsBuilder): KTable<K, V> = builder.table(name, consumer)

  fun globalTable(builder: StreamsBuilder): GlobalKTable<K, V> = builder.globalTable(name, consumer)

}

object Topics {

  val CanonicalBlockHeader = KafkaTopic("canonical_block_header", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), BlockHeaderRecord.`SCHEMA$`, BlockHeader())
  val CanonicalTransactions = KafkaTopic("canonical_transactions", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), TransactionListRecord.`SCHEMA$`, TransactionList())
  val CanonicalReceipts = KafkaTopic("canonical_receipts", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), TransactionReceiptListRecord.`SCHEMA$`, ReceiptList())
  val CanonicalTraces = KafkaTopic("canonical_traces", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), TraceListRecord.`SCHEMA$`, TraceList())
  val CanonicalUncles = KafkaTopic("canonical_uncles", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), UncleListRecord.`SCHEMA$`, UncleList())

  val Transaction = KafkaTopic("transaction", TransactionKeyRecord.`SCHEMA$`, TransactionKey(), TransactionRecord.`SCHEMA$`, Transaction())
  val TransactionReceipt = KafkaTopic("transaction_receipt", TransactionReceiptKeyRecord.`SCHEMA$`, TransactionReceiptKey(), TransactionReceiptRecord.`SCHEMA$`, TransactionReceipt())
  val TransactionTrace = KafkaTopic("transaction_trace", TraceKeyRecord.`SCHEMA$`, TraceKey(), TraceListRecord.`SCHEMA$`, TraceList())
  val Uncle = KafkaTopic("uncle", UncleKeyRecord.`SCHEMA$`, UncleKey(), UncleRecord.`SCHEMA$`, Uncle())

  val CanonicalTracesEtherDeltas = KafkaTopic("canonical_traces_ether_deltas", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), FungibleBalanceDeltaRecord.`SCHEMA$`, FungibleBalanceDeltaList())
  val CanonicalTransactionFeesEtherDeltas = KafkaTopic("canonical_transaction_fees_ether_deltas", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), FungibleBalanceDeltaListRecord.`SCHEMA$`, FungibleBalanceDeltaList())
  val CanonicalMinerFeesEtherDeltas = KafkaTopic("canonical_miner_fees_ether_deltas", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), FungibleBalanceDeltaRecord.`SCHEMA$`, FungibleBalanceDelta())

  val CanonicalReceiptErc20Deltas = KafkaTopic("canonical_receipt_erc20_deltas", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), FungibleBalanceDeltaListRecord.`SCHEMA$`, FungibleBalanceDeltaList())
  val CanonicalReceiptErc721Deltas = KafkaTopic("canonical_receipt_erc721_deltas", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), NonFungibleBalanceDeltaListRecord.`SCHEMA$`, NonFungibleBalanceDeltaList())

  val FungibleBalanceDelta = KafkaTopic("fungible_balance_delta", FungibleBalanceKeyRecord.`SCHEMA$`, FungibleBalanceKey(), FungibleBalanceDeltaRecord.`SCHEMA$`, FungibleBalanceDelta())
  val FungibleBalance = KafkaTopic("fungible_balance", FungibleBalanceKeyRecord.`SCHEMA$`, FungibleBalanceKey(), FungibleBalanceRecord.`SCHEMA$`, FungibleBalance())

  val NonFungibleBalanceDelta = KafkaTopic("non_fungible_balance_delta", NonFungibleBalanceKeyRecord.`SCHEMA$`, NonFungibleBalanceKey(), NonFungibleBalanceDeltaRecord.`SCHEMA$`, NonFungibleBalanceDelta())
  val NonFungibleBalance = KafkaTopic("non_fungible_balance", NonFungibleBalanceKeyRecord.`SCHEMA$`, NonFungibleBalanceKey(), NonFungibleBalanceRecord.`SCHEMA$`, NonFungibleBalance())

  val BlockMetricsHeader = KafkaTopic("block_metrics_header", BlockMetricKeyRecord.`SCHEMA$`, BlockMetricKey(), BlockMetricsHeaderRecord.`SCHEMA$`, BlockMetricsHeader())
  val BlockMetricsTransaction = KafkaTopic("block_metrics_transaction", BlockMetricKeyRecord.`SCHEMA$`, BlockMetricKey(), BlockMetricsTransactionRecord.`SCHEMA$`, BlockMetricsTransaction())
  val BlockMetricsTransactionTrace = KafkaTopic("block_metrics_transaction_trace", BlockMetricKeyRecord.`SCHEMA$`, BlockMetricKey(), BlockMetricsTransactionTraceRecord.`SCHEMA$`, BlockMetricsTransactionTrace())
  val BlockMetricsTransactionFee = KafkaTopic("block_metrics_transaction_fee", BlockMetricKeyRecord.`SCHEMA$`, BlockMetricKey(), BlockMetricsTransactionFeeRecord.`SCHEMA$`, BlockMetricsTransactionFee())

  val CanonicalGasPrices = KafkaTopic("canonical_gas_prices", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), TransactionGasPriceListRecord.`SCHEMA$`, TransactionGasPriceList())
  val CanonicalGasUsed = KafkaTopic("canonical_gas_used", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), TransactionGasUsedListRecord.`SCHEMA$`, TransactionGasUsedList())
  val CanonicalTransactionFees = KafkaTopic("canonical_transaction_fees", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), TransactionFeeListRecord.`SCHEMA$`, TransactionFeeList())

  val CanonicalBlockAuthor = KafkaTopic("canonical_block_author", CanonicalKeyRecord.`SCHEMA$`,  CanonicalKey(), BlockAuthorRecord.`SCHEMA$`, BlockAuthor())

  val CanonicalContractLifecycle = KafkaTopic("canonical_contract_lifecycle", CanonicalKeyRecord.`SCHEMA$`, CanonicalKey(), ContractLifecycleListRecord.`SCHEMA$`, ContractLifecycleList())
  val ContractLifecycleEvents = KafkaTopic("contract_lifecycle_events", ContractKeyRecord.`SCHEMA$`, ContractKey(), ContractLifecycleRecord.`SCHEMA$`, ContractLifecycle())
  val Contract = KafkaTopic("contract", ContractKeyRecord.`SCHEMA$`, ContractKey(), ContractRecord.`SCHEMA$`, Contract())

  val Erc20Metadata = KafkaTopic("erc20_metadata", ContractKeyRecord.`SCHEMA$`, ContractKey(), Erc20MetadataRecord.`SCHEMA$`, Erc20Metadata())
  val Erc721Metadata = KafkaTopic("erc721_metadata", ContractKeyRecord.`SCHEMA$`, ContractKey(), Erc721MetadataRecord.`SCHEMA$`, Erc721Metadata())

  val all =
    listOf(
      CanonicalBlockHeader,
      CanonicalTransactions,
      CanonicalReceipts,
      CanonicalTraces,
      CanonicalUncles,
      Transaction,
      TransactionReceipt,
      TransactionTrace,
      Uncle,
      CanonicalTracesEtherDeltas,
      CanonicalTransactionFeesEtherDeltas,
      CanonicalMinerFeesEtherDeltas,
      CanonicalReceiptErc20Deltas,
      CanonicalReceiptErc721Deltas,
      FungibleBalanceDelta,
      FungibleBalance,
      NonFungibleBalanceDelta,
      NonFungibleBalance,
      BlockMetricsHeader,
      BlockMetricsTransaction,
      BlockMetricsTransactionTrace,
      BlockMetricsTransactionFee,
      CanonicalGasPrices,
      CanonicalGasUsed,
      CanonicalTransactionFees,
      CanonicalBlockAuthor,
      CanonicalContractLifecycle,
      ContractLifecycleEvents,
      Contract,
      Erc20Metadata,
      Erc721Metadata
    )

}
