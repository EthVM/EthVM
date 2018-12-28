package io.enkrypt.util

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.unsignedBigInteger
import java.math.BigInteger

fun BlockRecord.txFees(): List<BigInteger> =
  getTransactions()
    .zip(getTransactionReceipts())
    .map { (tx, r) -> tx.getGasPrice().unsignedBigInteger()!! * r.getGasUsed().unsignedBigInteger()!! }

fun BlockRecord.totalTxFees(): BigInteger =
  txFees()
    .fold(0.toBigInteger()) { memo, next -> memo + next }
