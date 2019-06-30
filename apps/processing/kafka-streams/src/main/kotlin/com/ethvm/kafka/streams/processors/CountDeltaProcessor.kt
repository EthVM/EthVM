package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.processing.AccountKeyRecord
import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.avro.processing.TransactionCountDeltaListRecord
import com.ethvm.avro.processing.TransactionCountDeltaRecord
import com.ethvm.common.extensions.bigInteger
import com.ethvm.common.extensions.reverse
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.Serdes.TransactionCountDeltaList
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockHeader
import com.ethvm.kafka.streams.config.Topics.CanonicalCountDelta
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.config.Topics.CanonicalUncles
import com.ethvm.kafka.streams.config.Topics.TransactionCountDelta
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.KStream
import org.joda.time.DateTime
import java.lang.IllegalStateException
import java.util.Properties

class CountDeltaProcessor : AbstractKafkaProcessor() {

  override val id: String = "count-delta-processor"

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

    blockHeaderCountDeltas(builder)
    canonicalTransactionTraceCountDeltas(builder)
    canonicalUnclesCountDeltas(builder)
    canonicalTransactionReceiptCountDeltas(builder)

    val canonicalTransactions = CanonicalTransactions.stream(builder)

    canonicalTransactionCountDeltas(canonicalTransactions)
    addressTransactionCountDeltas(builder, canonicalTransactions)

    return builder.build()
  }

  private fun blockHeaderCountDeltas(builder: StreamsBuilder) {

    CanonicalBlockHeader.stream(builder)
      .map { k, v ->
        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("block_header")
            .setNumber(k.number)
            .build(),
          when (v) {
            null -> null
            else ->
              CanonicalCountRecord.newBuilder()
                .setCount(1)
                .build()
          }
        )
      }.toTopic(CanonicalCountDelta)
  }

  private fun canonicalUnclesCountDeltas(builder: StreamsBuilder) {

    CanonicalUncles.stream(builder)
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
      }.toTopic(CanonicalCountDelta)
  }

  private fun canonicalTransactionTraceCountDeltas(builder: StreamsBuilder) {

    CanonicalTraces.stream(builder)
      .map { k, v ->

        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("transaction_trace")
            .setNumber(k.number)
            .build(),
          when (v) {
            null -> null
            else -> {

              val traces = v.getTraces()

              val rewardTraces = traces.filter { it.transactionHash == null }
              val txTraces = traces.filterNot { it.transactionHash == null }

              var count = 0L

              if (rewardTraces.isNotEmpty()) {
                count += 1
              }

              if (txTraces.isNotEmpty()) {
                count += txTraces
                  .groupBy { it.transactionHash }
                  .count()
              }

              CanonicalCountRecord.newBuilder()
                .setCount(count)
                .build()
            }
          }

        )
      }.toTopic(CanonicalCountDelta)
  }

  private fun canonicalTransactionReceiptCountDeltas(builder: StreamsBuilder) {

    CanonicalReceipts.stream(builder)
      .map { k, v ->
        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("transaction_receipt")
            .setNumber(k.number)
            .build(),
          when (v) {
            null -> null
            else ->
              CanonicalCountRecord.newBuilder()
                .setCount(v.receipts.size.toLong())
                .build()
          }
        )
      }.toTopic(CanonicalCountDelta)
  }

  private fun canonicalTransactionCountDeltas(canonicalTransactions: KStream<CanonicalKeyRecord, TransactionListRecord?>) {

    canonicalTransactions
      .map { k, v ->
        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("transaction")
            .setNumber(k.number)
            .build(),
          when (v) {
            null -> null
            else ->
              CanonicalCountRecord.newBuilder()
                .setCount(v.transactions.size.toLong())
                .build()
          }
        )
      }
      .toTopic(CanonicalCountDelta)
  }

  private fun addressTransactionCountDeltas(builder: StreamsBuilder, canonicalTransactions: KStream<CanonicalKeyRecord, TransactionListRecord?>) {

    val deltas = canonicalTransactions
      .mapValues { v ->

        when (v) {
          null -> null
          else -> {

            val txCounts = v.getTransactions()
              .map { tx ->

                var counts = listOf(
                  TransactionCountDeltaRecord.newBuilder()
                    .setAddress(tx.from)
                    .setOut(1)
                    .build()
                )

                if (tx.to != null) {
                  counts = counts + TransactionCountDeltaRecord.newBuilder()
                    .setAddress(tx.to)
                    .setIn(1)
                    .build()
                }

                counts
              }.flatten()

            TransactionCountDeltaListRecord.newBuilder()
              .setTimestamp(DateTime(v.getTimestamp()))
              .setBlockHash(v.getBlockHash())
              .setCounts(txCounts)
              .build()
          }
        }
      }

    val reduceStoreName = "canonical-tx-count-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(reduceStoreName, Serdes.TransactionCountDeltaList(), appConfig.unitTesting))

    val deltasWithReversals = deltas
      .transform(CanonicalKStreamReducer(reduceStoreName), reduceStoreName)
      .filter { _, v -> v.newValue != v.oldValue }
      .mapValues { k, change ->

        when {
          change.newValue != null && change.oldValue == null ->
            change.newValue
          change.newValue == null && change.oldValue != null -> {
            logger.info { "Tombstone received. Reversing key = ${k.number.bigInteger()}" }
            TransactionCountDeltaListRecord.newBuilder(change.oldValue)
              .setCounts(change.oldValue.counts.map { it.reverse() })
              .build()
          }
          else -> throw IllegalStateException("New and old values cannot be unique non null values.")
        }
      }

    val deltasForAddress = deltasWithReversals
      .flatMap { _, v ->

        v.counts
          .map { delta ->
            KeyValue(
              AccountKeyRecord.newBuilder()
                .setAddress(delta.address)
                .build(),
              TransactionCountDeltaRecord.newBuilder(delta)
                .setTimestamp(v.getTimestamp())
                .build()
            )
          }
      }

    deltasForAddress.toTopic(TransactionCountDelta)
  }
}
