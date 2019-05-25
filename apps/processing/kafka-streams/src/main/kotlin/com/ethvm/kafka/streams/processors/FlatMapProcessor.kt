package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.avro.processing.TraceKeyRecord
import com.ethvm.avro.processing.TransactionKeyRecord
import com.ethvm.avro.processing.TransactionReceiptKeyRecord
import com.ethvm.avro.processing.UncleKeyRecord
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.config.Topics.CanonicalUncles
import com.ethvm.kafka.streams.utils.toTopic
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
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 2)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    CanonicalTransactions.stream(builder)
      .flatMapValues { _, v ->
        v.getTransactions()
          .map {
            TransactionRecord.newBuilder(it)
              .setTimestamp(v.getTimestamp())
              .build()
          }
      }
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
      .flatMapValues { _, v ->
        v.getReceipts()
          .map {
            TransactionReceiptRecord.newBuilder(it)
              .setTimestamp(v.getTimestamp())
              .build()
          }
      }
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
      .flatMap { _, v ->

        val traces = v.getTraces()

        val rewardTraces = traces.filter { it.transactionHash == null }
        val txTraces = traces.filterNot { it.transactionHash == null }

        var records = emptyList<KeyValue<TraceKeyRecord, TraceListRecord>>()

        if (rewardTraces.isNotEmpty()) {
          records = records +
            // block reward and uncle reward traces
            KeyValue(
              TraceKeyRecord.newBuilder()
                .setBlockHash(rewardTraces.map { it.blockHash }.first())
                .build(),
              TraceListRecord.newBuilder()
                .setTimestamp(v.getTimestamp())
                .setTraces(rewardTraces)
                .build()
            )
        }

        if (txTraces.isNotEmpty()) {

          val blockHash = txTraces.map { it.blockHash }.first()

          records = records + txTraces
            .groupBy { it.transactionHash }
            .map { (transactionHash, tracesForTransaction) ->

              val rootError = tracesForTransaction
                .first { it.traceAddress.isEmpty() }.error

              KeyValue(
                TraceKeyRecord.newBuilder()
                  .setBlockHash(blockHash)
                  .setTransactionHash(transactionHash)
                  .build(),
                TraceListRecord.newBuilder()
                  .setTimestamp(v.getTimestamp())
                  .setRootError(rootError)
                  .setTraces(tracesForTransaction)
                  .build()
              )
            }
        }

        records
      }
      .toTopic(Topics.TransactionTrace)

    CanonicalUncles.stream(builder)
      .flatMapValues { _, v ->
        v.getUncles()
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
