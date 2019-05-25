package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.processing.BlockMetricKeyRecord
import com.ethvm.avro.processing.BlockMetricsHeaderRecord
import com.ethvm.avro.processing.BlockMetricsTransactionFeeRecord
import com.ethvm.avro.processing.BlockMetricsTransactionRecord
import com.ethvm.avro.processing.BlockMetricsTransactionTraceRecord
import com.ethvm.common.extensions.getBalanceBI
import com.ethvm.common.extensions.getGasBI
import com.ethvm.common.extensions.getGasPriceBI
import com.ethvm.common.extensions.getTransactionFeeBI
import com.ethvm.common.extensions.getValueBI
import com.ethvm.common.extensions.setAvgGasLimitBI
import com.ethvm.common.extensions.setAvgGasPriceBI
import com.ethvm.common.extensions.setAvgTxFeesBI
import com.ethvm.common.extensions.setTotalGasPriceBI
import com.ethvm.common.extensions.setTotalTxFeesBI
import com.ethvm.kafka.streams.config.Topics.BlockMetricsHeader
import com.ethvm.kafka.streams.config.Topics.BlockMetricsTransaction
import com.ethvm.kafka.streams.config.Topics.BlockMetricsTransactionFee
import com.ethvm.kafka.streams.config.Topics.BlockMetricsTransactionTrace
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockHeader
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactionFees
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.joda.time.DateTime
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

    val canonicalBlock = CanonicalBlockHeader.stream(builder)
      // we don't want to process tombstones
      .filterNot { _, v -> v == null }

    //

    canonicalBlock
      .map { _, header ->

        KeyValue(
          BlockMetricKeyRecord.newBuilder()
            .setBlockHash(header.getHash())
            .setTimestamp(DateTime(header.getTimestamp()))
            .build(),
          BlockMetricsHeaderRecord.newBuilder()
            .setNumber(header.getNumber())
            .setBlockTime(header.getBlockTime())
            .setNumUncles(header.getUncleHashes().size)
            .setDifficulty(header.getDifficulty())
            .setTotalDifficulty(header.getTotalDifficulty())
            .setTimestamp(DateTime(header.getTimestamp()))
            .build()
        )
      }.toTopic(BlockMetricsHeader)

    CanonicalTraces.stream(builder)
      // we don't want to process tombstones
      .filterNot { _, v -> v == null }
      // genesis block has no traces
      .filter { _, v -> v.getTraces().isNotEmpty() }
      .map { _, traceList ->

        var successful = 0
        var failed = 0
        var total = 0
        var internalTxs = 0

        val traces = traceList.getTraces()

        traces
          .filter { it.getTransactionHash() != null } // rewards have no tx hash, only a block hash
          .groupBy { it.getTransactionHash() }
          .forEach { (_, traces) ->

            traces.forEach { trace ->

              when (val action = trace.getAction()) {

                is TraceCallActionRecord -> {

                  if (trace.getTraceAddress().isEmpty()) {

                    // high level parent call is used to determine tx success
                    when (trace.getError()) {
                      null -> successful += 1
                      "" -> successful += 1
                      else -> failed += 1
                    }

                    total += 1
                  }

                  if (trace.getTraceAddress().isNotEmpty() && action.getValueBI() > BigInteger.ZERO) {
                    internalTxs += 1
                  }
                }

                is TraceCreateActionRecord -> {
                  if (action.getValueBI() > BigInteger.ZERO) {
                    internalTxs += 1
                  }
                }

                is TraceDestroyActionRecord -> {
                  if (action.getBalanceBI() > BigInteger.ZERO) {
                    internalTxs += 1
                  }
                }

                else -> {
                }
              }
            }
          }

        // there is always a reward trace even if there is no transactions, except for genesis block
        val blockHash = traces.first { it.blockHash != null }.blockHash

        KeyValue(
          BlockMetricKeyRecord.newBuilder()
            .setBlockHash(blockHash)
            .setTimestamp(DateTime(traceList.getTimestamp()))
            .build(),
          BlockMetricsTransactionTraceRecord.newBuilder()
            .setTimestamp(DateTime(traceList.getTimestamp()))
            .setNumSuccessfulTxs(successful)
            .setNumFailedTxs(failed)
            .setTotalTxs(total)
            .setNumInternalTxs(internalTxs)
            .build()
        )
      }
      .toTopic(BlockMetricsTransactionTrace)

    CanonicalTransactions.stream(builder)
      // we don't want to process tombstones
      .filterNot { _, v -> v == null }
      .map { _, transactionsList ->

        val transactions = transactionsList.getTransactions()

        var totalGasPrice = BigInteger.ZERO
        var totalGasLimit = BigInteger.ZERO

        transactions.forEach { tx ->
          totalGasLimit += tx.getGasBI()
          totalGasPrice += tx.getGasPriceBI()
        }

        val txCount = transactions.size.toBigInteger()

        val (avgGasPrice, avgGasLimit) = when (txCount) {
          BigInteger.ZERO -> listOf(BigInteger.ZERO, BigInteger.ZERO)
          else -> listOf(
            totalGasPrice / txCount,
            totalGasLimit / txCount
          )
        }

        KeyValue(
          BlockMetricKeyRecord.newBuilder()
            .setBlockHash(transactionsList.getBlockHash())
            .setTimestamp(DateTime(transactionsList.getTimestamp()))
            .build(),
          BlockMetricsTransactionRecord.newBuilder()
            .setTimestamp(DateTime(transactionsList.getTimestamp()))
            .setTotalGasPriceBI(totalGasPrice)
            .setAvgGasPriceBI(avgGasPrice)
            .setAvgGasLimitBI(avgGasLimit)
            .build()
        )
      }
      .toTopic(BlockMetricsTransaction)

    CanonicalTransactionFees.stream(builder)
      // we don't want to process tombstones or genesis block
      .filterNot { _, v -> v?.getBlockHash() == null }
      .map { _, txFeeList ->

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
      .toTopic(BlockMetricsTransactionFee)

    //

    return builder.build()
  }
}
