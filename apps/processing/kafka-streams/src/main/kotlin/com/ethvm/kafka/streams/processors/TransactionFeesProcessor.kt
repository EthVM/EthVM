package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.TransactionFeeListRecord
import com.ethvm.avro.processing.TransactionFeeRecord
import com.ethvm.avro.processing.TransactionGasPriceListRecord
import com.ethvm.avro.processing.TransactionGasPriceRecord
import com.ethvm.avro.processing.TransactionGasUsedListRecord
import com.ethvm.avro.processing.TransactionGasUsedRecord
import com.ethvm.common.extensions.getGasPriceBI
import com.ethvm.common.extensions.getGasUsedBI
import com.ethvm.common.extensions.setTransactionFeeBI
import com.ethvm.kafka.streams.config.Topics.CanonicalGasPrices
import com.ethvm.kafka.streams.config.Topics.CanonicalGasUsed
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactionFees
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.JoinWindows
import org.apache.kafka.streams.kstream.Joined
import org.joda.time.DateTime
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

    CanonicalTransactions.stream(builder)
      .mapValues { transactionsList ->

        if(transactionsList == null) {
          // pass through the tombstone
          null
        } else {

          val blockHash = transactionsList.getTransactions().firstOrNull()?.getBlockHash()

          when (transactionsList) {
            null -> null
            else ->
              TransactionGasPriceListRecord.newBuilder()
                .setBlockHash(blockHash)
                .setTimestamp(DateTime(transactionsList.getTimestamp()))
                .setGasPrices(
                  transactionsList.getTransactions()
                    .map { tx ->
                      TransactionGasPriceRecord.newBuilder()
                        .setBlockNumber(tx.getBlockNumber())
                        .setBlockHash(tx.getBlockHash())
                        .setTransactionHash(tx.getHash())
                        .setTransactionPosition(tx.getTransactionIndex())
                        .setAddress(tx.getFrom())
                        .setGasPrice(tx.getGasPrice())
                        .build()
                    }
                ).build()
          }

        }

      }.toTopic(CanonicalGasPrices)

    CanonicalReceipts.stream(builder)
      .mapValues { receiptsList ->

        if(receiptsList == null) {
          // pass through the tombstone
          null
        } else {
          val blockHash = receiptsList.getReceipts().firstOrNull()?.getBlockHash()

          when (receiptsList) {
            null -> null
            else ->
              TransactionGasUsedListRecord.newBuilder()
                .setTimestamp(DateTime(receiptsList.getTimestamp()))
                .setBlockHash(blockHash)
                .setGasUsed(
                  receiptsList.getReceipts()
                    .map { receipt ->
                      TransactionGasUsedRecord.newBuilder()
                        .setGasUsed(receipt.getGasUsed())
                        .build()
                    }
                ).build()
          }
        }

      }.toTopic(CanonicalGasUsed)

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
        JoinWindows.of(Duration.ofHours(2)),
        Joined.with(Serdes.CanonicalKey(), Serdes.TransactionGasPriceList(), Serdes.TransactionGasUsedList())
      ).toTopic(CanonicalTransactionFees)

    return builder.build()
  }
}
