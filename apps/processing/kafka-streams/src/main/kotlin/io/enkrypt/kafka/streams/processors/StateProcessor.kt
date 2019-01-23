package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.processing.MetricKeyRecord
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

    val blockMetricsByDay = builder
      .stream(Topics.BlockMetricsByDay, Consumed.with(Serdes.MetricKey(), Serdes.Metric()))

    // Total metrics

    blockMetricsByDay
      .filter { k, _ -> k.getName().startsWith("Total") }
      .groupByKey(Grouped.with(Serdes.MetricKey(), Serdes.Metric()))
      .aggregate(
        { MetricRecord.newBuilder().build() },
        this::aggregate,
        Materialized.with(Serdes.MetricKey(), Serdes.Metric())
      )
      .toStream()
      .filter { k, _ -> k.getDate() > 0 } // initial entry is emitted for 0 which we want to discard
      .to(Topics.AggregateBlocksMetricsByDay, Produced.with(Serdes.MetricKey(), Serdes.Metric()))

    // Average metrics

    val avgMetricsGrouped = blockMetricsByDay
      .filter { k, _ -> k.getName().startsWith("Avg") }
      .groupByKey(Grouped.with(Serdes.MetricKey(), Serdes.Metric()))

    // TODO it may be possible to use a reduce to filter out negatives in the count and would be less expensive

    val avgMetricsCount = blockMetricsByDay
      .filter { k, _ -> k.getName().startsWith("Avg") }
      .filter(this::noNegativeValuesFilter)   // negative values are used to reverse the effect of a block
      .groupByKey(Grouped.with(Serdes.MetricKey(), Serdes.Metric()))
      .count(Materialized.with(Serdes.MetricKey(), KafkaSerdes.Long()))

    avgMetricsGrouped
      .aggregate(
        { MetricRecord.newBuilder().build() },
        this::aggregate,
        Materialized.with(Serdes.MetricKey(), Serdes.Metric())
      )
      .join(
        avgMetricsCount,
        this::average,
        Materialized.with(Serdes.MetricKey(), Serdes.Metric())
      ).toStream()
      .filter { k, _ -> k.getDate() > 0 } // initial entry is emitted for 0 which we want to discard
      .to(Topics.AggregateBlocksMetricsByDay, Produced.with(Serdes.MetricKey(), Serdes.Metric()))
  }

  private fun aggregate(key: MetricKeyRecord, next: MetricRecord, memo: MetricRecord): MetricRecord {
    val metricBuilder = MetricRecord.newBuilder(memo)

    if (next.`getInt$`() != null) {
      metricBuilder.`int$` = (memo.`getInt$`() ?: 0) + next.`getInt$`()
    }
    if (next.`getLong$`() != null) {
      metricBuilder.`long$` = (memo.`getLong$`() ?: 0L) + next.`getLong$`()
    }
    if (next.`getFloat$`() != null) {
      metricBuilder.`float$` = (memo.`getFloat$`() ?: 0.0f) + next.`getFloat$`()
    }
    if (next.`getDouble$`() != null) {
      metricBuilder.`double$` = (memo.`getDouble$`() ?: 0.0) + next.`getDouble$`()
    }

    if (next.getBigInteger() != null) {
      val memoBigInt = memo.getBigInteger().bigInteger() ?: BigInteger.ZERO
      val nextBigInt = next.getBigInteger().bigInteger()!!
      metricBuilder.bigInteger = (memoBigInt + nextBigInt).byteBuffer()
    }

    return metricBuilder.build()
  }

  private fun noNegativeValuesFilter(key: MetricKeyRecord, metric: MetricRecord): Boolean {

    if(metric.`getInt$`() ?: 0 < 0) return false
    if(metric.`getLong$`() ?: 0L < 0L) return false
    if(metric.`getFloat$`() ?: 0.0f < 0) return false
    if(metric.`getDouble$`() ?: 0.0 < 0.0) return false

    if (metric.getBigInteger() != null) {
      val value = metric.getBigInteger().bigInteger()!!
      return value >= BigInteger.ZERO
    }

    return true
  }

  private fun average(metric: MetricRecord, count: Long): MetricRecord =
    if (count < 2) {
      metric
    } else {

      // calculate averages for any avg metrics

      val metricBuilder = MetricRecord.newBuilder(metric)

      if (metric.`getInt$`() != null) {
        metricBuilder.`int$` = metric.`getInt$`() / count.toInt()
      }
      if (metric.`getLong$`() != null) {
        metricBuilder.`long$` = metric.`getLong$`() / count
      }
      if (metric.`getFloat$`() != null) {
        metricBuilder.`float$` = metric.`getFloat$`() / count
      }
      if (metric.`getDouble$`() != null) {
        metricBuilder.`double$` = metric.`getDouble$`() / count
      }

      if (metric.getBigInteger() != null) {
        val aggBigInt = metric.getBigInteger().bigInteger()!!
        metricBuilder.bigInteger = aggBigInt.divide(BigInteger.valueOf(count)).byteBuffer()
      }

      metricBuilder.build()
    }
}
