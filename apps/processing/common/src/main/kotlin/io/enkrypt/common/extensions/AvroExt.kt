package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.common.ContractType
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
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

fun TransactionReceiptRecord.isSuccess(): Boolean {
  val status = this.getStatus().byteArray()
  return status != null && status.size == 1 && status[0].toInt() == 1
}

fun BlockRecord.txFees(): List<BigInteger> =
  this.getTransactions().zip(this.getTransactionReceipts())
    .map { (tx, r) -> tx.getGasPrice().unsignedBigInteger()!! * r.getGasUsed().unsignedBigInteger()!! }

fun BlockRecord.totalTxFees(): BigInteger = this.txFees()
  .fold(0.toBigInteger()) { memo, next -> memo + next }

fun BlockRecord.keyRecord(): BlockKeyRecord =
  BlockKeyRecord.newBuilder()
    .setNumber(getHeader().getNumber())
    .build()

fun TransactionRecord.txFee(receipt: TransactionReceiptRecord): BigInteger =
  getGasPrice().unsignedBigInteger()!! * receipt.getGasUsed().unsignedBigInteger()!!

object AvroHelpers {

  fun blockKey(number: Long) = blockKey(number.toBigInteger())

  fun blockKey(number: BigInteger): BlockKeyRecord =
    blockKey(number.unsignedByteBuffer())

  fun blockKey(number: ByteBuffer?): BlockKeyRecord =
    BlockKeyRecord.newBuilder()
      .setNumber(number)
      .build()

  fun tokenKey(address: Data20? = null, contract: Data20? = null, tokenId: ByteBuffer? = null, balanceType: BalanceType = BalanceType.ETHER) =
    TokenBalanceKeyRecord.newBuilder()
      .setBalanceType(balanceType)
      .setAddress(address)
      .setContract(contract)
      .setTokenId(tokenId)
      .build()

  fun tokenBalance(amount: ByteBuffer? = null, address: Data20? = null) =
    TokenBalanceRecord.newBuilder()
      .setAmount(amount)
      .setAddress(address)
      .build()

  fun contractKey(address: Data20?) =
    ContractKeyRecord.newBuilder()
      .setAddress(address)
      .build()

  fun contractCreation(type: ContractType?, address: Data20?, creator: Data20?, blockHash: Data32?, txHash: Data32?, data: ByteBuffer?) =
    ContractCreateRecord.newBuilder()
      .setType(type)
      .setAddress(address)
      .setCreator(creator)
      .setBlockHash(blockHash)
      .setTxHash(txHash)
      .setData(data)
      .build()

  fun contractDestruction(address: Data20?, blockHash: Data32?, txHash: Data32?) =
    ContractDestroyRecord.newBuilder()
      .setAddress(address)
      .setBlockHash(blockHash)
      .setTxHash(txHash)
      .build()
}
