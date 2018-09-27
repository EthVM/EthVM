package io.enkrypt.bolt.models

import org.bson.Document
import java.math.BigInteger

data class BlockStats(
  val blockTimeMs: Int = 0,
  val numSuccessfulTxs: Int = 0,
  val numFailedTxs: Int = 0,
  val totalTxs: Int = 0,
  val totalInternalTxs: Int = 0,
  val totalGasPrice: BigInteger = BigInteger.valueOf(0L),
  val avgGasPrice: BigInteger = BigInteger.valueOf(0L),
  val totalTxFees: BigInteger = BigInteger.valueOf(0L),
  val avgTxsFees: BigInteger = BigInteger.valueOf(0L)
) {

  fun toDocument(): Document = Document(
    mapOf(
      "blockTimeMs" to blockTimeMs,
      "numSuccessfulTxs" to numSuccessfulTxs,
      "numFailedTxs" to numFailedTxs,
      "totalTxs" to totalTxs,
      "totalInternalTxs" to totalInternalTxs,
      "totalGasPrice" to totalGasPrice.toByteArray(),
      "avgGasPrice" to avgGasPrice.toByteArray(),
      "totalTxsFees" to totalTxFees.toByteArray(),
      "avgTxsFees" to avgTxsFees.toByteArray()
    )
  )

}
