package io.enkrypt.kafka.streams.di

import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.MockSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.kafka.streams.config.AppConfig
import io.enkrypt.kafka.streams.config.Topics
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.StreamsConfig
import org.koin.dsl.module.module
import java.util.Properties

object Modules {

  val kafkaStreams = module {

    val config = get<AppConfig>()

    single<SchemaRegistryClient> {
      when (config.unitTesting) {
        false -> CachedSchemaRegistryClient(config.kafka.schemaRegistryUrl, 100)
        true -> MockSchemaRegistryClient().apply {

          val subjectsWithSchemas = listOf(
            Pair(Topics.Blocks, BlockRecord.`SCHEMA$`),
            Pair("${Topics.Blocks}-key", BlockKeyRecord.`SCHEMA$`),

            Pair(Topics.FungibleTokenMovements, TokenBalanceRecord.`SCHEMA$`),
            Pair("${Topics.FungibleTokenMovements}-key", TokenBalanceKeyRecord.`SCHEMA$`),

            Pair(Topics.BlockMetricsByDay, MetricRecord.`SCHEMA$`),
            Pair("${Topics.BlockMetricsByDay}-key", MetricKeyRecord.`SCHEMA$`),

            Pair(Topics.ContractCreations, ContractCreateRecord.`SCHEMA$`),
            Pair("${Topics.ContractCreations}-key", ContractKeyRecord.`SCHEMA$`),

            Pair(Topics.ContractDestructions, ContractDestroyRecord.`SCHEMA$`),
            Pair("${Topics.ContractDestructions}-key", ContractKeyRecord.`SCHEMA$`)
          )

          subjectsWithSchemas.forEach { (subject, schema) -> register(subject, schema) }
        }
      }
    }

    factory(name = "baseKafkaStreamsConfig") {
      Properties().apply {
        // App
        put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, config.kafka.bootstrapServers)
        put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE)

        //
        put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, config.kafka.startingOffset)

        put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000) // important when dealing with aggregations/reduces

        put(StreamsConfig.STATE_DIR_CONFIG, config.kafka.streamsStateDir)

        // Serdes - Defaults
        put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
        put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().javaClass.name)
      }
    }
  }
}
