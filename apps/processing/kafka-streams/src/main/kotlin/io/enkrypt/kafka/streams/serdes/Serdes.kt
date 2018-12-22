package io.enkrypt.kafka.streams.serdes

import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.*
import io.enkrypt.kafka.streams.config.KafkaConfig
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject

@Suppress("FunctionName")
object Serdes : KoinComponent {

  private val kafkaConfig: KafkaConfig by inject()

  private val config = mutableMapOf(
    "schema.registry.url" to kafkaConfig.schemaRegistryUrl
  )

  fun BlockKey() = SpecificAvroSerde<BlockKeyRecord>().apply {
    configure(config, true)
  }

  fun Block() = SpecificAvroSerde<BlockRecord>().apply {
    configure(config, false)
  }

  fun FungibleTokenBalanceKey() = SpecificAvroSerde<FungibleTokenBalanceKeyRecord>().apply {
    configure(config, true)
  }

  fun FungibleTokenBalance() = SpecificAvroSerde<FungibleTokenBalanceRecord>().apply {
    configure(config, false)
  }

  fun NonFungibleTokenBalanceKey() = SpecificAvroSerde<NonFungibleTokenBalanceKeyRecord>().apply {
    configure(config, true)
  }

  fun NonFungibleTokenBalance() = SpecificAvroSerde<NonFungibleTokenBalanceRecord>().apply {
    configure(config, false)
  }

  fun MetricKey() = SpecificAvroSerde<MetricKeyRecord>().apply {
    configure(config, true)
  }

  fun Metric() = SpecificAvroSerde<MetricRecord>().apply {
    configure(config, false)
  }

  fun ContractKey() = SpecificAvroSerde<ContractKeyRecord>().apply {
    configure(config, true)
  }

  fun ContractCreate() = SpecificAvroSerde<ContractCreateRecord>().apply {
    configure(config, false)
  }

  fun ContractDestruct() = SpecificAvroSerde<ContractDestructRecord>().apply {
    configure(config, false)
  }
}
