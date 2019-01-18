package io.enkrypt.kafka.streams.processors.block

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.BlockMetricsRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.isSuccess
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.models.BlockStatistic
import org.apache.kafka.streams.KeyValue
import java.math.BigInteger
import java.time.Instant
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit

object BlockMetrics {

  fun forBlock(block: BlockRecord): BlockMetricsRecord {

    val transactions = block.getTransactions()
    val receipts = block.getTransactionReceipts()

    val totalDifficulty = block.getTotalDifficulty().bigInteger()
    val numPendingTxs = block.getNumPendingTxs()
    val totalTxs = receipts.size

    var numSuccessfulTxs = 0
    var numFailedTxs = 0
    var totalInternalTxs = 0

    var totalGasPrice = BigInteger.ZERO
    var totalTxsFees = BigInteger.ZERO

    transactions
      .zip(receipts)
      .forEach { (tx, receipt) ->

        totalInternalTxs += receipt.getInternalTxs().size
        if (receipt.isSuccess()) numSuccessfulTxs += 1 else numFailedTxs += 1

        totalGasPrice = totalGasPrice.add(tx.getGasPrice().bigInteger())
        totalTxsFees = totalTxsFees.add(tx.getGasPrice().bigInteger())
      }

    var avgGasPrice = BigInteger.ZERO
    var avgTxsFees = BigInteger.ZERO

    if (totalTxs > 0) {
      avgGasPrice = totalGasPrice.divide(totalTxs.toBigInteger())
      avgTxsFees = totalTxsFees.divide(totalTxs.toBigInteger())
    }

    return BlockMetricsRecord.newBuilder()
      .setTotalTxs(totalTxs)
      .setNumSuccessfulTxs(numSuccessfulTxs)
      .setNumFailedTxs(numFailedTxs)
      .setNumPendingTxs(numPendingTxs)
      .setTotalDifficulty(totalDifficulty.unsignedByteBuffer())
      .setTotalGasPrice(totalGasPrice.unsignedByteBuffer())
      .setAvgGasPrice(avgGasPrice.unsignedByteBuffer())
      .setTotalTxFees(totalTxsFees.unsignedByteBuffer())
      .setAvgTxFees(avgTxsFees.unsignedByteBuffer())
      .build()
  }

  fun forAggregation(block: BlockRecord, metrics: BlockMetricsRecord): List<KeyValue<MetricKeyRecord, MetricRecord>> {

    val reverse = block.getReverse()

    val intMultiplier = if (reverse) {
      -1
    } else {
      1
    }

    val bigIntMultiplier = if (reverse) {
      BigInteger.ONE.negate()
    } else {
      BigInteger.ONE
    }

    val instant = Instant.ofEpochSecond(block.getHeader().getTimestamp())
    val dateTime = ZonedDateTime.ofInstant(instant, ZoneOffset.UTC)
    val startOfDayEpoch = dateTime.truncatedTo(ChronoUnit.DAYS).toInstant().epochSecond

    val keyBuilder = MetricKeyRecord
      .newBuilder()
      .setDate(startOfDayEpoch)

    val totalTxs = metrics.getTotalTxs()
    val numSuccessfulTxs = metrics.getNumSuccessfulTxs()
    val numFailedTxs = metrics.getNumFailedTxs()
    val numPendingTxs = metrics.getNumPendingTxs()
    val totalDifficulty = metrics.getTotalDifficulty().unsignedBigInteger()!!
    val totalGasPrice = metrics.getTotalGasPrice().unsignedBigInteger()!!
    val avgGasPrice = metrics.getAvgGasPrice().unsignedBigInteger()!!
    val totalTxFees = metrics.getTotalTxFees().unsignedBigInteger()!!
    val avgTxFees = metrics.getAvgTxFees().unsignedBigInteger()!!

    return listOf(
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalTxs.name).build(),
        MetricRecord.newBuilder().`setInt$`(totalTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.NumSuccessfulTxs.name).build(),
        MetricRecord.newBuilder().`setInt$`(numSuccessfulTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.NumFailedTxs.name).build(),
        MetricRecord.newBuilder().`setInt$`(numFailedTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.NumPendingTxs.name).build(),
        MetricRecord.newBuilder().`setInt$`(numPendingTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalDifficulty.name).build(),
        MetricRecord.newBuilder().setBigInteger(totalDifficulty.times(bigIntMultiplier).unsignedByteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalGasPrice.name).build(),
        MetricRecord.newBuilder().setBigInteger(totalGasPrice.times(bigIntMultiplier).unsignedByteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.AvgGasPrice.name).build(),
        MetricRecord.newBuilder().setBigInteger(avgGasPrice.times(bigIntMultiplier).unsignedByteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalTxsFees.name).build(),
        MetricRecord.newBuilder().setBigInteger(totalTxFees.times(bigIntMultiplier).unsignedByteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.AvgTxsFees.name).build(),
        MetricRecord.newBuilder().setBigInteger(avgTxFees.times(bigIntMultiplier).unsignedByteBuffer()).build()
      )
    )
  }
}
