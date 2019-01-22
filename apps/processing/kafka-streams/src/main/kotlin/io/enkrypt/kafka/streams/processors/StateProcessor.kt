package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import java.math.BigInteger
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class StateProcessor : AbstractKafkaProcessor() {

  override val id: String = "state-processor"

  override val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    buildBalancesTopology(builder)
    buildMetricsTopology(builder)

    // Generate the topology
    return builder.build()
  }

  private fun buildBalancesTopology(builder: StreamsBuilder) {

    val fungibleBalances = builder
      .stream(
        Topics.FungibleTokenMovements,
        Consumed.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )
      .groupByKey(Grouped.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))
      .reduce(
        { memo, next ->

          val total = memo.getAmount().bigInteger()!!
          val delta = next.getAmount().bigInteger()!!

          TokenBalanceRecord
            .newBuilder(memo)
            .setAmount((total + delta).byteBuffer())
            .build()
        },
        Materialized.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    fungibleBalances
      .toStream()
      .mapValues { it ->

        // balances are unsigned so we convert here

        TokenBalanceRecord
          .newBuilder(it)
          .setAmount(it.getAmount().bigInteger().unsignedByteBuffer())
          .build()
      }
      .to(Topics.Balances, Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))

  }

  private fun buildMetricsTopology(builder: StreamsBuilder) {
    // Metrics

    val blockMetricsStream = builder
      .stream(Topics.BlockMetricsByDay, Consumed.with(Serdes.MetricKey(), Serdes.Metric()))

    val blockMetricsByDayCount = blockMetricsStream
      .groupByKey(Grouped.with(Serdes.MetricKey(), Serdes.Metric()))
      .count(Materialized.with(Serdes.MetricKey(), KafkaSerdes.Long()))

    blockMetricsStream
      .groupByKey(Grouped.with(Serdes.MetricKey(), Serdes.Metric()))
      .reduce(
        { memo, next ->

          val metricBuilder = MetricRecord.newBuilder(memo)

          if (next.`getInt$`() != null) {
            metricBuilder.`int$` = memo.`getInt$`() + next.`getInt$`()
          }
          if (next.`getLong$`() != null) {
            metricBuilder.`long$` = memo.`getLong$`() + next.`getLong$`()
          }
          if (next.`getFloat$`() != null) {
            metricBuilder.`float$` = memo.`getFloat$`() + next.`getFloat$`()
          }
          if (next.`getDouble$`() != null) {
            metricBuilder.`double$` = memo.`getDouble$`() + next.`getDouble$`()
          }

          if (next.getBigInteger() != null) {
            val memoBigInt = memo.getBigInteger().bigInteger()!!
            val nextBigInt = next.getBigInteger().bigInteger()
            metricBuilder.bigInteger = memoBigInt.add(nextBigInt).unsignedByteBuffer()
          }

          metricBuilder.build()
        },
        Materialized.with(Serdes.MetricKey(), Serdes.Metric())
      ).join(
        blockMetricsByDayCount,
        { aggMetric, metricsCount ->

          if (metricsCount < 2) {
            aggMetric
          } else {

            val metricBuilder = MetricRecord.newBuilder(aggMetric)

            if (aggMetric.`getInt$`() != null) {
              metricBuilder.`int$` = aggMetric.`getInt$`() / metricsCount.toInt()
            }
            if (aggMetric.`getLong$`() != null) {
              metricBuilder.`long$` = aggMetric.`getLong$`() / metricsCount
            }
            if (aggMetric.`getFloat$`() != null) {
              metricBuilder.`float$` = aggMetric.`getFloat$`() / metricsCount
            }
            if (aggMetric.`getDouble$`() != null) {
              metricBuilder.`double$` = aggMetric.`getDouble$`() / metricsCount
            }

            if (aggMetric.getBigInteger() != null) {
              val aggBigInt = aggMetric.getBigInteger().bigInteger()!!
              metricBuilder.bigInteger = aggBigInt.divide(BigInteger.valueOf(metricsCount)).unsignedByteBuffer()
            }

            metricBuilder.build()
          }
        },
        Materialized.with(Serdes.MetricKey(), Serdes.Metric())
      ).toStream()
      .to(Topics.AggregateBlocksMetricsByDay, Produced.with(Serdes.MetricKey(), Serdes.Metric()))
  }
}
