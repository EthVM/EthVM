package com.ethvm.kafka.streams.processors

import com.ethvm.kafka.streams.Serdes.CanonicalCount
import com.ethvm.kafka.streams.config.Topics.CanonicalCount
import com.ethvm.kafka.streams.config.Topics.CanonicalCountDelta
import com.ethvm.kafka.streams.processors.transformers.CanonicalCountKStreamReducer
import com.ethvm.kafka.streams.processors.transformers.CanonicalCounter
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import java.util.Properties

class CanonicalCountProcessor : AbstractKafkaProcessor() {

  override val id: String = "canonical-count-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    aggregateCanonicalCounts(builder)

    return builder.build()
  }

  private fun aggregateCanonicalCounts(builder: StreamsBuilder) {

    val reduceStoreName = "count-reduce"
    val countStoreName = "count-store"

    builder
      .addStateStore(CanonicalKStreamReducer.store(reduceStoreName, CanonicalCount(), appConfig.unitTesting))
      .addStateStore(CanonicalCounter.store(countStoreName, CanonicalCount(), appConfig.unitTesting))

    CanonicalCountDelta.stream(builder)
      .transform(CanonicalCountKStreamReducer(reduceStoreName), reduceStoreName)
      .transform(CanonicalCounter(countStoreName), countStoreName)
      .toTopic(CanonicalCount)
  }
}
