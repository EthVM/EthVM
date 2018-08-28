package io.enkrypt.bolt

import com.fasterxml.jackson.databind.JsonNode
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.connect.json.JsonDeserializer
import org.apache.kafka.connect.json.JsonSerializer
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.KStream
import java.util.*

class Bolt(
  applicationId: String,
  bootstrapServers: String,
  startingOffset: String,
  rawBlocksTopic: String,
  rawPendingTxsTopic: String
) {

  private val logger = KotlinLogging.logger {}

  private val blocksStream: KafkaStreams

  init {
    val props = Properties().apply {
      put(StreamsConfig.APPLICATION_ID_CONFIG, applicationId)
      put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)

      put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
      put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)

      put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, startingOffset)
    }

    // Initialize JSON Serdes for raw-blocks
    val jsonSerializer = JsonSerializer()
    val jsonDeserializer = JsonDeserializer()
    val rawBlocksSerdes = Serdes.serdeFrom<JsonNode>(jsonSerializer, jsonDeserializer)

    // Create stream builder
    val builder = StreamsBuilder()

    // Consume directly raw-blocks
    val stream: KStream<String, String> = builder.stream(rawBlocksTopic, Consumed.with(Serdes.String(), Serdes.String()))
    stream.mapValues { key, value -> logger.debug { "Key: $key | Value: $value" } }

    // Generate the topology
    val topology = builder.build()

    // Create streams
    blocksStream = KafkaStreams(topology, props)
  }

  fun start() {
    blocksStream.apply {
      cleanUp()
      start()
      localThreadsMetadata().forEach { data -> logger.debug { data } }
    }

    Runtime.getRuntime().addShutdownHook(Thread(blocksStream::close))
  }

}
