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
import java.math.BigInteger

// BigInteger to hex helpers

fun CanonicalKeyRecord.getNumberBI() = getNumber().hexToBI()

fun CanonicalKeyRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.toHex())

fun TraceCallActionRecord.getValueBI() = getValue().hexToBI()

fun TraceCallActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toHex())

fun TraceCallActionRecord.getGasBI() = getGas().hexToBI()

fun TraceCallActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.toHex())

fun TraceCreateActionRecord.getValueBI() = getValue().hexToBI()

fun TraceCreateActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toHex())

fun TraceCreateActionRecord.getGasBI() = getGas().hexToBI()

fun TraceCreateActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.toHex())

fun TraceDestroyActionRecord.getBalanceBI() = getBalance().hexToBI()

fun TraceDestroyActionRecord.Builder.setBalanceBI(balance: BigInteger) = setBalance(balance.toHex())

fun TraceResultRecord.getGasUsedBI() = getGasUsed().hexToBI()

fun TraceResultRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.toHex())

fun TraceRewardActionRecord.getValueBI() = getValue().hexToBI()

fun TraceRewardActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toHex())

fun TraceRecord.getBlockNumberBI() = getBlockNumber().hexToBI()

fun TraceRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toHex())

fun TransactionReceiptRecord.getBlockNumberBI() = getBlockNumber().hexToBI()

fun TransactionReceiptRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toHex())

fun TransactionReceiptRecord.getCumulativeGasUsedBI() = getCumulativeGasUsed().hexToBI()

fun TransactionReceiptRecord.Builder.setCumulativeGasUsedBI(cumulativeGasUsed: BigInteger) = setCumulativeGasUsed(cumulativeGasUsed.toHex())

fun TransactionReceiptRecord.getGasUsedBI() = getGasUsed().hexToBI()

fun TransactionReceiptRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.toHex())

fun TransactionRecord.getBlockNumberBI() = getBlockNumber().hexToBI()

fun TransactionRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toHex())

fun TransactionRecord.getValueBI() = getValue().hexToBI()

fun TransactionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.toHex())

fun TransactionRecord.getGasPriceBI() = getGasPrice().hexToBI()

fun TransactionRecord.Builder.setGasPriceBI(gasPrice: BigInteger) = setGasPrice(gasPrice.toHex())

fun TransactionRecord.getGasBI() = getGas().hexToBI()

fun TransactionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.toHex())

fun BlockHeaderRecord.getNumberBI() = getNumber().hexToBI()

fun BlockHeaderRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.toHex())

fun BlockHeaderRecord.getGasLimitBI() = getGasLimit().hexToBI()

fun BlockHeaderRecord.Builder.setGasLimitBI(gasLimit: BigInteger) = setGasLimit(gasLimit.toHex())

fun BlockHeaderRecord.getGasUsedBI() = getGasUsed().hexToBI()

fun BlockHeaderRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.toHex())

fun BlockHeaderRecord.getDifficultyBI() = getDifficulty().hexToBI()

fun BlockHeaderRecord.Builder.setDifficultyBI(difficulty: BigInteger) = setDifficulty(difficulty.toHex())

fun BlockHeaderRecord.getNephewNumberBI() = getNephewNumber().hexToBI()

fun BlockHeaderRecord.Builder.setNephewNumberBI(newphewNumber: BigInteger) = setNephewNumber(newphewNumber.toHex())

fun BlockHeaderRecord.getUncleRewardBI() = getUncleReward().hexToBI()

fun BlockHeaderRecord.Builder.setUncleRewardBI(uncleReward: BigInteger) = setUncleReward(uncleReward.toHex())

fun BlockHeaderRecord.getTotalDifficultyBI() = getTotalDifficulty().hexToBI()

fun BlockHeaderRecord.Builder.setTotalDifficultyBI(totalDifficulty: BigInteger) = setTotalDifficulty(totalDifficulty.toHex())

fun TraceLocationRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toHex())

fun TraceLocationRecord.getBlockNumberBI() = getBlockNumber().hexToBI()

fun FungibleBalanceDeltaRecord.getAmountBI() = getAmount().hexToBI()

fun FungibleBalanceDeltaRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.toHex())

fun FungibleBalanceRecord.getAmountBI() = getAmount().hexToBI()

fun FungibleBalanceRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.toHex())

fun NonFungibleBalanceDeltaRecord.getTokenIdBI() = getTokenId().hexToBI()

fun NonFungibleBalanceDeltaRecord.Builder.setTokenIdBI(tokenId: BigInteger) = setTokenId(tokenId.toHex())

fun BlockAuthorRecord.getBlockNumberBI() = getBlockNumber().hexToBI()

fun BlockAuthorRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toHex())

fun TransactionGasPriceRecord.getBlockNumberBI() = getBlockNumber().hexToBI()

fun TransactionGasPriceRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toHex())

fun TransactionGasPriceRecord.getGasPriceBI() = getGasPrice().hexToBI()

fun TransactionGasPriceRecord.Builder.setGasPriceBI(gasPrice: BigInteger) = setGasPrice(gasPrice.toHex())

fun TransactionGasUsedRecord.getGasUsedBI() = getGasUsed().hexToBI()

fun TransactionGasUsedRecord.Builder.setGasUsedBI(gasUsed: BigInteger) = setGasUsed(gasUsed.toHex())

fun TransactionFeeRecord.getBlockNumberBI() = getBlockNumber().hexToBI()

fun TransactionFeeRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.toHex())

fun TransactionFeeRecord.getTransactionFeeBI() = getTransactionFee().hexToBI()

fun TransactionFeeRecord.Builder.setTransactionFeeBI(blockNumber: BigInteger) = setTransactionFee(blockNumber.toHex())

fun BlockMetricsRecord.getDifficultyBI() = getDifficulty().hexToBI()

fun BlockMetricsRecord.Builder.setDifficultyBI(difficulty: BigInteger) = setDifficulty(difficulty.toHex())

fun BlockMetricsRecord.getTotalDifficultyBI() = getTotalDifficulty().hexToBI()

fun BlockMetricsRecord.Builder.setTotalDifficultyBI(totalDifficulty: BigInteger) = setTotalDifficulty(totalDifficulty.toHex())

fun BlockMetricsRecord.getTotalGasPriceBI() = getTotalGasPrice().hexToBI()

fun BlockMetricsRecord.Builder.setTotalGasPriceBI(totalGasPrice: BigInteger) = setTotalGasPrice(totalGasPrice.toHex())

fun BlockMetricsRecord.getAvgGasLimitBI() = getAvgGasLimit().hexToBI()

fun BlockMetricsRecord.Builder.setAvgGasLimitBI(avgGasLimit: BigInteger) = setAvgGasLimit(avgGasLimit.toHex())

fun BlockMetricsRecord.getAvgGasPriceBI() = getAvgGasPrice().hexToBI()

fun BlockMetricsRecord.Builder.setAvgGasPriceBI(avgGasPrice: BigInteger) = setAvgGasPrice(avgGasPrice.toHex())

fun BlockMetricsRecord.getTotalTxFeesBI() = getTotalTxFees().hexToBI()

fun BlockMetricsRecord.Builder.setTotalTxFeesBI(totalTxFees: BigInteger) = setTotalTxFees(totalTxFees.toHex())

fun BlockMetricsRecord.getAvgTxFeesBI() = getAvgTxFees().hexToBI()

fun BlockMetricsRecord.Builder.setAvgTxFeesBI(avgTxFees: BigInteger) = setAvgTxFees(avgTxFees.toHex())


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
    .filter { delta -> delta.getAmount() != null && !(delta.getAmount() == "" || delta.getAmount() == "0") }

fun FungibleBalanceDeltaRecord.reverse() =
  FungibleBalanceDeltaRecord.newBuilder(this)
    .setAmount(getAmount().toBigInteger().negate().toString())
    .build()

fun NonFungibleBalanceDeltaRecord.reverse() =
  NonFungibleBalanceDeltaRecord.newBuilder(this)
    .setFrom(getTo())
    .setTo(getFrom())
    .build()

fun TraceRecord.
  toContractLifecycleRecord(): ContractLifecycleRecord? {

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
