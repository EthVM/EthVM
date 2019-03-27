package io.enkrypt.kafka.streams.config

import io.enkrypt.kafka.streams.Serdes
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

  val CanonicalBlocks = KafkaTopic("canonical-blocks", Serdes.CanonicalKey(), Serdes.BlockHeader())
  val CanonicalTransactions = KafkaTopic("canonical-transactions", Serdes.CanonicalKey(), Serdes.TransactionList())
  val CanonicalReceipts = KafkaTopic("canonical-receipts", Serdes.CanonicalKey(), Serdes.ReceiptList())
  val CanonicalTraces = KafkaTopic("canonical-traces", Serdes.CanonicalKey(), Serdes.TraceList())

  val CanonicalTracesEtherDeltas = KafkaTopic("canonical-traces-ether-deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
  val CanonicalTransactionFeesEtherDeltas = KafkaTopic("canonical-transaction-fees-ether-deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
  val CanonicalMinerFeesEtherDeltas = KafkaTopic("canonical-miner-fees-ether-deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDelta())

  val CanonicalReceiptErc20Deltas = KafkaTopic("canonical-receipt-erc20-deltas", Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())

  val FungibleBalanceDeltas = KafkaTopic("fungible-balance-deltas", Serdes.FungibleBalanceKey(), Serdes.FungibleBalanceDelta())
  val FungibleBalances = KafkaTopic("fungible-balances", Serdes.FungibleBalanceKey(), Serdes.FungibleBalance())

  val BlockMetrics = KafkaTopic("block-metrics", Serdes.CanonicalKey(), Serdes.BlockMetrics())
  val TraceBlockMetrics = KafkaTopic("trace-block-metrics", Serdes.CanonicalKey(), Serdes.BlockMetrics())
  val TransactionBlockMetrics = KafkaTopic("transaction-block-metrics", Serdes.CanonicalKey(), Serdes.BlockMetrics())
  val TransactionFeeBlockMetrics = KafkaTopic("transaction-fee-block-metrics", Serdes.CanonicalKey(), Serdes.BlockMetrics())

  val CanonicalGasPrices = KafkaTopic("canonical-gas-prices", Serdes.CanonicalKey(), Serdes.TransactionGasPriceList())
  val CanonicalGasUsed = KafkaTopic("canonical-gas-used", Serdes.CanonicalKey(), Serdes.TransactionGasUsedList())
  val CanonicalTransactionFees = KafkaTopic("canonical-transaction-fees", Serdes.CanonicalKey(), Serdes.TransactionFeeList())

  val CanonicalBlockAuthors = KafkaTopic("canonical-block-authors", Serdes.CanonicalKey(), Serdes.BlockAuthor())

  val CanonicalContractTraces = KafkaTopic("canonical-contract-traces", Serdes.CanonicalKey(), Serdes.TraceList())
  val CanonicalContractLifecycle = KafkaTopic("canonical-contract-lifecycle", Serdes.CanonicalKey(), Serdes.ContractLifecycleList())
  val ContractLifecycleEvents = KafkaTopic("contract-lifecycle-events", Serdes.ContractKey(), Serdes.ContractLifecycle())
  val Contracts = KafkaTopic("contracts", Serdes.ContractKey(), Serdes.Contract())

  const val BlockMetricsByDay = "block-metrics-by-day"

  const val FungibleTokenMovements = "fungible-token-movements"

  const val ContractMetadata = "contract-metadata"
  const val ContractCreations = "contract-creations"
  const val ContractDestructions = "contract-destructions"

  const val EthTokensList = "eth-tokens-list"
  const val EthTokensListBySymbol = "eth-tokens-list-by-symbol"

  const val RawExchangeRates = "raw-exchange-rates"
  const val TokenExchangeRates = "token-exchange-rates"
}
