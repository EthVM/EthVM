package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.avro.processing.TransactionCountRecord
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.Serdes.CanonicalCount
import com.ethvm.kafka.streams.Serdes.CanonicalCountKey
import com.ethvm.kafka.streams.config.Topics.CanonicalCount
import com.ethvm.kafka.streams.config.Topics.CanonicalCountDelta
import com.ethvm.kafka.streams.config.Topics.TransactionCount
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

class CountProcessor : AbstractKafkaProcessor() {

  override val id: String = "count-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    aggregateCanonicalCounts(builder)
    aggregateTransactionCounts(builder)

    return builder.build()
  }

  private fun aggregateCanonicalCounts(builder: StreamsBuilder) {

    // single partition topic so we can get away with this
    CanonicalCountDelta.table(builder)
      .groupBy(
        { k, v ->
          KeyValue(
            CanonicalCountKeyRecord.newBuilder()
              .setEntity(k.entity)
              .build(),
            v
          )
        },
        Grouped.with(CanonicalCountKey(), CanonicalCount())
      )
      .aggregate(
        {
          CanonicalCountRecord
            .newBuilder()
            .setCount(0)
            .build()
        },
        // adder
        { key, newValue, aggValue ->
          CanonicalCountRecord.newBuilder(aggValue)
            .setCount(aggValue.count + newValue.count)
            .build()
        },
        // subtractor
        { key, oldValue, aggValue ->
          CanonicalCountRecord.newBuilder(aggValue)
            .setCount(aggValue.count - oldValue.count)
            .build()
        },
        Materialized.with(CanonicalCountKey(), CanonicalCount())
      )
      .toStream()
      .toTopic(CanonicalCount)
  }

  private fun aggregateTransactionCounts(builder: StreamsBuilder) {

    val agg = TransactionCountDelta.stream(builder)
      .groupByKey(Grouped.with(Serdes.AccountKey(), Serdes.TransactionCountDelta()))
      .aggregate(
        {
          TransactionCountRecord.newBuilder()
            .setTimestamp(DateTime(0))
            .build()
        },
        { _, delta, balance ->

          TransactionCountRecord.newBuilder()
            .setTimestamp(delta.getTimestamp())
            .setTotalIn(balance.getTotalIn() + delta.`in`)
            .setTotalOut(balance.getTotalOut() + delta.out)
            .build()
        },
        Materialized.with(Serdes.AccountKey(), Serdes.TransactionCount())
      )

    agg.toStream()
      .toTopic(TransactionCount)
  }
}
