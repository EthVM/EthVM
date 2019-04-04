package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.processing.TraceKeyRecord
import io.enkrypt.avro.processing.TransactionKeyRecord
import io.enkrypt.avro.processing.TransactionReceiptKeyRecord
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.config.Topics.CanonicalReceipts
import io.enkrypt.kafka.streams.config.Topics.CanonicalTraces
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactions
import io.enkrypt.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import java.util.Properties

class FlatMapProcessor : AbstractKafkaProcessor() {

  override val id: String = "flat-map-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder().apply {}

    CanonicalTransactions.stream(builder)
      .flatMapValues { _, v -> v.getTransactions() }
      .map { _, v ->
        KeyValue(
          TransactionKeyRecord.newBuilder()
            .setHash(v.getHash())
            .build(),
          v
        )
      }
      .toTopic(Topics.Transaction)

    CanonicalReceipts.stream(builder)
      .flatMapValues { _, v -> v.getReceipts() }
      .map { _, v ->
        KeyValue(
          TransactionReceiptKeyRecord.newBuilder()
            .setTransactionHash(v.getTransactionHash())
            .build(),
          v
        )
      }
      .toTopic(Topics.TransactionReceipt)

    CanonicalTraces.stream(builder)
      .flatMapValues { _, v -> v.getTraces() }
      .map { _, v ->
        KeyValue(
          TraceKeyRecord.newBuilder()
            .setBlockHash(v.getBlockHash())
            .setTransactionHash(v.getTransactionHash())
            .setTraceAddress(v.getTraceAddress())
            .build(),
          v
        )
      }
      .toTopic(Topics.TransactionTrace)

    return builder.build()
  }
}
