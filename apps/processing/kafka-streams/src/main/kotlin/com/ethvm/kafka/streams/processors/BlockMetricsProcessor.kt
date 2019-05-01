package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.processing.*
import com.ethvm.common.extensions.*
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.BlockMetricsHeader
import com.ethvm.kafka.streams.config.Topics.BlockMetricsTransaction
import com.ethvm.kafka.streams.config.Topics.BlockMetricsTransactionFee
import com.ethvm.kafka.streams.config.Topics.BlockMetricsTransactionTrace
import com.ethvm.kafka.streams.config.Topics.BlockTimestamp
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockHeader
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactionFees
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.JoinWindows
import org.apache.kafka.streams.kstream.Joined
import java.math.BigInteger
import java.time.Duration
import java.util.*

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

    canonicalBlock
      .mapValues { _, v ->
        BlockTimestampRecord.newBuilder()
          .setTimestamp(v.getTimestamp())
          .build()
      }.toTopic(BlockTimestamp)

    //

    canonicalBlock
      .mapValues { header ->
        BlockMetricsHeaderRecord.newBuilder()
          .setBlockHash(header.getHash())
          .setBlockTime(header.getBlockTime())
          .setNumUncles(header.getUncleHashes().size)
          .setDifficulty(header.getDifficulty())
          .setTotalDifficulty(header.getTotalDifficulty())
          .setTimestamp(header.getTimestamp())
          .build()
      }.toTopic(BlockMetricsHeader)

    val blockTimestamp = BlockTimestamp.stream(builder)

    CanonicalTraces.stream(builder)
      // genesis block has no traces
      .filter{ _, v -> v.getTraces().isNotEmpty()}
      .mapValues { traceList ->

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

              val action = trace.getAction()

              when (action) {
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

        // there is always a reward trace even if there is no transactions except for genesis block
        val blockHash = traces.first { it.blockHash != null }.blockHash

        BlockMetricsTransactionTraceRecord.newBuilder()
          .setBlockHash(blockHash)
          .setNumSuccessfulTxs(successful)
          .setNumFailedTxs(failed)
          .setTotalTxs(total)
          .setNumInternalTxs(internalTxs)
          .build()

      }
      .join(
        blockTimestamp,
        { left, right ->

          logger.info { "Join triggered: right = $right, left = $left" }

          BlockMetricsTransactionTraceRecord.newBuilder(left)
            .setTimestamp(right.getTimestamp())
            .build()
        },
        JoinWindows.of(Duration.ofHours(2)),
        Joined.with(Serdes.CanonicalKey(), Serdes.BlockMetricsTransactionTrace(), Serdes.BlockTimestamp())
      )
      .toTopic(BlockMetricsTransactionTrace)

    CanonicalTransactions.stream(builder)
      .mapValues { transactionsList ->

        val transactions = transactionsList.getTransactions()

        var totalGasPrice = BigInteger.ZERO
        var totalGasLimit = BigInteger.ZERO

        transactions.forEach { tx ->
          totalGasLimit += tx.getGasBI()
          totalGasPrice += tx.getGasPriceBI()
        }

        val txCount = transactions.size.toBigInteger()

        val (avgGasPrice, avgGasLimit) = when(txCount) {
          BigInteger.ZERO -> listOf(BigInteger.ZERO, BigInteger.ZERO)
          else -> listOf(
            totalGasPrice / txCount,
            totalGasLimit / txCount
          )
        }

        BlockMetricsTransactionRecord.newBuilder()
          .setBlockHash(transactionsList.getBlockHash())
          .setTotalGasPriceBI(totalGasPrice)
          .setAvgGasPriceBI(avgGasPrice)
          .setAvgGasLimitBI(avgGasLimit)
          .build()

      }
      .join(
        blockTimestamp,
        { left, right ->
          BlockMetricsTransactionRecord.newBuilder(left)
            .setTimestamp(right.getTimestamp())
            .build()
        },
        JoinWindows.of(Duration.ofHours(2)),
        Joined.with(Serdes.CanonicalKey(), Serdes.BlockMetricsTransaction(), Serdes.BlockTimestamp())
      )
      .toTopic(BlockMetricsTransaction)

//    CanonicalTransactionFees.stream(builder)
//      .mapValues { txFeeList ->
//
//        val transactionFees = txFeeList.getTransactionFees()
//        val count = transactionFees.size.toBigInteger()
//
//          val totalTxFees = transactionFees.fold(BigInteger.ZERO) { memo, next ->
//            memo + next.getTransactionFeeBI()
//          }
//
//          val avgTxFees = when(count) {
//            BigInteger.ZERO -> BigInteger.ZERO
//            else -> totalTxFees / count
//          }
//
//          val blockHash = txFeeList.getBlockHash()
//
//          BlockMetricsTransactionFeeRecord.newBuilder()
//            .setBlockHash(blockHash)
//            .setTotalTxFeesBI(totalTxFees)
//            .setAvgTxFeesBI(avgTxFees)
//            .build()
//
//      }
//      .filterNot { _, v -> v == null }
//      .join(
//        blockTimestamp,
//        { left, right ->
//          BlockMetricsTransactionFeeRecord.newBuilder(left)
//            .setTimestamp(right.getTimestamp())
//            .build()
//        },
//        JoinWindows.of(Duration.ofHours(2)),
//        Joined.with(Serdes.CanonicalKey(), Serdes.BlockMetricsTransactionFee(), Serdes.BlockTimestamp())
//      )
//      .toTopic(BlockMetricsTransactionFee)


    //


    return builder.build()
  }
}
