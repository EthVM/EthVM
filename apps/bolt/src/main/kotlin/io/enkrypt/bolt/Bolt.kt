package io.enkrypt.bolt

import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.config.AppConfig
import io.enkrypt.bolt.models.Block
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.*


class Bolt : KoinComponent {

  private val appConfig: AppConfig by inject()
  private val kafkaProps: Properties by inject(name = "kafka.Properties")

  private val logger = KotlinLogging.logger {}
  private val streams: KafkaStreams

  init {

    // Avro Serdes

    val (schemaRegistryUrl) = appConfig
    val (rawBlocksTopic) = appConfig.topicsConfig

    val blockSerde = SpecificAvroSerde<Block>()
    val blockSerdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to schemaRegistryUrl)
    blockSerde.configure(blockSerdeProps, false)

    // Create stream builder
    val builder = StreamsBuilder()

    val blocks = builder.stream(rawBlocksTopic, Consumed.with(Serdes.String(), blockSerde))

    blocks
      .filter { key, value ->
        value.getTransactions()
          .map { t ->
            t.getContractAddress() != null
          }.fold(false) { memo, next -> memo || next }
      }
      .foreach { key, value -> logger.info { "Block that creates a contract - Key: $key | Value: $value" } }

    blocks
      .flatMap { key, value ->
        value.getTransactions()
          .filter { t -> !(t.getFrom() == null && t.getTo() == null) }
          .map { t ->
            listOf(
              KeyValue(t.getFrom(), t.getFromBalance()),
              KeyValue(t.getTo(), t.getToBalance())
            )
          }.flatten()
      }.foreach { address, balance -> logger.info { "Balance update - Address: $address | Balance: $balance" } }

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  fun start() {
    logger.info { "Starting BOLT..." }

    streams.apply {
      cleanUp()
      start()
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }

}
