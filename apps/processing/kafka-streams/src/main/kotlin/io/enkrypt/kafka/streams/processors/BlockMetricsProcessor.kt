package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.processing.BlockMetricsRecord
import io.enkrypt.common.extensions.getBalanceBI
import io.enkrypt.common.extensions.getGasBI
import io.enkrypt.common.extensions.getGasPriceBI
import io.enkrypt.common.extensions.getValueBI
import io.enkrypt.common.extensions.setAvgGasLimitBI
import io.enkrypt.common.extensions.setAvgGasPriceBI
import io.enkrypt.common.extensions.setAvgTxFeesBI
import io.enkrypt.common.extensions.setTotalGasPriceBI
import io.enkrypt.common.extensions.setTotalTxFeesBI
import io.enkrypt.kafka.streams.config.Topics.BlockMetrics
import io.enkrypt.kafka.streams.config.Topics.CanonicalBlockHeader
import io.enkrypt.kafka.streams.config.Topics.CanonicalTraces
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactionFees
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactions
import io.enkrypt.kafka.streams.config.Topics.TraceBlockMetrics
import io.enkrypt.kafka.streams.config.Topics.TransactionBlockMetrics
import io.enkrypt.kafka.streams.config.Topics.TransactionFeeBlockMetrics
import io.enkrypt.kafka.streams.transformers.BlockTimeTransformer
import io.enkrypt.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.math.BigInteger
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

    CanonicalBlockHeader.stream(builder)
      .transform(
        TransformerSupplier { BlockTimeTransformer(appConfig.unitTesting) },
        *BlockTimeTransformer.STORE_NAMES
      )
      .mapValues { header ->
        BlockMetricsRecord.newBuilder()
          .setBlockTime(header.getBlockTime())
          .setNumUncles(header.getUncles().size)
          .setDifficulty(header.getDifficulty())
          .setTotalDifficulty(header.getTotalDifficulty())
          .setTimestamp(header.getTimestamp())
          .build()
      }.toTopic(BlockMetrics)

    CanonicalTraces.stream(builder)
      .mapValues { traceList ->

        var successful = 0
        var failed = 0
        var total = 0
        var internalTxs = 0

        traceList.getTraces()
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

        BlockMetricsRecord.newBuilder()
          .setNumSuccessfulTxs(successful)
          .setNumFailedTxs(failed)
          .setTotalTxs(total)
          .setNumInternalTxs(internalTxs)
          .build()
      }.toTopic(TraceBlockMetrics)

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

        val (avgGasPrice, avgGasLimit) =
          when (txCount) {
            BigInteger.ZERO -> listOf(BigInteger.ZERO, BigInteger.ZERO)
            else -> listOf(
              totalGasPrice / txCount,
              totalGasLimit / txCount
            )
          }

        BlockMetricsRecord.newBuilder()
          .setTotalGasPriceBI(totalGasPrice)
          .setAvgGasPriceBI(avgGasPrice)
          .setAvgGasLimitBI(avgGasLimit)
          .build()
      }.toTopic(TransactionBlockMetrics)

    CanonicalTransactionFees.stream(builder)
      .mapValues { txFeeList ->

        val transactionFees = txFeeList.getTransactionFees()

        val totalTxFees = transactionFees.fold(BigInteger.ZERO) { memo, next ->
          memo + next.getTransactionFee().toBigIntegerExact()
        }

        val count = transactionFees.size.toBigInteger()

        val avgTxFees = when (count) {
          BigInteger.ZERO -> BigInteger.ZERO
          else -> totalTxFees / count
        }

        BlockMetricsRecord.newBuilder()
          .setTotalTxFeesBI(totalTxFees)
          .setAvgTxFeesBI(avgTxFees)
          .build()
      }.toTopic(TransactionFeeBlockMetrics)

    return builder.build()
  }
}
