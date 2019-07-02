package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.BlockMetricKeyRecord
import com.ethvm.avro.processing.BlockMetricsTransactionFeeRecord
import com.ethvm.common.extensions.getTransactionFeeBI
import com.ethvm.common.extensions.setAvgTxFeesBI
import com.ethvm.common.extensions.setTotalTxFeesBI
import com.ethvm.kafka.streams.config.Topics.BlockMetricsTransactionFee
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactionFees
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import java.math.BigInteger
import java.util.Properties

class BlockMetricsProcessor : AbstractKafkaProcessor() {

  override val id: String = "block-metrics-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 2)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder().apply {}

    CanonicalTransactionFees.stream(builder)
      // we don't want to process tombstones or genesis block
      .filterNot { _, v -> v?.getBlockHash() == null }
      .map { _, txFeeList ->

        if (txFeeList == null) {
          null
        } else {

          val transactionFees = txFeeList.getTransactionFees()
          val count = transactionFees.size.toBigInteger()

          val totalTxFees = transactionFees.fold(BigInteger.ZERO) { memo, next ->
            memo + next.getTransactionFeeBI()
          }

          val avgTxFees = when (count) {
            BigInteger.ZERO -> BigInteger.ZERO
            else -> totalTxFees / count
          }

          KeyValue(
            BlockMetricKeyRecord.newBuilder()
              .setBlockHash(txFeeList.getBlockHash())
              .setTimestamp(txFeeList.getTimestamp())
              .build(),
            BlockMetricsTransactionFeeRecord.newBuilder()
              .setTimestamp(txFeeList.getTimestamp())
              .setTotalTxFeesBI(totalTxFees)
              .setAvgTxFeesBI(avgTxFees)
              .build()
          )
        }
      }
      .toTopic(BlockMetricsTransactionFee)

    //

    return builder.build()
  }
}
