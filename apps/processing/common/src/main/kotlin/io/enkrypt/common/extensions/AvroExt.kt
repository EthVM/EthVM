package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.processing.FungibleTokenTransferRecord
import io.enkrypt.avro.processing.NonFungibleTokenTransferRecord
import org.ethereum.util.ByteUtil
import java.math.BigInteger
import java.nio.ByteBuffer

fun FungibleTokenTransferRecord.reverse(): FungibleTokenTransferRecord =
  FungibleTokenTransferRecord.newBuilder(this)
    .setAmount(this.amountBI!!.negate())
    .build()

val FungibleTokenTransferRecord.amountBI: BigInteger?
  get() = getAmount().bigInteger()

fun FungibleTokenTransferRecord.Builder.setAmount(amount: BigInteger): FungibleTokenTransferRecord.Builder =
  this.setAmount(ByteBuffer.wrap(ByteUtil.bigIntegerToBytes(amount)))

fun NonFungibleTokenTransferRecord.Builder.setTokenId(tokenId: BigInteger): NonFungibleTokenTransferRecord.Builder =
  this.setTokenId(ByteBuffer.wrap(ByteUtil.bigIntegerToBytes(tokenId)))



fun TransactionReceiptRecord.isSuccess(): Boolean {
  val status = this.getStatus().byteArray()
  return status != null && status.size == 1 && status[0].toInt() == 1
}
