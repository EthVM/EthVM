package io.enkrypt.bolt

import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.capture.BlockSummaryRecord
import io.enkrypt.avro.processing.*
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject


object BoltSerdes : KoinComponent {

  private val kafkaConfig: KafkaConfig by inject()

  private val config = mapOf(
    "schema.registry.url" to kafkaConfig.schemaRegistryUrl
  )

  fun BlockSummaryRecord() = SpecificAvroSerde<BlockSummaryRecord>().apply {
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

  fun ContractCreation() = SpecificAvroSerde<ContractCreationRecord>().apply {
    configure(config, false)
  }

  fun ContractSuicide() = SpecificAvroSerde<ContractSuicideRecord>().apply {
    configure(config, false)
  }
}

