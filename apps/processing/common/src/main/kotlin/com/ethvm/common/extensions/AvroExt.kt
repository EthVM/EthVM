package com.ethvm.common.extensions

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.ParitySyncStateRecord
import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.capture.TraceRecord
import com.ethvm.avro.capture.TraceResultRecord
import com.ethvm.avro.capture.TraceRewardActionRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleRecord
import java.math.BigInteger

// ------------------------------------------------------------
// ParitySyncStateRecord
// ------------------------------------------------------------

fun ParitySyncStateRecord.Builder.setHeadBI(head: BigInteger) = setHead(head.byteBuffer())

fun ParitySyncStateRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

// ------------------------------------------------------------
// CanonicalKeyRecord
// ------------------------------------------------------------

fun CanonicalKeyRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

// ------------------------------------------------------------
// TraceRecord
// ------------------------------------------------------------

fun TraceRecord.getBlockNumberBI() = getBlockNumber().bigInteger()

// ------------------------------------------------------------
// TraceCallActionRecord
// ------------------------------------------------------------

fun TraceCallActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TraceCallActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

// ------------------------------------------------------------
// TraceCreateActionRecord
// ------------------------------------------------------------

fun TraceCreateActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TraceCreateActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

// ------------------------------------------------------------
// TraceDestroyActionRecord
// ------------------------------------------------------------

fun TraceDestroyActionRecord.Builder.setBalanceBI(balance: BigInteger) = setBalance(balance.byteBuffer())

// ------------------------------------------------------------
// TraceResultRecord
// ------------------------------------------------------------

fun TraceResultRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

// ------------------------------------------------------------
// TraceRewardActionRecord
// ------------------------------------------------------------

fun TraceRewardActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

// ------------------------------------------------------------
// TraceRecord
// ------------------------------------------------------------

fun TraceRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TraceRecord.hasError(): Boolean {
  val error = getError()
  return error != null && error.isNotBlank()
}

// ------------------------------------------------------------
// TransactionReceiptRecord
// ------------------------------------------------------------

fun TransactionReceiptRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TransactionReceiptRecord.Builder.setCumulativeGasUsedBI(cumulativeGasUsed: BigInteger) = setCumulativeGasUsed(cumulativeGasUsed.byteBuffer())

fun TransactionReceiptRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

// ------------------------------------------------------------
// TransactionRecord
// ------------------------------------------------------------

fun TransactionRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TransactionRecord.Builder.setNonceBI(nonce: BigInteger) = setNonce(nonce.byteBuffer())

fun TransactionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TransactionRecord.Builder.setGasPriceBI(gasPrice: BigInteger) = setGasPrice(gasPrice.byteBuffer())

fun TransactionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

// ------------------------------------------------------------
// BlockHeaderRecord
// ------------------------------------------------------------

fun BlockHeaderRecord.getNumberBI() = getNumber().bigInteger()

fun BlockHeaderRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

fun BlockHeaderRecord.Builder.setNonceBI(nonce: BigInteger?) = setNonce(nonce?.byteBuffer())

fun BlockHeaderRecord.Builder.setGasLimitBI(gasLimit: BigInteger) = setGasLimit(gasLimit.byteBuffer())

fun BlockHeaderRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

fun BlockHeaderRecord.Builder.setDifficultyBI(difficulty: BigInteger) = setDifficulty(difficulty.byteBuffer())

fun BlockHeaderRecord.Builder.setTotalDifficultyBI(totalDifficulty: BigInteger) = setTotalDifficulty(totalDifficulty.byteBuffer())

// ------------------------------------------------------------
// UncleRecord
// ------------------------------------------------------------

fun UncleRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

fun UncleRecord.Builder.setHeightBI(number: BigInteger) = setHeight(number.byteBuffer())

fun UncleRecord.Builder.setNonceBI(nonce: BigInteger?) = setNonce(nonce?.byteBuffer())

fun UncleRecord.Builder.setGasLimitBI(gasLimit: BigInteger) = setGasLimit(gasLimit.byteBuffer())

fun UncleRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

fun UncleRecord.Builder.setDifficultyBI(difficulty: BigInteger) = setDifficulty(difficulty.byteBuffer())

fun UncleRecord.Builder.setTotalDifficultyBI(totalDifficulty: BigInteger) = setTotalDifficulty(totalDifficulty.byteBuffer())
