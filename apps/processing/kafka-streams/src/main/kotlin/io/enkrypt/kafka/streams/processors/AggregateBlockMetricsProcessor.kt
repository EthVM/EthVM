package io.enkrypt.kafka.streams.processors

import io.enkrypt.kafka.streams.config.Topics.BlockMetrics
import io.enkrypt.kafka.streams.config.Topics.TraceBlockMetrics
import io.enkrypt.kafka.streams.serdes.Serdes
import io.enkrypt.kafka.streams.utils.BlockTimeExtractor
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.TimeWindows
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.Properties

class AggregateBlockMetricsProcessor : AbstractKafkaProcessor() {

  override val id: String = "block-metrics-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder().apply {
    }

    val blockTimesByDay =
      BlockMetrics.stream(builder)
        .map { _, v -> KeyValue(startOfDay(v.getTimestamp()), v.getBlockTime()) }
        .groupByKey(Grouped.with(KafkaSerdes.Long(), KafkaSerdes.Long()))

    val blockCountByDay = blockTimesByDay.count()

    blockTimesByDay



    return builder.build()
  }

  private fun startOfDay(timestamp: Long): Long {

    // NOTE: block timestamps are unix time

    val instant = Instant.ofEpochSecond(timestamp * 1000)
    val dateTime = ZonedDateTime.ofInstant(instant, ZoneOffset.UTC)
    return dateTime.truncatedTo(ChronoUnit.DAYS).toInstant().toEpochMilli()

  }

}
