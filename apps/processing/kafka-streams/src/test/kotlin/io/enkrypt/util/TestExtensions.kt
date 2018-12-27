package io.enkrypt.util

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.unsignedBigInteger
import java.math.BigInteger

fun BlockRecord.txFees(): List<BigInteger> =
  this.getTransactions().zip(this.getTransactionReceipts())
    .map { (tx, r) -> tx.getGasPrice().unsignedBigInteger()!! * r.getGasUsed().unsignedBigInteger()!! }

fun BlockRecord.totalTxFees(): BigInteger = this.txFees()
  .reduce { memo, next -> memo + next }
