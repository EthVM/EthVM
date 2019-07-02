package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.UncleRecord
import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.avro.processing.UncleKeyRecord
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Topics.CanonicalUncles
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import java.util.Properties

class CanonicalUnclesProcessor : AbstractKafkaProcessor() {

  override val id: String = "canonical-uncles-processor"

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

    val canonicalUncles = CanonicalUncles.stream(builder)

    // count

    canonicalUncles
      .map { k, v ->
        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("uncle")
            .setNumber(k.number)
            .build(),
          when (v) {
            null -> null
            else ->
              CanonicalCountRecord.newBuilder()
                .setCount(v.uncles.size.toLong())
                .build()
          }
        )
      }.toTopic(Topics.CanonicalCountDelta)

    // flat map

    canonicalUncles
      .flatMapValues { _, v ->
        v!!.getUncles()
          .map {
            UncleRecord.newBuilder(it)
              .setTimestamp(v.getTimestamp())
              .build()
          }
      }
      .map { _, v ->
        KeyValue(
          UncleKeyRecord.newBuilder()
            .setHash(v.getHash())
            .build(),
          v
        )
      }
      .toTopic(Topics.Uncle)

    return builder.build()
  }
}
