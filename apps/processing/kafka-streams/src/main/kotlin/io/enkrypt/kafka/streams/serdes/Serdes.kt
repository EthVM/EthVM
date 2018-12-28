package io.enkrypt.kafka.streams.serdes

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

  fun TokenBalanceKey() = SpecificAvroSerde<TokenBalanceKeyRecord>().apply {
    configure(config, true)
  }

  fun TokenBalance() = SpecificAvroSerde<TokenBalanceRecord>().apply {
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

  fun ContractDestroy() = SpecificAvroSerde<ContractDestroyRecord>().apply {
    configure(config, false)
  }

  fun ReorgKey() = SpecificAvroSerde<ReorgKeyRecord>().apply {
    configure(config, true)
  }

  fun ReorgKeyValue() = SpecificAvroSerde<ReorgKeyRecord>().apply {
    configure(config, false)
  }

  fun BlockChainEvents() = SpecificAvroSerde<BlockChainEventsRecord>().apply {
    configure(config, false)
  }


}
