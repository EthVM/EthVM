package com.ethvm.kafka.streams.apps

import com.ethvm.avro.processing.SystemMetadataKeyRecord
import com.ethvm.avro.processing.SystemMetadataRecord
import com.ethvm.kafka.streams.config.KafkaConfig
import com.ethvm.kafka.streams.config.Topics
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.serializers.KafkaAvroSerializer
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.clients.producer.ProducerRecord
import org.koin.core.context.startKoin
import org.koin.dsl.module
import java.util.Properties
import java.util.concurrent.TimeUnit

class MetadataCommand : CliktCommand() {

  private val bootstrapServers: String by option(
    help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster",
    envvar = "KAFKA_BOOTSTRAP_SERVERS"
  ).default(ProcessingCommand.DEFAULT_BOOTSTRAP_SERVERS)

  private val schemaRegistryUrl: String by option(
    help = "Kafka schema registry url",
    envvar = "KAFKA_SCHEMA_REGISTRY_URL"
  ).default(ProcessingCommand.DEFAULT_SCHEMA_REGISTRY_URL)

  private val key: String? by option(help = "Key to update")

  private val value: String? by option(help = "Value to set for the key")

  override fun run() {

    requireNotNull(key) { "key is required" }
    requireNotNull(value) { "value is required" }

    // DI

    val configModule = module {

      single {
        KafkaConfig(
          bootstrapServers,
          "earliest",
          schemaRegistryUrl,
          "/dev/null",
          1
        )
      }

      single<SchemaRegistryClient> {
        CachedSchemaRegistryClient(schemaRegistryUrl, 10)
      }
    }

    startKoin {
      modules(configModule)
    }

    // init producer

    val kafkaProps = Properties().apply {

      put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
      put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl)

      // Avro for serialization
      put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java.name)
      put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java.name)
    }

    val producer = KafkaProducer<SystemMetadataKeyRecord, SystemMetadataRecord>(kafkaProps)

    // send message

    val future = producer.send(
      ProducerRecord(
        Topics.SystemMetadata.name,
        SystemMetadataKeyRecord.newBuilder()
          .setKey(key)
          .build(),
        SystemMetadataRecord.newBuilder()
          .setValue(value)
          .build()
      )
    )

    // wait for confirmation

    future.get(10, TimeUnit.SECONDS)

    //
    println { "Success. Key = $key, value = $value" }
  }
}

fun main(args: Array<String>) {
  MetadataCommand().main(args)
}
