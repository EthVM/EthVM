package io.enkrypt.bolt.processors

import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.bolt.extensions.toBigInteger
import io.enkrypt.bolt.extensions.toByteBuffer
import io.enkrypt.bolt.BoltSerdes
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.Serialized
import java.math.BigInteger
import java.nio.ByteBuffer
import java.util.*

/**
 * This processor processes addresses balances and type (if is a smart contract or not).
 */
class StateBoltProcessor : AbstractBoltProcessor() {

  override val id: String = "state-processor"

  private val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {

    // Create stream builder
    val builder = StreamsBuilder()

    val (_, _, accountStateTopic, tokenTransfersTopic) = appConfig.kafka.topicsConfig

    val fungibleBalances = builder
      .stream("fungible-token-movements", Consumed.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))
      .groupByKey(Serialized.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))
      .reduce(
        { memo, next -> FungibleTokenBalanceRecord
          .newBuilder(memo)
          .setAmount(ByteBuffer.wrap(memo.getAmount().toBigInteger()!!.add(next.getAmount().toBigInteger()).toByteArray()))
          .build()
        },
        Materialized.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance())
      )

    fungibleBalances
      .toStream()
      .to("fungible-token-balances", Produced.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))

    //

    val blockMetricsStream = builder
      .stream("block-metrics", Consumed.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    val blockMetricsByDayCount = blockMetricsStream
      .groupByKey(Serialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))
      .count(Materialized.with(BoltSerdes.MetricKey(), Serdes.Long()))

    blockMetricsStream
      .groupByKey(Serialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))
      .reduce(
        { memo, next ->

          val metricBuilder = MetricRecord.newBuilder(memo)

          if(next.getIntValue() != null){ metricBuilder.setIntValue(memo.getIntValue() + next.getIntValue()) }
          if(next.getLongValue() != null){ metricBuilder.setLongValue(memo.getLongValue() + next.getLongValue()) }
          if(next.getFloatValue() != null){ metricBuilder.setFloatValue(memo.getFloatValue() + next.getFloatValue()) }
          if(next.getDoubleValue() != null){ metricBuilder.setDoubleValue(memo.getDoubleValue() + next.getDoubleValue()) }

          if(next.getBigIntegerValue() != null){
            val memoBigInt = memo.getBigIntegerValue().toBigInteger()!!
            val nextBigInt = next.getBigIntegerValue().toBigInteger()
            metricBuilder.setBigIntegerValue(memoBigInt.add(nextBigInt).toByteBuffer())
          }

          metricBuilder.build()
        },
        Materialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric())
      ).join(
        blockMetricsByDayCount,
        { aggMetric, metricsCount ->

          if(metricsCount < 2) {
            aggMetric
          } else {

            val metricBuilder = MetricRecord.newBuilder(aggMetric)

            if(aggMetric.getIntValue() != null){ metricBuilder.setIntValue(aggMetric.getIntValue() / metricsCount.toInt()) }
            if(aggMetric.getLongValue() != null){ metricBuilder.setLongValue(aggMetric.getLongValue() / metricsCount) }
            if(aggMetric.getFloatValue() != null){ metricBuilder.setFloatValue(aggMetric.getFloatValue() / metricsCount ) }
            if(aggMetric.getDoubleValue() != null){ metricBuilder.setDoubleValue(aggMetric.getDoubleValue() / metricsCount) }

            if(aggMetric.getBigIntegerValue() != null){
              val aggBigInt = aggMetric.getBigIntegerValue().toBigInteger()!!
              metricBuilder.setBigIntegerValue(aggBigInt.divide(BigInteger.valueOf(metricsCount)).toByteBuffer())
            }

            metricBuilder.build()

          }

        },
        Materialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric())
      ).toStream()
      .to("block-statistics", Produced.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

}
