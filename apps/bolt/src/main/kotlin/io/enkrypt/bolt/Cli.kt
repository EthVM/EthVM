package io.enkrypt.bolt

import com.fasterxml.jackson.databind.JsonNode
import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
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

class Cli : CliktCommand() {

    // Kafka
    private val applicationId: String by option(help = "Identifier for the stream processing application").default(DEFAULT_APPLICATION_ID)
    private val streamTopic: String by option(help = "Name of the stream that Bolt will listen").default(DEFAULT_STREAM_TOPIC)
    private val bootstrapServers: String by option(help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster").default(DEFAULT_BOOTSTRAP_SERVERS)
    private val offset: String by option(help = "From which offset is going to start processing events").default(DEFAULT_AUTO_OFFSET)

    // General
    private val verbose: Boolean by option("Enable verbose mode").flag()

    override fun run() {
        val props = Properties().apply {
            put(StreamsConfig.APPLICATION_ID_CONFIG, applicationId)
            put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)

            put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
            put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)

            put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, offset)
        }

        // JSON Serde
        val jsonSerializer = JsonSerializer()
        val jsonDeserializer = JsonDeserializer()
        val jsonSerde = Serdes.serdeFrom<JsonNode>(jsonSerializer, jsonDeserializer)

        // Assemble a streams builder
        val builder = StreamsBuilder()
        val stream: KStream<String, JsonNode> = builder.stream(streamTopic, Consumed.with(Serdes.String(), jsonSerde))
        stream.mapValues { _, value ->
            println("VALUE: $value")
        }
        val topology = builder.build()

        // Create stream
        val streams = KafkaStreams(topology, props).apply {
            cleanUp()
            start()
            localThreadsMetadata().forEach { data -> println(data) }
        }

        // Add hook to listen to Ctrl + C events
        Runtime.getRuntime().addShutdownHook(Thread(streams::close))
    }

    companion object {
        const val DEFAULT_APPLICATION_ID = "bolt"
        const val DEFAULT_BOOTSTRAP_SERVERS = "127.0.0.1:9092"
        const val DEFAULT_STREAM_TOPIC = "blocks"
        const val DEFAULT_AUTO_OFFSET = "earliest"
    }
}
