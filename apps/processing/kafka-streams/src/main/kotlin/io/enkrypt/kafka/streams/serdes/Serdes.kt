package io.enkrypt.kafka.streams.serdes

import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.BlockChainEventsRecord
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.avro.processing.ReorgKeyRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.avro.processing.TokenTransferKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
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

  fun BlockKey() = SpecificAvroSerde<BlockKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun Block() = SpecificAvroSerde<BlockRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TokenTransferKey() = SpecificAvroSerde<TokenTransferKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun TokenTransfer() = SpecificAvroSerde<TokenTransferRecord>(registryClient).apply {
    configure(config, false)
  }

  fun TokenBalanceKey() = SpecificAvroSerde<TokenBalanceKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun TokenBalance() = SpecificAvroSerde<TokenBalanceRecord>(registryClient).apply {
    configure(config, false)
  }

  fun MetricKey() = SpecificAvroSerde<MetricKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun Metric() = SpecificAvroSerde<MetricRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ContractKey() = SpecificAvroSerde<ContractKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun ContractCreate() = SpecificAvroSerde<ContractCreateRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ContractDestroy() = SpecificAvroSerde<ContractDestroyRecord>(registryClient).apply {
    configure(config, false)
  }

  fun ReorgKey() = SpecificAvroSerde<ReorgKeyRecord>(registryClient).apply {
    configure(config, true)
  }

  fun ReorgKeyValue() = SpecificAvroSerde<ReorgKeyRecord>(registryClient).apply {
    configure(config, false)
  }

  fun BlockChainEvents() = SpecificAvroSerde<BlockChainEventsRecord>(registryClient).apply {
    configure(config, false)
  }
}
