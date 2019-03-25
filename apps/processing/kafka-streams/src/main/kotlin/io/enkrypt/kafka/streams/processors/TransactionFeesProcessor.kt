package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.processing.TransactionFeeListRecord
import io.enkrypt.avro.processing.TransactionFeeRecord
import io.enkrypt.avro.processing.TransactionGasPriceListRecord
import io.enkrypt.avro.processing.TransactionGasPriceRecord
import io.enkrypt.avro.processing.TransactionGasUsedListRecord
import io.enkrypt.avro.processing.TransactionGasUsedRecord
import io.enkrypt.common.extensions.getGasPriceBI
import io.enkrypt.common.extensions.getGasUsedBI
import io.enkrypt.common.extensions.setTransactionFeeBI
import io.enkrypt.kafka.streams.config.Topics.CanonicalGasPrices
import io.enkrypt.kafka.streams.config.Topics.CanonicalGasUsed
import io.enkrypt.kafka.streams.config.Topics.CanonicalReceipts
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactionFees
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactions
import io.enkrypt.kafka.streams.Serdes
import io.enkrypt.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.JoinWindows
import org.apache.kafka.streams.kstream.Joined
import org.apache.kafka.streams.kstream.Materialized
import java.time.Duration
import java.util.Properties

class TransactionFeesProcessor : AbstractKafkaProcessor() {

  override val id: String = "transaction-fees-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    CanonicalTransactions.stream(builder)
      .mapValues { transactionsList ->

        val blockHash = transactionsList.getTransactions().firstOrNull()?.getBlockHash()

        when (transactionsList) {
          null -> null
          else ->
            TransactionGasPriceListRecord.newBuilder()
              .setBlockHash(blockHash)
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
      }.toTopic(CanonicalGasPrices)

    CanonicalReceipts.stream(builder)
      .mapValues { receiptsList ->

        val blockHash = receiptsList.getReceipts().firstOrNull()?.getBlockHash()

        when (receiptsList) {
          null -> null
          else ->
            TransactionGasUsedListRecord.newBuilder()
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
      }.toTopic(CanonicalGasUsed)

    CanonicalGasPrices.stream(builder)
      .join(
        CanonicalGasUsed.stream(builder),
        { left, right ->

          if(left.getBlockHash() != right.getBlockHash()) {

            // We're in the middle of an update/fork so we publish a tombstone
            null

          } else {

            val gasPrices = left.getGasPrices()
            val gasUsage = right.getGasUsed()

            TransactionFeeListRecord.newBuilder()
              .setBlockHash(left.getBlockHash())
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
