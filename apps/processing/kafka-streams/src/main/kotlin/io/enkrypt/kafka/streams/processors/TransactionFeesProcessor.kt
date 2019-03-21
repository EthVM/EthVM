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
import org.apache.kafka.streams.kstream.Materialized
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

        when (transactionsList) {
          null -> null
          else ->
            TransactionGasPriceListRecord.newBuilder()
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

        when (receiptsList) {
          null -> null
          else ->
            TransactionGasUsedListRecord.newBuilder()
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

    CanonicalGasPrices.table(builder)
      .join(
        CanonicalGasUsed.table(builder),
        { left, right ->

          val gasPrices = left.getGasPrices()
          val gasUsage = right.getGasUsed()

          // if the parity source publishes the required deletes first then any fork should mean this join is only triggered when both new values are available
          require(gasPrices.size == gasUsage.size)

          TransactionFeeListRecord.newBuilder()
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

        },
        Materialized.with(Serdes.CanonicalKey(), Serdes.TransactionFeeList())
      ).toStream()
      .toTopic(CanonicalTransactionFees)

    return builder.build()
  }
}
