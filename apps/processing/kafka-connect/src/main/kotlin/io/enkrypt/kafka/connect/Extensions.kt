package io.enkrypt.kafka.connect

import org.apache.commons.codec.binary.Hex
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import java.math.BigInteger

private val HEX_CHARS = "0123456789abcdef".toCharArray()

/**
 * Taken from https://gist.github.com/fabiomsr/845664a9c7e92bafb6fb0ca70d4e44fd
 */
fun ByteArray.toHex(): String {
  val result = StringBuffer()

  forEach {
    val octet = it.toInt()
    val firstIndex = (octet and 0xF0).ushr(4)
    val secondIndex = octet and 0x0F
    result.append(HEX_CHARS[firstIndex])
    result.append(HEX_CHARS[secondIndex])
  }

  return result.toString()
}

fun ByteArray.toBigInteger(): BigInteger = BigInteger(this)

fun Long.toBigInteger(): BigInteger = BigInteger.valueOf(this)

fun String.hexToBytes(): ByteArray = Hex.decodeHex(this.replace("0x", ""))

fun EthBlock.Block.toStruct(schema: Schema): Struct {

  val struct = Struct(schema)
  struct.put("number", number.toByteArray())
  struct.put("hash", hash.hexToBytes())
  struct.put("parentHash", parentHash.hexToBytes())
  struct.put("nonce", nonceRaw.hexToBytes())
  struct.put("sha3Uncles", sha3Uncles.hexToBytes())
  struct.put("logsBloom", logsBloom.hexToBytes())
  struct.put("transactionsRoot", transactionsRoot.hexToBytes())
  struct.put("stateRoot", stateRoot.hexToBytes())
  struct.put("receiptsRoot", receiptsRoot.hexToBytes())
  struct.put("miner", miner.hexToBytes())
  struct.put("difficulty", difficulty.toByteArray())
  struct.put("totalDifficulty", totalDifficulty.toByteArray())
  struct.put("extraData", extraData.hexToBytes())
  struct.put("size", size.toLong())
  struct.put("gasLimit", gasLimit.toByteArray())
  struct.put("gasUsed", gasUsed.toByteArray())
  struct.put("timestamp", timestamp.toLong())
  struct.put("uncles", uncles.map { it.hexToBytes() })

//  struct.put("transactions", transactions.map {
//
//    when (it.get()) {
//      is Transaction -> (it as Transaction).toStruct(schema.field("transactions").schema().valueSchema())
//      else -> throw IllegalStateException("Unexpected type")
//    }
//
//  })

  if (author != null) struct.put("author", author)
  if (sealFields != null) struct.put("sealFields", sealFields.map { it.hexToBytes() })
  if (mixHash != null) struct.put("mixHash", mixHash.hexToBytes())

  return struct

}

fun Transaction.toStruct(schema: Schema, receipt: TransactionReceipt?): Struct {

  val struct = Struct(schema)
  struct.put("hash", hash.hexToBytes())
  struct.put("nonce", nonce.toByteArray())
  struct.put("transactionIndex", transactionIndex.toByteArray())
  struct.put("from", from.hexToBytes())
  struct.put("value", value.toByteArray())
  struct.put("gasPrice", gasPrice.toByteArray())
  struct.put("gas", gas.toByteArray())

  if (receipt != null) struct.put("receipt", receipt.toStruct(schema.field("receipt").schema()))

  if (to != null) struct.put("to", to.hexToBytes())
  if (input != null) struct.put("input", input.hexToBytes())
  if (creates != null) struct.put("creates", creates.hexToBytes())
  if (publicKey != null) struct.put("publicKey", publicKey.hexToBytes())
  if (raw != null) struct.put("raw", raw.hexToBytes())

  return struct

}

fun TransactionReceipt.toStruct(schema: Schema): Struct {

  val struct = Struct(schema)
  struct.put("cumulativeGasUsed", cumulativeGasUsed.toByteArray())
  struct.put("gasUsed", gasUsed.toByteArray())
  struct.put("logsBloom", logsBloom.hexToBytes())
  struct.put("logs", logs.map { it.toStruct(schema.field("logs").schema().valueSchema()) })

  if (root != null) struct.put("root", root.hexToBytes())
  if (contractAddress != null) struct.put("contractAddress", contractAddress.hexToBytes())
  if (status != null) struct.put("status", status.hexToBytes())

  return struct
}

fun Log.toStruct(schema: Schema): Struct =
    Struct(schema)
        .put("address", address.hexToBytes())
        .put("data", data.hexToBytes())
        .put("topics", topics.map { it.hexToBytes() })

