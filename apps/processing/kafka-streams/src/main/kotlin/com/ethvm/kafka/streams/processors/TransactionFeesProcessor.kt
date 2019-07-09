package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.TransactionFeeListRecord
import com.ethvm.avro.processing.TransactionFeeRecord
import com.ethvm.avro.processing.TransactionKeyRecord
import com.ethvm.common.extensions.getGasPriceBI
import com.ethvm.common.extensions.getGasUsedBI
import com.ethvm.common.extensions.setTransactionFeeBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalGasPrices
import com.ethvm.kafka.streams.config.Topics.CanonicalGasUsed
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactionFees
import com.ethvm.kafka.streams.config.Topics.TransactionFee
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.JoinWindows
import org.apache.kafka.streams.kstream.Joined
import java.time.Duration
import java.util.Properties

class TransactionFeesProcessor : AbstractKafkaProcessor() {

  override val id: String = "transaction-fees-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 2)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    CanonicalGasPrices.stream(builder)
      .join(
        CanonicalGasUsed.stream(builder),
        { left, right ->

          // null values do no trigger the join, so in a re-org scenario we will only re-emit
          // once the tombstones have arrived and subsequent updates take their place

          if (left!!.getBlockHash() != right!!.getBlockHash()) {

            // We're in the middle of an update/fork so we publish a tombstone
            null
          } else {

            val gasPrices = left.getGasPrices()
            val gasUsage = right.getGasUsed()

            // use the latest timestamp
            val timestamp = if (left.timestamp <= right.timestamp) {
              right.timestamp
            } else {
              left.timestamp
            }

            TransactionFeeListRecord.newBuilder()
              .setBlockHash(left.getBlockHash())
              .setTimestamp(timestamp)
              .setTransactionFees(

                // prices and usages should be in the same transaction order so we just zip them

                gasPrices
                  .zip(gasUsage)
                  .map { (gasPrice, gasUsed) ->

                    val fee = gasPrice.getGasPriceBI() * gasUsed.getGasUsedBI()

                    TransactionFeeRecord.newBuilder()
                      .setBlockNumber(gasPrice.getBlockNumber())
                      .setBlockHash(gasPrice.getBlockHash())
                      .setTransactionHash(gasPrice.getTransactionHash())
                      .setTransactionPosition(gasPrice.getTransactionPosition())
                      .setAddress(gasPrice.getAddress())
                      .setTransactionFeeBI(fee)
                      .setTimestamp(timestamp)
                      .build()
                  }
              ).build()
          }
        },
        JoinWindows.of(Duration.ofDays(7)),
        Joined.with(Serdes.CanonicalKey(), Serdes.TransactionGasPriceList(), Serdes.TransactionGasUsedList())
      ).toTopic(CanonicalTransactionFees)

    // Flat map for insertion into db

    CanonicalTransactionFees.stream(builder)
      .flatMap { _, v ->

        val fees = v?.transactionFees ?: emptyList()

        fees.map { fee ->
          KeyValue(
            TransactionKeyRecord.newBuilder()
              .setTransactionHash(fee.transactionHash)
              .build(),
            fee
          )
        }

      }
      .toTopic(TransactionFee)

    return builder.build()
  }
}
