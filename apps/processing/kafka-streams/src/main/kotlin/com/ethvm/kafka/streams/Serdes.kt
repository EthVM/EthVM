package com.ethvm.kafka.streams

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
import com.ethvm.avro.processing.AccountKeyRecord
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
import com.ethvm.avro.processing.TransactionCountDeltaListRecord
import com.ethvm.avro.processing.TransactionCountDeltaRecord
import com.ethvm.avro.processing.TransactionCountRecord
import com.ethvm.avro.processing.TransactionFeeListRecord
import com.ethvm.avro.processing.TransactionGasPriceListRecord
import com.ethvm.avro.processing.TransactionGasUsedListRecord
import com.ethvm.avro.processing.TransactionKeyRecord
import com.ethvm.avro.processing.TransactionReceiptKeyRecord
import com.ethvm.avro.processing.UncleKeyRecord
import com.ethvm.kafka.streams.config.KafkaConfig
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import org.koin.core.KoinComponent
import org.koin.core.inject

@Suppress("FunctionName")
object Serdes : KoinComponent {

  private val kafkaConfig: KafkaConfig by inject()
  private val registryClient: SchemaRegistryClient by inject()

  private val config = mutableMapOf(
    "schema.registry.url" to kafkaConfig.schemaRegistryUrl
  )

  fun FungibleBalanceKey() = SpecificAvroSerde<FungibleBalanceKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun FungibleBalanceDelta() = SpecificAvroSerde<FungibleBalanceDeltaRecord>(registryClient).apply {
    configure(config, false)
  }

  fun FungibleBalance() = SpecificAvroSerde<FungibleBalanceRecord>(registryClient).apply {
    configure(config, false)
  }

  fun FungibleBalanceDeltaList() = SpecificAvroSerde<FungibleBalanceDeltaListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionCountDeltaList() = SpecificAvroSerde<TransactionCountDeltaListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionCountDelta() = SpecificAvroSerde<TransactionCountDeltaRecord>(registryClient).apply {
    configure(config, false)
  }

  fun AccountKey() = SpecificAvroSerde<AccountKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun TransactionCount() = SpecificAvroSerde<TransactionCountRecord>(registryClient).apply {
    configure(config, false)
  }

  fun NonFungibleBalanceKey() = SpecificAvroSerde<NonFungibleBalanceKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun NonFungibleBalanceDelta() = SpecificAvroSerde<NonFungibleBalanceDeltaRecord>(registryClient).apply {
    configure(config, false)
  }

  fun NonFungibleBalance() = SpecificAvroSerde<NonFungibleBalanceRecord>(registryClient).apply {
    configure(config, false)
  }

  fun NonFungibleBalanceDeltaList() = SpecificAvroSerde<NonFungibleBalanceDeltaListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun CanonicalKey() = SpecificAvroSerde<CanonicalKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun TransactionKey() = SpecificAvroSerde<TransactionKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun BlockMetricKey() = SpecificAvroSerde<BlockMetricKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun TransactionReceiptKey() = SpecificAvroSerde<TransactionReceiptKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun TraceKey() = SpecificAvroSerde<TraceKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun TransactionList() = SpecificAvroSerde<TransactionListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ReceiptList() = SpecificAvroSerde<TransactionReceiptListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TraceList() = SpecificAvroSerde<TraceListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun Transaction() = SpecificAvroSerde<TransactionRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionReceipt() = SpecificAvroSerde<TransactionReceiptRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionGasPriceList() = SpecificAvroSerde<TransactionGasPriceListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionGasUsedList() = SpecificAvroSerde<TransactionGasUsedListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionFeeList() = SpecificAvroSerde<TransactionFeeListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockAuthor() = SpecificAvroSerde<BlockAuthorRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ContractLifecycle() = SpecificAvroSerde<ContractLifecycleRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ContractLifecycleList() = SpecificAvroSerde<ContractLifecycleListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ContractKey() = SpecificAvroSerde<ContractKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun Contract() = SpecificAvroSerde<ContractRecord>(registryClient).apply {
    configure(config, false)
  }

  fun Erc20Metadata() = SpecificAvroSerde<Erc20MetadataRecord>(registryClient).apply {
    configure(config, false)
  }

  fun Erc721Metadata() = SpecificAvroSerde<Erc721MetadataRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockMetricsHeader() = SpecificAvroSerde<BlockMetricsHeaderRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockMetricsTransaction() = SpecificAvroSerde<BlockMetricsTransactionRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockMetricsTransactionFee() = SpecificAvroSerde<BlockMetricsTransactionFeeRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockMetricsTransactionTrace() = SpecificAvroSerde<BlockMetricsTransactionTraceRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockHeader() = SpecificAvroSerde<BlockHeaderRecord>(registryClient).apply {
    configure(config, false)
  }

  fun UncleList() = SpecificAvroSerde<UncleListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun UncleKey() = SpecificAvroSerde<UncleKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun Uncle() = SpecificAvroSerde<UncleRecord>(registryClient).apply {
    configure(config, false)
  }
}
