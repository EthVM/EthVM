package io.enkrypt.bolt

import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.models.Block
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.KStream
import java.util.*


class Bolt(
  // General
  applicationId: String,
  bootstrapServers: String,
  startingOffset: String,
  schemaRegistryUrl: String,

  // Input Topics
  rawBlocksTopic: String,
  rawPendingTxsTopic: String,

  // Output Topics
  processedBlocksTopic: String,
  processedBlockStatsTopic: String,
  processedTxsTopic: String,
  processedAccountsTopic: String
) {

  private val logger = KotlinLogging.logger {}

  private val streams: KafkaStreams

  init {
    // Create Kafka Properties
    val props = Properties().apply {
      // App
      put(StreamsConfig.APPLICATION_ID_CONFIG, applicationId)
      put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
      put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl)

      // Processing
      put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.AT_LEAST_ONCE)
      put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, startingOffset)

      // Serdes
      put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
      put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, SpecificAvroSerde::class.java.name)
    }

    // Avro Serdes
    val blockSerde = SpecificAvroSerde<Block>()

    // Create stream builder
    val builder = StreamsBuilder()

    // Consume directly raw-blocks
    val rawBlocksStream: KStream<String, Block> = builder.stream(rawBlocksTopic, Consumed.with(Serdes.String(), blockSerde))
    rawBlocksStream.foreach { key, value -> logger.debug { "RawBlocksStream - Key: $key | Value: $value" } }

    // Consume directly raw-pending-txs
//    val rawPendingTxsStream: KStream<String, JsonNode> = builder.stream(rawPendingTxsTopic, Consumed.with(Serdes.String(), jsonSerdes))
//    rawPendingTxsStream.foreach { key, value -> logger.debug { "RawPendingTxsStream - Key: $key | Value: $value" } }

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, props)
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
