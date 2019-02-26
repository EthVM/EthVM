package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import java.math.BigInteger
import java.nio.ByteBuffer

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

fun TransactionReceiptRecord.isSuccessful(): Boolean {

  val parentCalls = getTraces()
    .filter { t -> t.getType() != "reward" && t.getTraceAddress().isEmpty() }

  require(parentCalls.size == 1) { "Expected 1 parent call, found ${parentCalls.size}" }

  val error = parentCalls.first().getError()

  return error == null || error.isEmpty()
}

object AvroHelpers {

  fun blockKey(number: BigInteger): BlockKeyRecord =
    blockKey(number.unsignedByteBuffer())

  fun blockKey(number: ByteBuffer?): BlockKeyRecord =
    BlockKeyRecord.newBuilder()
      .setNumber(number)
      .build()
}
