package io.enkrypt.processing.processors

import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.processing.BoltSerdes
import io.enkrypt.processing.Topics
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.Serialized
import java.math.BigInteger
import java.nio.ByteBuffer
import java.util.Properties

/**
 * This processor processes addresses balances and type (if is a smart contract or not).
 */
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
      .stream(Topics.FungibleTokenMovements, Consumed.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))
      .groupByKey(Serialized.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))
      .reduce(
        { memo, next ->
          FungibleTokenBalanceRecord
            .newBuilder(memo)
            .setAmount(ByteBuffer.wrap(memo.getAmount().bigInteger()!!.add(next.getAmount().bigInteger()).toByteArray()))
            .build()
        },
        Materialized.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance())
      )

    fungibleBalances
      .toStream()
      .to(Topics.FungibleTokenBalances, Produced.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))

    //

    val blockMetricsStream = builder
      .stream(Topics.BlockMetrics, Consumed.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    val blockMetricsByDayCount = blockMetricsStream
      .groupByKey(Serialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))
      .count(Materialized.with(BoltSerdes.MetricKey(), Serdes.Long()))

    blockMetricsStream
      .groupByKey(Serialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))
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
            metricBuilder.bigIntegerValue = memoBigInt.add(nextBigInt).byteBuffer()
          }

          metricBuilder.build()
        },
        Materialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric())
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
              metricBuilder.bigIntegerValue = aggBigInt.divide(BigInteger.valueOf(metricsCount)).byteBuffer()
            }

            metricBuilder.build()

          }

        },
        Materialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric())
      ).toStream()
      .to(Topics.BlockStatistics, Produced.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    // Generate the topology
    return builder.build()
  }

}
