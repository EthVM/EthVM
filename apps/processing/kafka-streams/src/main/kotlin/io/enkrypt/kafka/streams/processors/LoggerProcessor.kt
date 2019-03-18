package io.enkrypt.kafka.streams.processors

import io.enkrypt.kafka.streams.config.Topics.CanonicalEtherBalances
import io.enkrypt.kafka.streams.config.Topics.EtherBalances
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class LoggerProcessor : AbstractKafkaProcessor() {

  override val id: String = "logger-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
      put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000L)
      put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 2000000000)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {}

    EtherBalances.stream(builder)
      .peek{ k, v -> logger.info{ "Balance update | address = ${k.getAddress()}, balance = ${v.getBalance()}"}}
    // Generate the topology
    return builder.build()
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
