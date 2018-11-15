package io.enkrypt.bolt.models

import io.enkrypt.avro.capture.BlockSummaryRecord
import io.enkrypt.bolt.extensions.isSuccess
import io.enkrypt.bolt.extensions.toBigInteger
import java.math.BigInteger

enum class BlockStatistic {

  TotalTxs,
  NumSuccessfulTxs,
  NumFailedTxs,
  NumPendingTxs,
  TotalDifficulty,
  TotalGasPrice,
  AvgGasPrice,
  TotalTxsFees,
  AvgTxsFees

}

data class BlockStatistics(val totalTxs: Int,
                           val numSuccessfulTxs: Int,
                           val numFailedTxs: Int,
                           val numPendingTxs: Int,
                           val totalDifficulty: BigInteger,
                           val totalGasPrice: BigInteger,
                           val avgGasPrice: BigInteger,
                           val totalTxsFees: BigInteger,
                           val avgTxsFees: BigInteger) {

  companion object {

    fun forBlockSummary(summary: BlockSummaryRecord): BlockStatistics {
      val block = summary.getBlock()

      val receipts = block.getTxReceipts()

      val totalDifficulty = summary.getTotalDifficulty().toBigInteger()
      val numPendingTxs = summary.getNumPendingTxs()
      val totalTxs = receipts.size

      var numSuccessfulTxs = 0
      var numFailedTxs = 0
      var totalInternalTxs = 0

      var totalGasPrice = BigInteger.ZERO
      var totalTxsFees = BigInteger.ZERO

      receipts.forEach { receipt ->

        totalInternalTxs += receipt.getInternalTxs().size
        if (receipt.isSuccess()) numSuccessfulTxs += 1 else numFailedTxs += 1

        totalGasPrice = totalGasPrice.add(receipt.getGasPrice().toBigInteger())
        totalTxsFees = totalTxsFees.add(receipt.getGasPrice().toBigInteger())

      }

      var avgGasPrice = BigInteger.ZERO
      var avgTxsFees = BigInteger.ZERO

      if(totalTxs > 0) {
        avgGasPrice = totalGasPrice.divide(totalTxs.toBigInteger())
        avgTxsFees = totalTxsFees.divide(totalTxs.toBigInteger())
      }

      return BlockStatistics(totalTxs, numSuccessfulTxs, numFailedTxs, numPendingTxs, totalDifficulty!!, totalGasPrice, avgGasPrice, totalTxsFees, avgTxsFees)
    }

  }


}
