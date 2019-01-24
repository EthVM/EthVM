package io.enkrypt.kafka.streams.processors.block

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.BlockMetricsRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.isSuccess
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
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
    var totalGasLimit = BigInteger.ZERO

    transactions
      .zip(receipts)
      .forEach { (tx, receipt) ->

        totalInternalTxs += receipt.getInternalTxs().size
        if (receipt.isSuccess()) numSuccessfulTxs += 1 else numFailedTxs += 1

        totalGasLimit += tx.getGas().unsignedBigInteger()!!
        totalGasPrice += tx.getGasPrice().unsignedBigInteger()!!
        totalTxsFees += receipt.getGasUsed().unsignedBigInteger()!! * tx.getGasPrice().unsignedBigInteger()!!
      }

    var avgGasPrice = BigInteger.ZERO
    var avgTxsFees = BigInteger.ZERO
    var avgGasLimit = BigInteger.ZERO

    if (totalTxs > 0) {

      val totalTxsBigInt = totalTxs.toBigInteger()

      avgGasLimit = totalGasLimit / totalTxsBigInt
      avgGasPrice = totalGasPrice / totalTxsBigInt
      avgTxsFees = totalTxsFees / totalTxsBigInt
    }

    val blockRewards = block.getRewards()

    val avgMinerReward = when (blockRewards.size) {
      0 -> BigInteger.ZERO
      else -> blockRewards
        .map { it.getReward().unsignedBigInteger()!! }
        .fold(BigInteger.ZERO) { memo, next -> memo + next }
        .divide(block.getRewards().size.toBigInteger())
    }

    return BlockMetricsRecord.newBuilder()
      .setTotalTxs(totalTxs)
      .setNumUncles(block.getUncles().size)
      .setNumSuccessfulTxs(numSuccessfulTxs)
      .setNumFailedTxs(numFailedTxs)
      .setNumPendingTxs(numPendingTxs)
      .setAvgMinerReward(avgMinerReward.unsignedByteBuffer())
      .setTotalDifficulty(totalDifficulty.unsignedByteBuffer())
      .setTotalGasPrice(totalGasPrice.unsignedByteBuffer())
      .setAvgGasLimit(avgGasLimit.unsignedByteBuffer())
      .setAvgGasPrice(avgGasPrice.unsignedByteBuffer())
      .setTotalTxFees(totalTxsFees.unsignedByteBuffer())
      .setAvgTxFees(avgTxsFees.unsignedByteBuffer())
      .setBlockTime(block.getBlockTime())
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
    val startOfDayEpoch = dateTime.truncatedTo(ChronoUnit.DAYS).toInstant().toEpochMilli()

    val keyBuilder = MetricKeyRecord
      .newBuilder()
      .setDate(startOfDayEpoch)

    val numUncles = metrics.getNumUncles()
    val totalTxs = metrics.getTotalTxs()
    val numSuccessfulTxs = metrics.getNumSuccessfulTxs()
    val numFailedTxs = metrics.getNumFailedTxs()
    val numPendingTxs = metrics.getNumPendingTxs()
    val avgMinerReward = metrics.getAvgMinerReward().unsignedBigInteger()!!
    val totalDifficulty = metrics.getTotalDifficulty().unsignedBigInteger()!!
    val avgGasLimit = metrics.getAvgGasLimit().unsignedBigInteger()!!
    val avgGasPrice = metrics.getAvgGasPrice().unsignedBigInteger()!!
    val avgTxFees = metrics.getAvgTxFees().unsignedBigInteger()!!

    return listOf(
      KeyValue(
        keyBuilder.setName("AvgBlockTime").build(),
        MetricRecord.newBuilder().`setLong$`(block.getBlockTime() ?: 0L).build()
      ),
      KeyValue(
        keyBuilder.setName("AvgMinerRewardPerBlock").build(),
        MetricRecord.newBuilder().setBigInteger(avgMinerReward.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName("AvgUnclesPerBlock").build(),
        MetricRecord.newBuilder().`setFloat$`(numUncles.toFloat() * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName("TotalTxs").build(),
        MetricRecord.newBuilder().`setFloat$`(totalTxs.toFloat() * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName("TotalSuccessfulTxs").build(),
        MetricRecord.newBuilder().`setFloat$`(numSuccessfulTxs.toFloat() * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName("TotalFailedTxs").build(),
        MetricRecord.newBuilder().`setFloat$`(numFailedTxs.toFloat() * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName("AvgPendingTxs").build(),
        MetricRecord.newBuilder().`setFloat$`(numPendingTxs.toFloat() * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName("AvgTotalDifficulty").build(),
        MetricRecord.newBuilder().setBigInteger(totalDifficulty.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName("AvgGasPricePerBlock").build(),
        MetricRecord.newBuilder().setBigInteger(avgGasPrice.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName("AvgGasLimitPerBlock").build(),
        MetricRecord.newBuilder().setBigInteger(avgGasLimit.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName("AvgTxFeePerBlock").build(),
        MetricRecord.newBuilder().setBigInteger(avgTxFees.times(bigIntMultiplier).byteBuffer()).build()
      )
    )
  }
}
