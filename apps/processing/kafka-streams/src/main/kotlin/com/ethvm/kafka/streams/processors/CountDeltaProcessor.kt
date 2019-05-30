package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.AccountKeyRecord
import com.ethvm.avro.processing.TransactionCountDeltaListRecord
import com.ethvm.avro.processing.TransactionCountDeltaRecord
import com.ethvm.common.extensions.reverse
import com.ethvm.kafka.streams.Serdes.CanonicalKey
import com.ethvm.kafka.streams.Serdes.TransactionCountDeltaList
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.config.Topics.TransactionCountDelta
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.Materialized
import org.joda.time.DateTime
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

    transactionCountDeltas(builder)

    return builder.build()
  }

  private fun transactionCountDeltas(builder: StreamsBuilder) {
    val deltas = CanonicalTransactions.stream(builder)
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

    val deltasWithReversals = deltas
      .groupByKey(Grouped.with(CanonicalKey(), TransactionCountDeltaList()))
      .reduce(
        { agg, next ->

          // null values does not trigger this reduce, so in the case of a reorg we will only trigger
          // when the updated value is available

          if (next!!.getBlockHash() == agg!!.getBlockHash()) {

            // an update has been published for a previously seen block
            // we assume no material change and therefore emit an event which will have no impact on the balances

            logger.warn { "Update received. Agg = $agg, next = $next" }

            TransactionCountDeltaListRecord.newBuilder(agg)
              .setTimestamp(next.getTimestamp())
              .setApply(false)
              .build()

          } else {

            // reverse previous deltas

            TransactionCountDeltaListRecord.newBuilder()
              .setTimestamp(next.getTimestamp())
              .setBlockHash(next.getBlockHash())
              .setCounts(next.getCounts())
              .setReversals(agg.getCounts().map { it.reverse() })
              .build()
          }
        },
        Materialized.with(CanonicalKey(), TransactionCountDeltaList())
      ).toStream()

    val deltasForAddress = deltasWithReversals
      .flatMap { _, v ->

        if (v!!.getApply()) {

          (v.getCounts() + v.getReversals())
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

        } else {
          emptyList()
        }

      }

    deltasForAddress.toTopic(TransactionCountDelta)
  }

}
