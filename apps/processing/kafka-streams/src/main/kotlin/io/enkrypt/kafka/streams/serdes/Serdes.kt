package io.enkrypt.kafka.streams.serdes

import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.CanonicalEtherBalanceKeyRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.EtherBalanceKeyRecord
import io.enkrypt.avro.capture.EtherBalanceRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TransactionListRecord
import io.enkrypt.avro.capture.TransactionReceiptListRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.exchange.SymbolKeyRecord
import io.enkrypt.avro.processing.BlockMetricsRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.ContractMetadataRecord
import io.enkrypt.avro.processing.TransactionFeeListRecord
import io.enkrypt.avro.processing.TransactionGasPriceListRecord
import io.enkrypt.avro.processing.TransactionGasUsedListRecord
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

  fun CanonicalEtherBalanceKey() = SpecificAvroSerde<CanonicalEtherBalanceKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun EtherBalanceKey() = SpecificAvroSerde<EtherBalanceKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun EtherBalance() = SpecificAvroSerde<EtherBalanceRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockMetrics() = SpecificAvroSerde<BlockMetricsRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ContractKey() = SpecificAvroSerde<ContractKeyRecord>(registryClient).apply {
    configure(config, true)
  }


  fun ContractMetadata() = SpecificAvroSerde<ContractMetadataRecord>(registryClient).apply {
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
