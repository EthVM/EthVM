package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.avro.capture.TraceRewardActionRecord
import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaListRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaType
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.avro.processing.TransactionFeeListRecord
import io.enkrypt.avro.processing.TransactionFeeRecord
import java.math.BigInteger

fun TokenTransferRecord.isFungible() = !(this.getFrom() == null || this.getTo() == null || this.getAmount() == null || this.getTokenId() != null)

fun TokenTransferRecord.isNonFungible() = !(this.getFrom() == null || this.getTo() == null || this.getTokenId() == null || this.getAmount() != null)

fun TokenBalanceKeyRecord.isFungible() = this.getAddress() != null

fun TokenBalanceKeyRecord.isNonFungible() = this.getTokenId() != null

fun ExchangeRateRecord.isValid() = !(this.marketCap == -1.0 || this.marketCapRank == -1)

fun TransactionFeeListRecord.toEtherBalanceDeltas(): List<EtherBalanceDeltaRecord> =
  getTransactionFees().map { it.toEtherBalanceDelta() }

fun TransactionFeeRecord.toEtherBalanceDelta(): EtherBalanceDeltaRecord =
  EtherBalanceDeltaRecord.newBuilder()
    .setType(EtherBalanceDeltaType.TX_FEE)
    .setAddress(getAddress())
    .setAmount(getTransactionFee().toBigInteger().negate().toString())
    .build()

fun TraceRecord.hasError(): Boolean {
  val error = getError()
  return error != null && error.isNotBlank()
}

fun TraceListRecord.toEtherBalanceDeltas(): List<EtherBalanceDeltaRecord> =
  getTraces()
    .asSequence()
    .groupBy { trace -> Pair(trace.getBlockHash(), trace.getTransactionHash()) }
    .toList()
    .map { (key, traces) ->

      var deltas = emptyList<EtherBalanceDeltaRecord>()

      if (key.second == null) {

        deltas = deltas + traces.map { it.toEtherBalanceDeltas() }.flatten()

      } else {

        val rootTrace = traces.first { it.getTraceAddress().isEmpty() }

        deltas = deltas + when (rootTrace.hasError()) {
          true -> emptyList()
          false -> traces
            .map { trace -> trace.toEtherBalanceDeltas() }
            .flatten()
        }

      }

      deltas

    }.flatten()
    .filter { delta -> delta.getAmount() != null && !(delta.getAmount() == "" || delta.getAmount() == "0") }

fun EtherBalanceDeltaListRecord.reverse() =
  EtherBalanceDeltaListRecord.newBuilder()
    .setDeltas(getDeltas().map { it.reverse() })
    .build()

fun EtherBalanceDeltaRecord.reverse() =
  EtherBalanceDeltaRecord.newBuilder(this)
    .setAmount(getAmount().toBigInteger().negate().toString())
    .build()

fun TraceRecord.toEtherBalanceDeltas(): List<EtherBalanceDeltaRecord> {

  // error check first
  val error = getError()
  if (!(error == null || error.isEmpty())) {
    return emptyList()
  }

  val action = getAction()

  return when (action) {

    is TraceRewardActionRecord -> {

      val type = when (action.getRewardType()) {
        "uncle" -> EtherBalanceDeltaType.UNCLE_REWARD
        "block" -> EtherBalanceDeltaType.BLOCK_REWARD
        else -> throw IllegalArgumentException("Unexpected reward type: ${action.getRewardType()}")
      }

      listOf(
        EtherBalanceDeltaRecord.newBuilder()
          .setType(type)
          .setAddress(action.getAuthor())
          .setAmount(action.getValue()) // need to make the value signed
          .build()
      )
    }

    is TraceCallActionRecord -> listOf(

      EtherBalanceDeltaRecord.newBuilder()
        .setType(EtherBalanceDeltaType.TX)
        .setAddress(action.getFrom())
        .setAmount(action.getValue().toBigInteger().negate().toString())
        .build(),

      EtherBalanceDeltaRecord.newBuilder()
        .setType(EtherBalanceDeltaType.TX)
        .setAddress(action.getTo())
        .setAmount(action.getValue())
        .build()

    )

    is TraceCreateActionRecord -> listOf(

      EtherBalanceDeltaRecord.newBuilder()
        .setType(EtherBalanceDeltaType.TX)
        .setAddress(action.getFrom())
        .setAmount(action.getValue().toBigInteger().negate().toString())
        .build(),

      EtherBalanceDeltaRecord.newBuilder()
        .setType(EtherBalanceDeltaType.TX)
        .setAddress(getResult().getAddress())
        .setAmount(action.getValue())
        .build()
    )

    is TraceDestroyActionRecord -> listOf(

      EtherBalanceDeltaRecord.newBuilder()
        .setType(EtherBalanceDeltaType.CONTRACT_DESTRUCTION)
        .setAddress(action.getAddress())
        .setAmount(action.getBalance().toBigInteger().negate().toString())
        .build(),

      EtherBalanceDeltaRecord.newBuilder()
        .setType(EtherBalanceDeltaType.CONTRACT_DESTRUCTION)
        .setAddress(action.getRefundAddress())
        .setAmount(action.getBalance())
        .build()
    )

    else -> throw IllegalArgumentException("Unexpected action type: $action")
  }
}


object AvroHelpers {


}
