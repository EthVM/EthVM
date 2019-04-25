package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.processing.BlockMetricsHeaderRecord
import com.ethvm.avro.processing.BlockMetricsTransactionFeeRecord
import com.ethvm.avro.processing.BlockMetricsTransactionRecord
import com.ethvm.avro.processing.BlockMetricsTransactionTraceRecord
import com.ethvm.avro.processing.BlockTimestampRecord
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
import com.ethvm.kafka.streams.transformers.BlockTimeTransformer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.JoinWindows
import org.apache.kafka.streams.kstream.Joined
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.math.BigInteger
import java.time.Duration
import java.util.Properties

class BlockMetricsProcessor : AbstractKafkaProcessor() {

  override val id: String = "block-metrics-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder().apply {
      addStateStore(BlockTimeTransformer.blockTimesStore(appConfig.unitTesting))
    }

    val canonicalBlock = CanonicalBlockHeader.stream(builder)

    canonicalBlock
      .mapValues { _, v ->
        BlockTimestampRecord.newBuilder()
          .setTimestamp(v.getTimestamp())
          .build()
      }.toTopic(BlockTimestamp)

    //

    canonicalBlock.transform(
      TransformerSupplier { BlockTimeTransformer(appConfig.unitTesting) },
      *BlockTimeTransformer.STORE_NAMES
    )
      .mapValues { header ->
        BlockMetricsHeaderRecord.newBuilder()
          .setBlockNumber(header.getNumber())
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
      .mapValues { k, traceList ->

        var successful = 0
        var failed = 0
        var total = 0
        var internalTxs = 0

        val traces = traceList.getTraces()

        if (traces.isEmpty()) {
          null
        } else {
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

                    if (action.getValueBI() > BigInteger.ZERO) {
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

          val blockHash = traces.first().blockHash

          BlockMetricsTransactionTraceRecord.newBuilder()
            .setBlockNumber(k.getNumber())
            .setBlockHash(blockHash)
            .setNumSuccessfulTxs(successful)
            .setNumFailedTxs(failed)
            .setTotalTxs(total)
            .setNumInternalTxs(internalTxs)
            .build()
        }
      }
      .filterNot { _, v -> v == null }
      .join(
        blockTimestamp,
        { left, right ->
          BlockMetricsTransactionTraceRecord.newBuilder(left)
            .setTimestamp(right.getTimestamp())
            .build()
        },
        JoinWindows.of(Duration.ofHours(2)),
        Joined.with(Serdes.CanonicalKey(), Serdes.BlockMetricsTransactionTrace(), Serdes.BlockTimestamp())
      )
      .toTopic(BlockMetricsTransactionTrace)

    CanonicalTransactions.stream(builder)
      .mapValues { k, transactionsList ->

        val transactions = transactionsList.getTransactions()

        if (transactions.isEmpty()) {
          null
        } else {

          var totalGasPrice = BigInteger.ZERO
          var totalGasLimit = BigInteger.ZERO

          transactions.forEach { tx ->
            totalGasLimit += tx.getGasBI()
            totalGasPrice += tx.getGasPriceBI()
          }

          val txCount = transactions.size.toBigInteger()

          val (avgGasPrice, avgGasLimit) = listOf(
            totalGasPrice / txCount,
            totalGasLimit / txCount
          )

          val blockHash = transactionsList.getTransactions().first().blockHash

          BlockMetricsTransactionRecord.newBuilder()
            .setBlockNumber(k.getNumber())
            .setBlockHash(blockHash)
            .setTotalGasPriceBI(totalGasPrice)
            .setAvgGasPriceBI(avgGasPrice)
            .setAvgGasLimitBI(avgGasLimit)
            .build()
        }
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

    CanonicalTransactionFees.stream(builder)
      .mapValues { k, txFeeList ->

        val transactionFees = txFeeList.getTransactionFees()
        val count = transactionFees.size.toBigInteger()

        if (count == BigInteger.ZERO) {
          null
        } else {

          val totalTxFees = transactionFees.fold(BigInteger.ZERO) { memo, next ->
            memo + next.getTransactionFeeBI()
          }

          val avgTxFees = totalTxFees / count

          val blockHash = txFeeList.getBlockHash()

          BlockMetricsTransactionFeeRecord.newBuilder()
            .setBlockNumber(k.getNumber())
            .setBlockHash(blockHash)
            .setTotalTxFeesBI(totalTxFees)
            .setAvgTxFeesBI(avgTxFees)
            .build()
        }
      }
      .filterNot { _, v -> v == null }
      .join(
        blockTimestamp,
        { left, right ->
          BlockMetricsTransactionFeeRecord.newBuilder(left)
            .setTimestamp(right.getTimestamp())
            .build()
        },
        JoinWindows.of(Duration.ofHours(2)),
        Joined.with(Serdes.CanonicalKey(), Serdes.BlockMetricsTransactionFee(), Serdes.BlockTimestamp())
      )
      .toTopic(BlockMetricsTransactionFee)

    return builder.build()
  }
}
