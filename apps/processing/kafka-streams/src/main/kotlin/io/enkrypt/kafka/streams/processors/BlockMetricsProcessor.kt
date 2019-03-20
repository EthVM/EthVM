package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.processing.BlockMetricsRecord
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.config.Topics.BlockMetrics
import io.enkrypt.kafka.streams.config.Topics.CanonicalBlocks
import io.enkrypt.kafka.streams.config.Topics.CanonicalTraces
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactions
import io.enkrypt.kafka.streams.config.Topics.TraceBlockMetrics
import io.enkrypt.kafka.streams.config.Topics.TransactionBlockMetrics
import io.enkrypt.kafka.streams.config.Topics.TransactionFeeBlockMetrics
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

    CanonicalBlocks.stream(builder)
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

                  if (action.getValue() != null && action.getValue() != "0") {
                    internalTxs += 1
                  }
                }
                is TraceCreateActionRecord -> {
                  if (action.getValue() != null && action.getValue() != "0") {
                    internalTxs += 1
                  }
                }
                is TraceDestroyActionRecord -> {
                  if (action.getBalance() != null && action.getBalance() != "0") {
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
          totalGasLimit += tx.getGas().toBigInteger()
          totalGasPrice += tx.getGasPrice().toBigInteger()
        }

        val txCount = transactions.size.toBigInteger()

        val avgGasPrice = totalGasPrice / txCount
        val avgGasLimit = totalGasLimit / txCount

        BlockMetricsRecord.newBuilder()
          .setTotalGasPrice(totalGasPrice.toString())
          .setAvgGasPrice(avgGasPrice.toString())
          .setAvgGasLimit(avgGasLimit.toString())
          .build()
      }.toTopic(TransactionBlockMetrics)

    Topics.CanonicalTransactionFees.stream(builder)
      .mapValues { txFeeList ->

        val transactionFees = txFeeList.getTransactionFees()

        val totalTxFees = transactionFees.fold(BigInteger.ZERO) { memo, next ->
          memo + next.getTransactionFee().toBigInteger()
        }

        val avgTxFees = totalTxFees / transactionFees.size.toBigInteger()

        BlockMetricsRecord.newBuilder()
          .setTotalTxFees(totalTxFees.toString())
          .setAvgTxFees(avgTxFees.toString())
          .build()
      }.toTopic(TransactionFeeBlockMetrics)

    return builder.build()
  }
}
