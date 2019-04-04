package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.ContractLifecycleRecord
import io.enkrypt.avro.capture.ContractLifecyleType
import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.avro.capture.TraceResultRecord
import io.enkrypt.avro.capture.TraceRewardActionRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.common.TraceLocationRecord
import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.processing.BlockAuthorRecord
import io.enkrypt.avro.processing.BlockMetricsRecord
import io.enkrypt.avro.processing.FungibleBalanceDeltaRecord
import io.enkrypt.avro.processing.FungibleBalanceDeltaType
import io.enkrypt.avro.processing.FungibleBalanceRecord
import io.enkrypt.avro.processing.FungibleTokenType
import io.enkrypt.avro.processing.NonFungibleBalanceDeltaRecord
import io.enkrypt.avro.processing.TransactionFeeListRecord
import io.enkrypt.avro.processing.TransactionFeeRecord
import io.enkrypt.avro.processing.TransactionGasPriceRecord
import io.enkrypt.avro.processing.TransactionGasUsedRecord
import org.apache.avro.Conversions
import org.apache.avro.LogicalTypes
import java.math.BigDecimal
import java.math.BigInteger


fun CanonicalKeyRecord.getNumberBI() = getNumber().toBigIntegerExact()

fun CanonicalKeyRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.toBigDecimal())

fun TraceCallActionRecord.getValueBI() = getValue().toBigIntegerExact()

fun TraceCallActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toBigDecimal())

fun TraceCallActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.toBigDecimal())

fun TraceCreateActionRecord.getValueBI() = getValue().toBigIntegerExact()

fun TraceCreateActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toBigDecimal())

fun TraceCreateActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.toBigDecimal())

fun TraceDestroyActionRecord.getBalanceBI() = getBalance().toBigIntegerExact()

fun TraceDestroyActionRecord.Builder.setBalanceBI(balance: BigInteger) = setBalance(balance.toBigDecimal())

fun TraceResultRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.toBigDecimal())

fun TraceRewardActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toBigDecimal())

fun TraceRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toBigDecimal())

fun TransactionReceiptRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toBigDecimal())

fun TransactionReceiptRecord.Builder.setCumulativeGasUsedBI(cumulativeGasUsed: BigInteger) = setCumulativeGasUsed(cumulativeGasUsed.toBigDecimal())

fun TransactionReceiptRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.toBigDecimal())

fun TransactionRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toBigDecimal())

fun TransactionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toBigDecimal())

fun TransactionRecord.getGasPriceBI() = getGasPrice().toBigIntegerExact()

fun TransactionRecord.Builder.setGasPriceBI(gasPrice: BigInteger) = setGasPrice(gasPrice.toBigDecimal())

fun TransactionRecord.getGasBI() = getGas().toBigIntegerExact()

fun TransactionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.toBigDecimal())

fun BlockHeaderRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.toBigDecimal())

fun BlockHeaderRecord.Builder.setGasLimitBI(gasLimit: BigInteger) = setGasLimit(gasLimit.toBigDecimal())

fun BlockHeaderRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.toBigDecimal())

fun BlockHeaderRecord.Builder.setDifficultyBI(difficulty: BigInteger) = setDifficulty(difficulty.toBigDecimal())

fun BlockHeaderRecord.Builder.setTotalDifficultyBI(totalDifficulty: BigInteger) = setTotalDifficulty(totalDifficulty.toBigDecimal())

fun TraceLocationRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toBigDecimal())

fun TraceLocationRecord.getBlockNumberBI() = getBlockNumber().toBigIntegerExact()

fun FungibleBalanceDeltaRecord.getAmountBI() = getAmount().toBigIntegerExact()

fun FungibleBalanceDeltaRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.toBigDecimal())

fun FungibleBalanceRecord.getAmountBI() = getAmount().toBigIntegerExact()

fun FungibleBalanceRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.toBigDecimal())

fun NonFungibleBalanceDeltaRecord.Builder.setTokenIdBI(tokenId: BigInteger) = setTokenId(tokenId.toBigDecimal())

fun TransactionGasPriceRecord.getGasPriceBI() = getGasPrice().toBigIntegerExact()

fun TransactionGasUsedRecord.getGasUsedBI() = getGasUsed().toBigIntegerExact()

fun TransactionFeeRecord.Builder.setTransactionFeeBI(blockNumber: BigInteger) = setTransactionFee(blockNumber.toBigDecimal())


fun BlockMetricsRecord.Builder.setTotalGasPriceBI(totalGasPrice: BigInteger) = setTotalGasPrice(totalGasPrice.toBigDecimal())

fun BlockMetricsRecord.Builder.setAvgGasLimitBI(avgGasLimit: BigInteger) = setAvgGasLimit(avgGasLimit.toBigDecimal())

fun BlockMetricsRecord.Builder.setAvgGasPriceBI(avgGasPrice: BigInteger) = setAvgGasPrice(avgGasPrice.toBigDecimal())

fun BlockMetricsRecord.Builder.setTotalTxFeesBI(totalTxFees: BigInteger) = setTotalTxFees(totalTxFees.toBigDecimal())

fun BlockMetricsRecord.Builder.setAvgTxFeesBI(avgTxFees: BigInteger) = setAvgTxFees(avgTxFees.toBigDecimal())

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
    .setAmountBI(getTransactionFee().toBigIntegerExact().negate())
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
    .filter { delta -> delta.getAmount() != null && delta.getAmount() != BigDecimal.ZERO }

fun FungibleBalanceDeltaRecord.reverse() =
  FungibleBalanceDeltaRecord.newBuilder(this)
    .setAmountBI(getAmountBI().negate())
    .build()

fun NonFungibleBalanceDeltaRecord.reverse() =
  NonFungibleBalanceDeltaRecord.newBuilder(this)
    .setFrom(getTo())
    .setTo(getFrom())
    .build()

fun TraceRecord
  .toContractLifecycleRecord(): ContractLifecycleRecord? {

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

    is TraceCallActionRecord -> listOf(

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
