package io.enkrypt.bolt.extensions

import io.enkrypt.avro.AccountState
import io.enkrypt.avro.Block
import io.enkrypt.avro.BlockHeader
import io.enkrypt.avro.BlockStats
import io.enkrypt.avro.Bytes20
import io.enkrypt.avro.Bytes32
import io.enkrypt.avro.LogInfo
import io.enkrypt.avro.Transaction
import io.enkrypt.avro.TransactionReceipt
import org.bson.Document
import org.ethereum.util.ByteUtil

fun Bytes32?.toHex(): String? = if (this == null) null else ByteUtil.toHexString(this.bytes())

fun Bytes20?.toHex(): String? = if (this == null) null else ByteUtil.toHexString(this.bytes())

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

fun Transaction?.toDocument(blockHash: String): Document {
  val result = Document(mapOf(
    "hash" to this?.getHash()?.toHex(),
    "blockHash" to blockHash,
    "transactionIndex" to this?.getTransactionIndex(),
    "nonce" to this?.getNonce().toByteArray(),
    "from" to this?.getFrom()?.toHex(),
    "to" to this?.getTo()?.toHex(),
    "value" to this?.getValue()?.toByteArray(),
    "gasPrice" to this?.getGasPrice()?.toByteArray(),
    "gasLimit" to this?.getGasLimit()?.toByteArray(),
    "data" to this?.getData().toByteArray(),
    "v" to this?.getV().toByteArray(),
    "r" to this?.getR().toByteArray(),
    "s" to this?.getS().toByteArray()
  ))

  if (this?.getReceipt() != null) {
    result.append("receipt", this.getReceipt().toDocument())
  }
  return result
}

fun TransactionReceipt?.toDocument() = Document(mapOf(
  "postTxState" to this?.getPostTxState().toByteArray(),
  "cumulativeGas" to this?.getCumulativeGas().toByteArray(),
  "bloomFilter" to this?.getBloomFilter().toByteArray(),
  "gasUsed" to this?.getGasUsed().toByteArray(),
  "executionResult" to this?.getExecutionResult().toByteArray(),
  "logs" to this?.getLogs()?.map { it.toDocument() }
))

fun LogInfo?.toDocument() = Document(mapOf(
  "address" to this?.getAddress()?.toHex(),
  "topics" to this?.getTopics()?.map { it.toByteArray() },
  "data" to this?.getData().toByteArray()
))

fun BlockHeader?.toDocument() = Document(mapOf(
  "parentHash" to this?.getParentHash()?.toHex(),
  "unclesHash" to this?.getUnclesHash()?.toHex(),
  "coinbase" to this?.getCoinbase()?.toHex(),
  "stateRoot" to this?.getStateRoot()?.toHex(),
  "txTrieRoot" to this?.getTxTrieRoot()?.toHex(),
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
