package com.ethvm.common.extensions

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.ContractEventCreatedRecord
import com.ethvm.avro.capture.ContractEventDestroyedRecord
import com.ethvm.avro.capture.ContractEventRecord
import com.ethvm.avro.capture.ContractEventType
import com.ethvm.avro.capture.ParitySyncStateRecord
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
import com.ethvm.avro.processing.BlockMetricsTransactionFeeRecord
import com.ethvm.avro.processing.BlockMetricsTransactionRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaType
import com.ethvm.avro.processing.FungibleBalanceRecord
import com.ethvm.avro.processing.FungibleTokenType
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.TransactionCountDeltaRecord
import com.ethvm.avro.processing.TransactionFeeListRecord
import com.ethvm.avro.processing.TransactionFeeRecord
import com.ethvm.avro.processing.TransactionGasPriceRecord
import com.ethvm.avro.processing.TransactionGasUsedRecord
import org.joda.time.DateTime
import java.math.BigInteger

fun ParitySyncStateRecord.Builder.setHeadBI(head: BigInteger) = setHead(head.byteBuffer())

fun ParitySyncStateRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

// ------------------------------------------------------------
// CanonicalKeyRecord
// ------------------------------------------------------------

fun CanonicalKeyRecord.getNumberBI() = getNumber().bigInteger()

fun CanonicalKeyRecord.Builder.setNumberBI(number: BigInteger) = setNumber(number.byteBuffer())

// ------------------------------------------------------------
// TransactionReceiptRecord
// ------------------------------------------------------------

fun UncleRecord.getHeightBI() = getHeight().bigInteger()

// ------------------------------------------------------------
// TransactionReceiptRecord
// ------------------------------------------------------------

fun TransactionReceiptRecord.getBlockNumberBI() = getBlockNumber().bigInteger()

// ------------------------------------------------------------
// TraceRecord
// ------------------------------------------------------------

fun TraceRecord.getBlockNumberBI() = getBlockNumber().bigInteger()

// ------------------------------------------------------------
// TraceCallActionRecord
// ------------------------------------------------------------

fun TraceCallActionRecord.getValueBI() = getValue().bigInteger()

fun TraceCallActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TraceCallActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

// ------------------------------------------------------------
// TraceCreateActionRecord
// ------------------------------------------------------------

fun TraceCreateActionRecord.getValueBI() = getValue().bigInteger()

fun TraceCreateActionRecord.Builder.setValueBI(value: BigInteger) = setValue(value.byteBuffer())

fun TraceCreateActionRecord.Builder.setGasBI(gas: BigInteger) = setGas(gas.byteBuffer())

// ------------------------------------------------------------
// TraceDestroyActionRecord
// ------------------------------------------------------------

fun TraceDestroyActionRecord.getBalanceBI() = getBalance().bigInteger()

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

fun TraceRecord.toContractEventRecord(timestamp: DateTime): ContractEventRecord? {

  // error check first
  val error = getError()
  if (!(error == null || error.isEmpty())) {
    return null
  }

  val action = getAction()

  return when (action) {

    is TraceCreateActionRecord ->

      ContractEventRecord.newBuilder()
        .setAddress(getResult().getAddress())
        .setType(ContractEventType.CREATE)
        .setEvent(
          ContractEventCreatedRecord.newBuilder()
            .setAddress(getResult().getAddress())
            .setCreator(action.getFrom())
            .setInit(action.getInit())
            .setCode(getResult().getCode())
            .setTraceLocation(
              TraceLocationRecord.newBuilder()
                .setBlockNumber(getBlockNumber())
                .setBlockHash(getBlockHash())
                .setTransactionHash(getTransactionHash())
                .setTraceAddress(getTraceAddress())
                .setTimestamp(timestamp)
                .build()
            ).build()
        ).build()

    is TraceDestroyActionRecord ->

      ContractEventRecord.newBuilder()
        .setAddress(action.getAddress())
        .setType(ContractEventType.DESTROY)
        .setEvent(
          ContractEventDestroyedRecord.newBuilder()
            .setAddress(action.getAddress())
            .setRefundAddress(action.getRefundAddress())
            .setRefundBalance(action.getBalance())
            .setTraceLocation(
              TraceLocationRecord.newBuilder()
                .setBlockNumber(getBlockNumber())
                .setBlockHash(getBlockHash())
                .setTransactionHash(getTransactionHash())
                .setTraceAddress(getTraceAddress())
                .setTimestamp(timestamp)
                .build()
            ).build()
        ).build()

    else -> throw IllegalArgumentException("Unexpected action type: $action")
  }
}

private val traceAddressComparator = TraceAddressComparator()

fun TraceRecord.toFungibleBalanceDeltas(timestamp: DateTime, traceListSummary: TraceListSummary): List<FungibleBalanceDeltaRecord> {

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
    .setTransactionIndex(getTransactionPosition())
    .setTraceAddress(getTraceAddress())
    .setTimestamp(timestamp)
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
          .setIsReceiving(true)
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

        val deltaType =
          if (traceAddress.isEmpty())
            FungibleBalanceDeltaType.TX
          else
            FungibleBalanceDeltaType.INTERNAL_TX

        var result = listOf(
          FungibleBalanceDeltaRecord.newBuilder()
            .setTokenType(FungibleTokenType.ETHER)
            .setDeltaType(deltaType)
            .setIsReceiving(false)
            .setTraceLocation(traceLocation)
            .setAddress(action.getFrom())
            .setCounterpartAddress(action.getTo())
            .setAmountBI(action.getValueBI().negate())
            .build()
        )

        // check if the recipient is a contract which has already been destroyed

        val destroyedContractTraceAddress = traceListSummary.destroyedContracts[action.getTo()]

        if (destroyedContractTraceAddress != null) {
          System.out.println("Trace address comparison. Trace address = $traceAddress, destroyedAddress = $destroyedContractTraceAddress, comparison = ${traceAddressComparator.compare(traceAddress, destroyedContractTraceAddress)}")
        }

        if (traceAddress.isEmpty() || destroyedContractTraceAddress == null || traceAddressComparator.compare(traceAddress, destroyedContractTraceAddress) < 0) {

          // we only generate the addition side of the transfer if the recipient has not been destroyed yet
          // e.g. our trace address is 'less' than the contract destruction trace address

          result = result + FungibleBalanceDeltaRecord.newBuilder()
            .setTokenType(FungibleTokenType.ETHER)
            .setDeltaType(deltaType)
            .setIsReceiving(true)
            .setTraceLocation(traceLocation)
            .setAddress(action.getTo())
            .setCounterpartAddress(action.getFrom())
            .setAmount(action.getValue())
            .build()
        }

        result
      }
    }

    is TraceCreateActionRecord -> listOf(

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.CONTRACT_CREATION)
        .setIsReceiving(false)
        .setTraceLocation(traceLocation)
        .setAddress(action.getFrom())
        .setCounterpartAddress(getResult().getAddress())
        .setAmountBI(action.getValueBI().negate())
        .build(),

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.CONTRACT_CREATION)
        .setIsReceiving(true)
        .setTraceLocation(traceLocation)
        .setAddress(getResult().getAddress())
        .setCounterpartAddress(action.getFrom())
        .setAmount(action.getValue())
        .build()
    )

    is TraceDestroyActionRecord -> listOf(

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.CONTRACT_DESTRUCTION)
        .setIsReceiving(false)
        .setTraceLocation(traceLocation)
        .setAddress(action.getAddress())
        .setCounterpartAddress(action.getRefundAddress())
        .setAmountBI(action.getBalanceBI().negate())
        .build(),

      FungibleBalanceDeltaRecord.newBuilder()
        .setTokenType(FungibleTokenType.ETHER)
        .setDeltaType(FungibleBalanceDeltaType.CONTRACT_DESTRUCTION)
        .setIsReceiving(true)
        .setTraceLocation(traceLocation)
        .setAddress(action.getRefundAddress())
        .setCounterpartAddress(action.getAddress())
        .setAmount(action.getBalance())
        .build()
    )

    else -> throw IllegalArgumentException("Unexpected action type: $action")
  }
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

fun TransactionRecord.getGasPriceBI() = getGasPrice().bigInteger()

fun TransactionRecord.getGasBI() = getGas().bigInteger()

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

// ------------------------------------------------------------
// TraceLocationRecord
// ------------------------------------------------------------

fun TraceLocationRecord.Builder.setBlockNumberBI(blockNumber: BigInteger) = setBlockNumber(blockNumber.byteBuffer())

fun TraceLocationRecord.getBlockNumberBI() = getBlockNumber().bigInteger()

// ------------------------------------------------------------
// FungibleBalanceDeltaRecord
// ------------------------------------------------------------

fun FungibleBalanceDeltaRecord.getAmountBI() = getAmount().bigInteger()

fun FungibleBalanceDeltaRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.byteBuffer())

// ------------------------------------------------------------
// FungibleBalanceRecord
// ------------------------------------------------------------

fun FungibleBalanceRecord.getAmountBI() = getAmount().bigInteger()

fun FungibleBalanceRecord.Builder.setAmountBI(amount: BigInteger) = setAmount(amount.byteBuffer())

fun FungibleBalanceDeltaRecord.reverse() =
  FungibleBalanceDeltaRecord.newBuilder(this)
    .setAmountBI(getAmountBI().negate())
    .build()

// ------------------------------------------------------------
// NonFungibleBalanceDeltaRecord
// ------------------------------------------------------------

fun NonFungibleBalanceDeltaRecord.Builder.setTokenIdBI(tokenId: BigInteger) = setTokenId(tokenId.byteBuffer())

fun NonFungibleBalanceDeltaRecord.reverse() =
  NonFungibleBalanceDeltaRecord.newBuilder(this)
    .setFrom(getTo())
    .setTo(getFrom())
    .build()

// ------------------------------------------------------------
// TransactionGasPriceRecord
// ------------------------------------------------------------

fun TransactionGasPriceRecord.getGasPriceBI() = getGasPrice().bigInteger()

fun TransactionGasUsedRecord.getGasUsedBI() = getGasUsed().bigInteger()

// ------------------------------------------------------------
// TransactionFeeRecord
// ------------------------------------------------------------

fun TransactionFeeRecord.getTransactionFeeBI() = getTransactionFee().bigInteger()

fun TransactionFeeRecord.Builder.setTransactionFeeBI(transactionFee: BigInteger) = setTransactionFee(transactionFee.byteBuffer())

fun TransactionFeeRecord.toFungibleBalanceDelta(): FungibleBalanceDeltaRecord =
  FungibleBalanceDeltaRecord.newBuilder()
    .setTokenType(FungibleTokenType.ETHER)
    .setDeltaType(FungibleBalanceDeltaType.TX_FEE)
    .setIsReceiving(true)
    .setTraceLocation(
      TraceLocationRecord.newBuilder()
        .setBlockHash(getBlockHash())
        .setBlockNumber(getBlockNumber())
        .setTransactionHash(getTransactionHash())
        .setTransactionIndex(getTransactionPosition())
        .setTimestamp(getTimestamp())
        .build()
    )
    .setAddress(getAddress())
    .setAmountBI(getTransactionFeeBI().negate())
    .build()

// ------------------------------------------------------------
// TransactionFeeListRecord
// ------------------------------------------------------------

fun TransactionFeeListRecord.toEtherBalanceDeltas(): List<FungibleBalanceDeltaRecord> =
  getTransactionFees().map { it.toFungibleBalanceDelta() }

// ------------------------------------------------------------
// BlockMetricsTransactionRecord
// ------------------------------------------------------------

fun BlockMetricsTransactionRecord.Builder.setTotalGasPriceBI(totalGasPrice: BigInteger) = setTotalGasPrice(totalGasPrice.byteBuffer())

fun BlockMetricsTransactionRecord.Builder.setAvgGasLimitBI(avgGasLimit: BigInteger) = setAvgGasLimit(avgGasLimit.byteBuffer())

fun BlockMetricsTransactionRecord.Builder.setAvgGasPriceBI(avgGasPrice: BigInteger) = setAvgGasPrice(avgGasPrice.byteBuffer())

// ------------------------------------------------------------
// BlockMetricsTransactionFeeRecord
// ------------------------------------------------------------

fun BlockMetricsTransactionFeeRecord.Builder.setTotalTxFeesBI(totalTxFees: BigInteger) = setTotalTxFees(totalTxFees.byteBuffer())

fun BlockMetricsTransactionFeeRecord.Builder.setAvgTxFeesBI(avgTxFees: BigInteger) = setAvgTxFees(avgTxFees.byteBuffer())

// ------------------------------------------------------------
// TraceListRecord
// ------------------------------------------------------------

fun TraceListRecord.toFungibleBalanceDeltas(): List<FungibleBalanceDeltaRecord> =
  getTraces()
    .asSequence()
    .groupBy { trace -> Pair(trace.getBlockHash(), trace.getTransactionHash()) }
    .toList()
    .map { (key, traces) ->

      var deltas = emptyList<FungibleBalanceDeltaRecord>()

      val timestamp = DateTime(getTimestamp())

      deltas = if (key.second == null) {

        // dealing with block and uncle rewards
        deltas + traces.map { it.toFungibleBalanceDeltas(timestamp, TraceListSummary()) }.flatten()
      } else {

        // all other traces

        val traceListSummary = traces.fold(TraceListSummary()) { info, trace ->

          when {
            trace.hasError() -> info.addError(trace.traceAddress)
            !trace.hasError() && trace.action is TraceDestroyActionRecord -> info.addDestroyedContact((trace.action as TraceDestroyActionRecord).address, trace.traceAddress)
            else -> info
          }
        }

        if (traceListSummary.errorTraceAddresses.isNotEmpty()) {
          System.out.println("Some errors")
        }

        deltas + traces
          .filterNot { it.hasError() }
          .filter { isTraceValid(it.traceAddress, traceListSummary.errorTraceAddresses) }
          .map { trace -> trace.toFungibleBalanceDeltas(timestamp, traceListSummary) }
          .flatten()
      }

      deltas
    }.flatten()
    .filter { delta -> delta.getAmount() != null }

class TraceAddressComparator : Comparator<List<Int>> {

  override fun compare(a: List<Int>?, b: List<Int>?): Int {

    return when {
      a == null && b != null -> -1
      a != null && b == null -> 1
      else -> {

        var idx = 0
        var result = 0

        do {
          result = when {

            idx < a!!.size && idx < b!!.size -> a[idx] - b[idx]
            idx < a.size && idx >= b!!.size -> 1
            idx < b!!.size && idx >= a.size -> -1
            else -> 0
          }

          idx += 1
        } while (result == 0 && (idx < a!!.size || idx < b!!.size))

        result
      }
    }
  }
}

data class TraceListSummary(
  val errorTraceAddresses: Set<List<Int>> = emptySet(),
  val destroyedContracts: Map<String, List<Int>> = emptyMap()
) {

  fun addError(traceAddress: List<Int>): TraceListSummary =
    TraceListSummary(errorTraceAddresses + setOf(traceAddress), destroyedContracts)

  fun addDestroyedContact(address: String, traceAddress: List<Int>) =
    TraceListSummary(errorTraceAddresses, destroyedContracts + (address to traceAddress))
}

fun isTraceValid(traceAddress: List<Int>, errorTraceAddresses: Set<List<Int>>, target: List<Int> = emptyList()): Boolean {

  if (traceAddress.size - target.size == 0) return true

  return if (!errorTraceAddresses.contains(target)) {
    isTraceValid(traceAddress, errorTraceAddresses, traceAddress.subList(0, target.size + 1))
  } else {
    false
  }
}

// ------------------------------------------------------------
// TransactionCountDeltaRecord
// ------------------------------------------------------------

fun TransactionCountDeltaRecord.reverse() =
  TransactionCountDeltaRecord.newBuilder()
    .setAddress(this.address)
    .setIn(this.`in` * -1)
    .setOut(this.out * -1)
    .build()
