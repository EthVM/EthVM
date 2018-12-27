package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import java.math.BigInteger

fun TokenTransferRecord.isFungible() = !(this.getFrom() == null || this.getTo() == null || this.getAmount() == null)

fun TokenTransferRecord.isNonFungible() = !(this.getFrom() == null || this.getTo() == null || this.getTokenId() == null)

fun TokenBalanceKeyRecord.isFungible() = this.getAddress() != null

fun TokenBalanceKeyRecord.isNonFungible() = this.getTokenId() != null

val TokenTransferRecord.amountBI: BigInteger?
  get() = getAmount().unsignedBigInteger()

fun TokenTransferRecord.Builder.setAmount(amount: BigInteger) =
  this.setAmount(amount.unsignedByteBuffer())

fun TokenTransferRecord.Builder.setTokenId(tokenId: BigInteger) =
  this.setTokenId(tokenId.unsignedByteBuffer())

fun TransactionReceiptRecord.isSuccess(): Boolean {
  val status = this.getStatus().byteArray()
  return status != null && status.size == 1 && status[0].toInt() == 1
}
