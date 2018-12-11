package io.enkrypt.processing

import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.ContractCreationRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.ContractSuicideRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceRecord
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject

@Suppress("FunctionName")
object BoltSerdes : KoinComponent {

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

  fun ContractCreation() = SpecificAvroSerde<ContractCreationRecord>().apply {
    configure(config, false)
  }

  fun ContractSuicide() = SpecificAvroSerde<ContractSuicideRecord>().apply {
    configure(config, false)
  }

}

