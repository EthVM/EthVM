package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.avro.capture.TraceRewardActionRecord
import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import java.math.BigInteger

fun TokenTransferRecord.isFungible() = !(this.getFrom() == null || this.getTo() == null || this.getAmount() == null || this.getTokenId() != null)

fun TokenTransferRecord.isNonFungible() = !(this.getFrom() == null || this.getTo() == null || this.getTokenId() == null || this.getAmount() != null)

fun TokenBalanceKeyRecord.isFungible() = this.getAddress() != null

fun TokenBalanceKeyRecord.isNonFungible() = this.getTokenId() != null

val TokenTransferRecord.amountBI: BigInteger?
  get() = getAmount().unsignedBigInteger()

fun TokenTransferRecord.Builder.setAmount(amount: BigInteger) =
  this.setAmount(amount.unsignedByteBuffer())

fun TokenTransferRecord.Builder.setTokenId(tokenId: BigInteger) =
  this.setTokenId(tokenId.unsignedByteBuffer())

fun ExchangeRateRecord.isValid() = !(this.marketCap == -1.0 || this.marketCapRank == -1)

fun TraceListRecord.txSuccessful(): Boolean {

  val parentCalls = getTraces()
    .filter { t -> t.getType() != "reward" && t.getTraceAddress().isEmpty() }

  require(parentCalls.size == 1) { "Expected 1 parent call, found ${parentCalls.size}" }

  val error = parentCalls.first().getError()

  return error == null || error.isEmpty()
}

fun TraceListRecord.toTokenTransfers(): List<TokenTransferRecord> =
  when (this.txSuccessful()) {
    false -> emptyList()
    true -> getTraces()
      .map { trace -> trace.toTokenTransfers() }
      .flatten()
      .filter { trace -> trace.getAmount().unsignedBigInteger()!! > BigInteger.ZERO }

  }

fun TraceRecord.toTokenTransfers(): List<TokenTransferRecord> {

  val action = getAction()

  return when (action) {
    is TraceRewardActionRecord -> {

      val transferType = when (action.getRewardType()) {
        "block" -> BalanceType.BLOCK_REWARD
        "uncle" -> BalanceType.UNCLE_REWARD
        else -> throw IllegalArgumentException("Unexpected reward type: ${action.getRewardType()}")
      }

      listOf(
        TokenTransferRecord.newBuilder()
          .setTransferType(transferType)
          .setTo(action.getAuthor())
          .setAmount(action.getValue())
          .build(),
        TokenTransferRecord.newBuilder()
          .setTo(action.getAuthor())
          .setAmount(action.getValue())
          .build()
      )

    }
    is TraceCallActionRecord -> listOf(
      TokenTransferRecord.newBuilder()
        .setFrom(action.getFrom())
        .setTo(action.getTo())
        .setAmount(action.getValue())
        .build()
    )

    is TraceCreateActionRecord -> listOf(
      TokenTransferRecord.newBuilder()
        .setFrom(action.getFrom())
        .setTo(getResult().getAddress())
        .setAmount(action.getValue())
        .build()
    )

    is TraceDestroyActionRecord -> listOf(
      TokenTransferRecord.newBuilder()
        .setFrom(action.getAddress())
        .setTo(action.getRefundAddress())
        .setAmount(action.getBalance())
        .build()
    )

    else -> throw IllegalArgumentException("Unexpected action type: $action")
  }
}


object AvroHelpers {


}
