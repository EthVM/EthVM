package io.enkrypt.kafka.connect.extensions

import io.enkrypt.common.extensions.hexBytes
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt

fun EthBlock.Block.toStruct(schema: Schema): Struct {

  val struct = Struct(schema).apply {
    put("number", number.toByteArray())
    put("hash", hash.hexBytes())
    put("parentHash", parentHash.hexBytes())
    put("nonce", nonceRaw.hexBytes())
    put("sha3Uncles", sha3Uncles.hexBytes())
    put("logsBloom", logsBloom.hexBytes())
    put("transactionsRoot", transactionsRoot.hexBytes())
    put("stateRoot", stateRoot.hexBytes())
    put("receiptsRoot", receiptsRoot.hexBytes())
    put("miner", miner.hexBytes())
    put("difficulty", difficulty.toByteArray())
    put("totalDifficulty", totalDifficulty.toByteArray())
    put("extraData", extraData.hexBytes())
    put("size", size.toLong())
    put("gasLimit", gasLimit.toByteArray())
    put("gasUsed", gasUsed.toByteArray())
    put("timestamp", timestamp.toLong())
    put("uncles", uncles.map { it.hexBytes() })
    //  put("transactions", transactions.map {
//
//    when (it.get()) {
//      is Transaction -> (it as Transaction).toStruct(schema.field("transactions").schema().valueSchema())
//      else -> throw IllegalStateException("Unexpected type")
//    }
//
//  })
  }

  if (author != null) struct.put("author", author)
  if (sealFields != null) struct.put("sealFields", sealFields.map { it.hexBytes() })
  if (mixHash != null) struct.put("mixHash", mixHash.hexBytes())

  return struct
}

fun Transaction.toStruct(schema: Schema, receipt: TransactionReceipt?): Struct {

  val struct = Struct(schema).apply {
    put("hash", hash.hexBytes())
    put("nonce", nonce.toByteArray())
    put("transactionIndex", transactionIndex.toByteArray())
    put("from", from.hexBytes())
    put("value", value.toByteArray())
    put("gasPrice", gasPrice.toByteArray())
    put("gas", gas.toByteArray())
  }

  if (receipt != null) struct.put("receipt", receipt.toStruct(schema.field("receipt").schema()))

  if (to != null) struct.put("to", to.hexBytes())
  if (input != null) struct.put("input", input.hexBytes())
  if (creates != null) struct.put("creates", creates.hexBytes())
  if (publicKey != null) struct.put("publicKey", publicKey.hexBytes())
  if (raw != null) struct.put("raw", raw.hexBytes())

  return struct
}

fun TransactionReceipt.toStruct(schema: Schema): Struct {

  val struct = Struct(schema)
  struct.put("cumulativeGasUsed", cumulativeGasUsed.toByteArray())
  struct.put("gasUsed", gasUsed.toByteArray())
  struct.put("logsBloom", logsBloom.hexBytes())
  struct.put("logs", logs.map { it.toStruct(schema.field("logs").schema().valueSchema()) })

  if (root != null) struct.put("root", root.hexBytes())
  if (contractAddress != null) struct.put("contractAddress", contractAddress.hexBytes())
  if (status != null) struct.put("status", status.hexBytes())

  return struct
}

fun Log.toStruct(schema: Schema): Struct =
  Struct(schema)
    .put("address", address.hexBytes())
    .put("fixed", data.hexBytes())
    .put("topics", topics.map { it.hexBytes() })
