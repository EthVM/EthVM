package io.enkrypt.bolt.extensions

import io.enkrypt.avro.*
import org.bson.Document
import org.ethereum.util.ByteUtil
import java.nio.ByteBuffer

fun Bytes32?.toHex(): String? {
  return if(this == null) { null; } else ByteUtil.toHexString(this.bytes())
}

fun Bytes20?.toHex(): String? {
  return if(this == null) { null; } else ByteUtil.toHexString(this.bytes())
}

fun Block?.toDocument() = Document(mapOf(
  "hash" to this?.getHash()?.toHex(),
  "header" to this?.getHeader().toDocument(),
  "stats" to this?.getBlockStats().toDocument()
))

fun BlockStats?.toDocument() = Document(mapOf(
  "blockTimeMs" to this?.getBlockTimeMs(),
  "numFailedTxs" to this?.getNumFailedTxs(),
  "numSuccessfulTxs" to this?.getNumSuccessfulTxs(),
  "avgGasPrice" to this?.getAvgGasPrice(),
  "avgTxsFees" to this?.getAvgTxsFees()
))

fun Transaction?.toDocument(): Document {
  val result = Document(mapOf(
    "hash" to this?.getHash()?.toHex(),
    "nonce" to this?.getNonce().toByteArray(),
    "from" to this?.getFrom()?.toHex(),
    "to" to this?.getTo()?.toHex(),
    "value" to this?.getValue()?.toByteArray(),
    "gasPrice" to this?.getGasPrice()?.toByteArray(),
    "gasLimit" to this?.getGasLimit()?.toByteArray(),
    "data" to this?.getData().toByteArray()
  ))

  if(this?.getReceipt() != null) {
    result.append("receipt", this.getReceipt().toDocument())
  }
  return result;
}

fun TransactionReceipt?.toDocument() = Document(mapOf(
  "postTxState" to this?.getPostTxState().toByteArray(),
  "cumulativeGas" to this?.getCumulativeGas().toByteArray(),
  "bloomFilter" to this?.getBloomFilter().toByteArray(),
  "gasUsed" to this?.getGasUsed().toByteArray(),
  "executionResult" to this?.getExecutionResult().toByteArray(),
  "logs" to this?.getLogs()?.map{ it.toDocument() },
  "error" to this?.getError().toString(),
  "txHash" to this?.getTxHash().toByteArray()
))

fun LogInfo?.toDocument() = Document(mapOf(
  "address" to this?.getAddress()?.toHex(),
  "topics" to this?.getTopics()?.map{ it.toByteArray() },
  "data" to this?.getData().toByteArray()
))

fun BlockHeader?.toDocument() = Document(mapOf(
  "parentHash" to this?.getParentHash()?.toHex(),
  "unclesHash" to this?.getParentHash()?.toHex(),
  "coinbase" to this?.getParentHash()?.toHex(),
  "stateRoot" to this?.getParentHash()?.toHex(),
  "txTrieRoot" to this?.getParentHash()?.toHex(),
  "receiptTrieRoot" to this?.getReceiptTrieRoot()?.toHex(),
  "logsBloom" to this?.getLogsBloom().toByteArray(),
  "difficulty" to this?.getDifficulty()?.toByteArray(),
  "timestamp" to this?.getTimestamp(),
  "number" to this?.getNumber(),
  "gasLimit" to this?.getGasLimit()?.toByteArray(),
  "gasUsed" to this?.getGasUsed(),
  "mixHash" to this?.getMixHash().toByteArray(),
  "extraData" to this?.getExtraData().toByteArray(),
  "nonce" to this?.getNonce().toByteArray()
))

fun AccountState?.toDocument() = Document(mapOf(
  "balance" to this?.getBalance().toByteArray(),
  "nonce" to this?.getNonce().toByteArray(),
  "stateRoot" to this?.getStateRoot().toByteArray(),
  "codeHash" to this?.getCodeHash().toByteArray()
))

fun Block?.rewind(): Block? {
  if (this == null) {
    return null
  }

  for (i in 0..24) {
    val field = get(i)
    if (field is ByteBuffer) {
      field.rewind()
    }
  }

  return this
}
