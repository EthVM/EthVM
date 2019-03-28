package io.enkrypt.kafka.streams.di

import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.MockSchemaRegistryClient
import io.enkrypt.kafka.streams.config.AppConfig
import org.apache.avro.Schema
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.StreamsConfig
import org.koin.dsl.module.module
import java.util.Properties

object Modules {

  val kafkaStreams = module {

    val config = get<AppConfig>()

    single {
      when (config.unitTesting) {
        false -> CachedSchemaRegistryClient(config.kafka.schemaRegistryUrl, 100)
        true -> MockSchemaRegistryClient().apply {

          // TODO: After refactor, re-add this logic to properly tests processors
          val subjectsWithSchemas: List<Pair<String, Schema>> = emptyList()

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
        put(ConsumerConfig.FETCH_MAX_BYTES_CONFIG, 52428800) // 50 mb
        put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000) // important when dealing with aggregations/reduces

        put(StreamsConfig.STATE_DIR_CONFIG, config.kafka.streamsStateDir)

        // Serdes - Defaults
        put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
        put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().javaClass.name)
      }
    }
  }
}
