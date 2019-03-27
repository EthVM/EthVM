package io.enkrypt.kafka.streams

import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.ContractKeyRecord
import io.enkrypt.avro.capture.ContractLifecycleListRecord
import io.enkrypt.avro.capture.ContractLifecycleRecord
import io.enkrypt.avro.capture.ContractMetadataRecord
import io.enkrypt.avro.capture.ContractRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TransactionListRecord
import io.enkrypt.avro.capture.TransactionReceiptListRecord
import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.exchange.SymbolKeyRecord
import io.enkrypt.avro.processing.AddressMetadataKeyRecord
import io.enkrypt.avro.processing.AddressMetadataRecord
import io.enkrypt.avro.processing.BlockAuthorRecord
import io.enkrypt.avro.processing.BlockMetricsRecord
import io.enkrypt.avro.processing.FungibleBalanceDeltaListRecord
import io.enkrypt.avro.processing.FungibleBalanceDeltaRecord
import io.enkrypt.avro.processing.FungibleBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleBalanceRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.avro.processing.TransactionFeeListRecord
import io.enkrypt.avro.processing.TransactionGasPriceListRecord
import io.enkrypt.avro.processing.TransactionGasPriceRecord
import io.enkrypt.avro.processing.TransactionGasUsedListRecord
import io.enkrypt.avro.processing.TransactionGasUsedRecord
import io.enkrypt.avro.tokens.EthTokenListsKeyRecord
import io.enkrypt.kafka.streams.config.KafkaConfig
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject

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

  fun CanonicalKey() = SpecificAvroSerde<CanonicalKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun Block() = SpecificAvroSerde<BlockHeaderRecord>(registryClient).apply {
    configure(config, false)
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

  fun ContractList() = SpecificAvroSerde<ContractRecord>(registryClient).apply {
    configure(config, false)
  }

  fun FungibleBalanceDeltaList() = SpecificAvroSerde<FungibleBalanceDeltaListRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionGasPrice() = SpecificAvroSerde<TransactionGasPriceRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TransactionGasUsed() = SpecificAvroSerde<TransactionGasUsedRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockMetrics() = SpecificAvroSerde<BlockMetricsRecord>(registryClient).apply {
    configure(config, false)
  }

  fun MetricKey() = SpecificAvroSerde<MetricKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun Metric() = SpecificAvroSerde<MetricRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockHeader() = SpecificAvroSerde<BlockHeaderRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ContractMetadata() = SpecificAvroSerde<ContractMetadataRecord>(registryClient).apply {
    configure(config, false)
  }

  fun AddressMetadataKey() = SpecificAvroSerde<AddressMetadataKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun AddressMetadata() = SpecificAvroSerde<AddressMetadataRecord>(registryClient).apply {
    configure(config, false)
  }

  fun SymbolKey() = SpecificAvroSerde<SymbolKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun ExchangeRate() = SpecificAvroSerde<ExchangeRateRecord>(registryClient).apply {
    configure(config, false)
  }

  fun EthTokenListsKey() = SpecificAvroSerde<EthTokenListsKeyRecord>(registryClient).apply {
    configure(config, true)
  }
}
