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
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.Serialized
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

    val fungibleBalances = builder
      .stream(
        Topics.FungibleTokenMovements,
        Consumed.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )
      .groupByKey(Serialized.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))
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
        TokenBalanceRecord
          .newBuilder(it)
          .setAmount(it.getAmount().bigInteger().unsignedByteBuffer())
          .build()
      }
      .to(Topics.FungibleTokenBalances, Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))

    // Metrics

    val blockMetricsStream = builder
      .stream(Topics.BlockMetrics, Consumed.with(Serdes.MetricKey(), Serdes.Metric()))

    val blockMetricsByDayCount = blockMetricsStream
      .groupByKey(Serialized.with(Serdes.MetricKey(), Serdes.Metric()))
      .count(Materialized.with(Serdes.MetricKey(), KafkaSerdes.Long()))

    blockMetricsStream
      .groupByKey(Serialized.with(Serdes.MetricKey(), Serdes.Metric()))
      .reduce(
        { memo, next ->

          val metricBuilder = MetricRecord.newBuilder(memo)

          if (next.getIntValue() != null) {
            metricBuilder.intValue = memo.getIntValue() + next.getIntValue()
          }
          if (next.getLongValue() != null) {
            metricBuilder.longValue = memo.getLongValue() + next.getLongValue()
          }
          if (next.getFloatValue() != null) {
            metricBuilder.floatValue = memo.getFloatValue() + next.getFloatValue()
          }
          if (next.getDoubleValue() != null) {
            metricBuilder.doubleValue = memo.getDoubleValue() + next.getDoubleValue()
          }

          if (next.getBigIntegerValue() != null) {
            val memoBigInt = memo.getBigIntegerValue().bigInteger()!!
            val nextBigInt = next.getBigIntegerValue().bigInteger()
            metricBuilder.bigIntegerValue = memoBigInt.add(nextBigInt).unsignedByteBuffer()
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

            if (aggMetric.getIntValue() != null) {
              metricBuilder.intValue = aggMetric.getIntValue() / metricsCount.toInt()
            }
            if (aggMetric.getLongValue() != null) {
              metricBuilder.longValue = aggMetric.getLongValue() / metricsCount
            }
            if (aggMetric.getFloatValue() != null) {
              metricBuilder.floatValue = aggMetric.getFloatValue() / metricsCount
            }
            if (aggMetric.getDoubleValue() != null) {
              metricBuilder.doubleValue = aggMetric.getDoubleValue() / metricsCount
            }

            if (aggMetric.getBigIntegerValue() != null) {
              val aggBigInt = aggMetric.getBigIntegerValue().bigInteger()!!
              metricBuilder.bigIntegerValue = aggBigInt.divide(BigInteger.valueOf(metricsCount)).unsignedByteBuffer()
            }

            metricBuilder.build()
          }
        },
        Materialized.with(Serdes.MetricKey(), Serdes.Metric())
      ).toStream()
      .to(Topics.BlockStatistics, Produced.with(Serdes.MetricKey(), Serdes.Metric()))

    // Generate the topology
    return builder.build()
  }
}
