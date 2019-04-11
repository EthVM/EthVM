package com.ethvm.common.extensions

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.ContractLifecycleRecord
import com.ethvm.avro.capture.ContractLifecyleType
import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TraceRecord
import com.ethvm.avro.capture.TraceResultRecord
import com.ethvm.avro.capture.TraceRewardActionRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.exchange.ExchangeRateRecord
import com.ethvm.avro.processing.BlockMetricsTransactionFeeRecord
import com.ethvm.avro.processing.BlockMetricsTransactionRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaType
import com.ethvm.avro.processing.FungibleBalanceRecord
import com.ethvm.avro.processing.FungibleTokenType
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.TransactionFeeListRecord
import com.ethvm.avro.processing.TransactionFeeRecord
import com.ethvm.avro.processing.TransactionGasPriceRecord
import com.ethvm.avro.processing.TransactionGasUsedRecord
import java.math.BigInteger

fun CanonicalKeyRecord.getNumberBI() = getNumber().bigInteger()

fun CanonicalKeyRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

fun TraceCallActionRecord.getValueBI() = getValue().bigInteger()

fun TraceCallActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TraceCallActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

fun TraceCreateActionRecord.getValueBI() = getValue().bigInteger()

fun TraceCreateActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TraceCreateActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

fun TraceDestroyActionRecord.getBalanceBI() = getBalance().bigInteger()

fun TraceDestroyActionRecord.Builder.setBalanceBI(balance: BigInteger) = setBalance(balance.byteBuffer())

fun TraceResultRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

fun TraceRewardActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TraceRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TransactionReceiptRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TransactionReceiptRecord.Builder.setCumulativeGasUsedBI(cumulativeGasUsed: BigInteger) = setCumulativeGasUsed(cumulativeGasUsed.byteBuffer())

fun TransactionReceiptRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

fun TransactionRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TransactionRecord.Builder.setNonceBI(nonce: BigInteger) = setNonce(nonce.byteBuffer())

fun TransactionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TransactionRecord.Builder.setGasPriceBI(gasPrice: BigInteger) = setGasPrice(gasPrice.byteBuffer())

fun TransactionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

fun TransactionRecord.getGasPriceBI() = getGasPrice().bigInteger()

fun TransactionRecord.getGasBI() = getGas().bigInteger()

fun BlockHeaderRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

fun BlockHeaderRecord.Builder.setNonceBI(nonce: BigInteger) = setNonce(nonce.byteBuffer())

fun BlockHeaderRecord.Builder.setGasLimitBI(gasLimit: BigInteger) = setGasLimit(gasLimit.byteBuffer())

fun BlockHeaderRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

fun BlockHeaderRecord.Builder.setDifficultyBI(difficulty: BigInteger) = setDifficulty(difficulty.byteBuffer())

fun BlockHeaderRecord.Builder.setTotalDifficultyBI(totalDifficulty: BigInteger) = setTotalDifficulty(totalDifficulty.byteBuffer())

fun UncleRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

fun UncleRecord.Builder.setHeightBI(number: BigInteger) = setHeight(number.byteBuffer())

fun UncleRecord.Builder.setNonceBI(nonce: BigInteger) = setNonce(nonce.byteBuffer())

fun UncleRecord.Builder.setGasLimitBI(gasLimit: BigInteger) = setGasLimit(gasLimit.byteBuffer())

fun UncleRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.byteBuffer())

fun UncleRecord.Builder.setDifficultyBI(difficulty: BigInteger) = setDifficulty(difficulty.byteBuffer())

fun UncleRecord.Builder.setTotalDifficultyBI(totalDifficulty: BigInteger) = setTotalDifficulty(totalDifficulty.byteBuffer())

fun TraceLocationRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TraceLocationRecord.getBlockNumberBI() = getBlockNumber().bigInteger()

fun FungibleBalanceDeltaRecord.getAmountBI() = getAmount().bigInteger()

fun FungibleBalanceDeltaRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.byteBuffer())

fun FungibleBalanceRecord.getAmountBI() = getAmount().bigInteger()

fun FungibleBalanceRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.byteBuffer())

fun NonFungibleBalanceDeltaRecord.Builder.setTokenIdBI(tokenId: BigInteger) = setTokenId(tokenId.byteBuffer())

fun TransactionGasPriceRecord.getGasPriceBI() = getGasPrice().bigInteger()

fun TransactionGasUsedRecord.getGasUsedBI() = getGasUsed().bigInteger()

fun TransactionFeeRecord.getTransactionFeeBI() = getTransactionFee().bigInteger()

fun TransactionFeeRecord.Builder.setTransactionFeeBI(transactionFee: BigInteger) = setTransactionFee(transactionFee.byteBuffer())

fun BlockMetricsTransactionRecord.Builder.setTotalGasPriceBI(totalGasPrice: BigInteger) = setTotalGasPrice(totalGasPrice.byteBuffer())

fun BlockMetricsTransactionRecord.Builder.setAvgGasLimitBI(avgGasLimit: BigInteger) = setAvgGasLimit(avgGasLimit.byteBuffer())

fun BlockMetricsTransactionRecord.Builder.setAvgGasPriceBI(avgGasPrice: BigInteger) = setAvgGasPrice(avgGasPrice.byteBuffer())

fun BlockMetricsTransactionFeeRecord.Builder.setTotalTxFeesBI(totalTxFees: BigInteger) = setTotalTxFees(totalTxFees.byteBuffer())

fun BlockMetricsTransactionFeeRecord.Builder.setAvgTxFeesBI(avgTxFees: BigInteger) = setAvgTxFees(avgTxFees.byteBuffer())

//

fun ExchangeRateRecord.isValid() = !(this.marketCap == -1.0 || this.marketCapRank == -1)

fun TransactionFeeListRecord.toEtherBalanceDeltas(): List<FungibleBalanceDeltaRecord> =
  getTransactionFees().map { it.toFungibleBalanceDelta() }

fun TransactionFeeRecord.toFungibleBalanceDelta(): FungibleBalanceDeltaRecord =
  FungibleBalanceDeltaRecord.newBuilder()
    .setTokenType(FungibleTokenType.ETHER)
    .setDeltaType(FungibleBalanceDeltaType.TX_FEE)
    .setTraceLocation(
      TraceLocationRecord.newBuilder()
        .setBlockHash(getBlockHash())
        .setBlockNumber(getBlockNumber())
        .setTransactionHash(getTransactionHash())
        .build()
    )
    .setAddress(getAddress())
    .setAmountBI(getTransactionFeeBI().negate())
    .build()

fun TraceRecord.hasError(): Boolean {
  val error = getError()
  return error != null && error.isNotBlank()
}

fun TraceListRecord.toFungibleBalanceDeltas(): List<FungibleBalanceDeltaRecord> =
  getTraces()
    .asSequence()
    .groupBy { trace -> Pair(trace.getBlockHash(), trace.getTransactionHash()) }
    .toList()
    .map { (key, traces) ->

      var deltas = emptyList<FungibleBalanceDeltaRecord>()

      if (key.second == null) {

        deltas = deltas + traces.map { it.toFungibleBalanceDeltas() }.flatten()
      } else {

        val rootTrace = traces.first { it.getTraceAddress().isEmpty() }

        deltas = deltas + when (rootTrace.hasError()) {
          true -> emptyList()
          false -> traces
            .map { trace -> trace.toFungibleBalanceDeltas() }
            .flatten()
        }
      }

      deltas
    }.flatten()
    .filter { delta -> delta.getAmount() != null && delta.getAmountBI() != BigInteger.ZERO }

fun FungibleBalanceDeltaRecord.reverse() =
  FungibleBalanceDeltaRecord.newBuilder(this)
    .setAmountBI(getAmountBI().negate())
    .build()

fun NonFungibleBalanceDeltaRecord.reverse() =
  NonFungibleBalanceDeltaRecord.newBuilder(this)
    .setFrom(getTo())
    .setTo(getFrom())
    .build()

fun TraceRecord.toContractLifecycleRecord(): ContractLifecycleRecord? {

  // error check first
  val error = getError()
  if (!(error == null || error.isEmpty())) {
    return null
  }

  val action = getAction()

  return when (action) {

    is TraceCreateActionRecord ->

      ContractLifecycleRecord.newBuilder()
        .setAddress(getResult().getAddress())
        .setType(ContractLifecyleType.CREATE)
        .setCreator(action.getFrom())
        .setInit(action.getInit())
        .setCode(getResult().getCode())
        .setCreatedAt(
          TraceLocationRecord.newBuilder()
            .setBlockNumber(getBlockNumber())
            .setBlockHash(getBlockHash())
            .setTransactionHash(getTransactionHash())
            .setTraceAddress(getTraceAddress())
            .build()
        ).build()

    is TraceDestroyActionRecord ->

      ContractLifecycleRecord.newBuilder()
        .setAddress(action.getAddress())
        .setType(ContractLifecyleType.DESTROY)
        .setRefundAddress(action.getRefundAddress())
        .setRefundBalance(action.getBalance())
        .setDestroyedAt(
          TraceLocationRecord.newBuilder()
            .setBlockNumber(getBlockNumber())
            .setBlockHash(getBlockHash())
            .setTransactionHash(getTransactionHash())
            .setTraceAddress(getTraceAddress())
            .build()
        ).build()

    else -> throw IllegalArgumentException("Unexpected action type: $action")
  }
}

fun TraceRecord.toFungibleBalanceDeltas(): List<FungibleBalanceDeltaRecord> {

  // error check first
  val error = getError()
  if (!(error == null || error.isEmpty())) {
    return emptyList()
  }

  val action = getAction()

  val traceLocation = TraceLocationRecord.newBuilder()
    .setBlockNumber(getBlockNumber())
    .setBlockHash(getBlockHash())
    .setTransactionHash(getTransactionHash())
    .setTraceAddress(getTraceAddress())
    .build()

  return when (action) {

    is TraceRewardActionRecord -> {

      val type = when (action.getRewardType()) {
        "uncle" -> FungibleBalanceDeltaType.UNCLE_REWARD
        "block" -> FungibleBalanceDeltaType.BLOCK_REWARD
        else -> throw IllegalArgumentException("Unexpected reward type: ${action.getRewardType()}")
      }

      listOf(
        FungibleBalanceDeltaRecord.newBuilder()
          .setTokenType(FungibleTokenType.ETHER)
          .setDeltaType(type)
          .setTraceLocation(traceLocation)
          .setAddress(action.getAuthor())
          .setAmount(action.getValue()) // need to make the value signed
          .build()
      )
    }

    is TraceCallActionRecord -> {

      if (action.callType == "delegatecall") {
        emptyList()
      } else {
        listOf(

          FungibleBalanceDeltaRecord.newBuilder()
            .setTokenType(FungibleTokenType.ETHER)
            .setDeltaType(FungibleBalanceDeltaType.TX)
            .setTraceLocation(traceLocation)
            .setAddress(action.getFrom())
            .setAmountBI(action.getValueBI().negate())
            .build(),

          FungibleBalanceDeltaRecord.newBuilder()
            .setTokenType(FungibleTokenType.ETHER)
            .setDeltaType(FungibleBalanceDeltaType.TX)
            .setTraceLocation(traceLocation)
            .setAddress(action.getTo())
            .setAmount(action.getValue())
            .build()

        )
      }
    }

    is TraceCreateActionRecord -> listOf(

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.TX)
        .setTraceLocation(traceLocation)
        .setAddress(action.getFrom())
        .setAmountBI(action.getValueBI().negate())
        .build(),

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.TX)
        .setTraceLocation(traceLocation)
        .setAddress(getResult().getAddress())
        .setAmount(action.getValue())
        .build()
    )

    is TraceDestroyActionRecord -> listOf(

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.CONTRACT_DESTRUCTION)
        .setTraceLocation(traceLocation)
        .setAddress(action.getAddress())
        .setAmountBI(action.getBalanceBI().negate())
        .build(),

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.CONTRACT_DESTRUCTION)
        .setTraceLocation(traceLocation)
        .setAddress(action.getRefundAddress())
        .setAmount(action.getBalance())
        .build()
    )

    else -> throw IllegalArgumentException("Unexpected action type: $action")
  }
}
