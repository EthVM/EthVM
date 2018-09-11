package io.enkrypt.bolt.extensions

import io.enkrypt.bolt.models.Block
import io.enkrypt.bolt.models.BlockStats
import io.enkrypt.bolt.models.Log
import io.enkrypt.bolt.models.Trace
import io.enkrypt.bolt.models.Transaction
import io.enkrypt.bolt.models.Transfer
import org.bson.Document
import org.bson.conversions.Bson
import java.nio.ByteBuffer

fun ByteBuffer?.toByteArray(): ByteArray? {
  if(this == null) return null
  val arr = ByteArray(remaining())
  get(arr)
  return arr
}

fun Transfer?.toDocument(): Document? {
  if(this == null) return null
  return Document()
    .append("op", getOp()?.toString())
    .append("value", getValue()?.toString())
    .append("from", getFrom()?.toString())
    .append("fromBalance", getFromBalance()?.toString())
    .append("to", getTo()?.toString())
    .append("toBalance", getToBalance()?.toString())
    .append("input", getInput()?.toString())
}

fun Trace?.toDocument(): Document? {
  if(this == null) return null
  return Document()
    .append("isError", getIsError())
    .append("msg", getMsg()?.toString())
    .append("transfers", getTransfers()?.map { t -> t.toDocument() })
}

fun Log?.toDocument(): Document? {
  if(this == null) return null
  return Document()
    .append("address", getAddress()?.toString())
    .append("topics", getTopics().map{ t -> t?.toString() })
    .append("data", getData()?.toByteArray())
    .append("index", getIndex())
    .append("removed", getRemoved())
}

fun Transaction?.toDocument(): Document? {
  if(this == null) return null
  return Document()
    .append("hash", getHash()?.toString())
    .append("root", getRoot()?.toString())
    .append("index", getIndex())
    .append("timestamp", getTimestamp().millis)
    .append("nonce", getNonce())
    .append("nonceHash", getNonceHash()?.toString())
    .append("from", getFrom()?.toString())
    .append("fromBalance", getFromBalance())
    .append("to", getTo()?.toString())
    .append("toBalance", getToBalance())
    .append("input", getInput().toByteArray())
    .append("contractAddress", getContractAddress()?.toString())
    .append("value", getValue())
    .append("gas", getGas())
    .append("gasPrice", getGasPrice())
    .append("gasUsed", getGasUsed())
    .append("cumulativeGasUsed", getCumulativeGasUsed())
    .append("v", getV()?.toString())
    .append("r", getR()?.toString())
    .append("s", getS()?.toString())
    .append("status", getStatus())
    .append("logsBloom", getLogsBloom()?.toByteArray())
    .append("logs", getLogs()?.map{ l -> l.toDocument() })
    .append("trace", getTrace()?.toDocument())
}

fun BlockStats?.toDocument(): Bson? {
  if(this == null) return null
  return Document()
    .append("blockTimeMs", getBlockTimeMs())
    .append("numFailedTxs", getNumFailedTxs())
    .append("numSuccessfulTxs", getNumSuccessfulTxs())
    .append("avgGasPrice", getAvgGasPrice())
    .append("avgTxsFees", getAvgTxsFees())

}

fun Block?.toDocument(): Document? {
  if(this == null) return null
  return Document()
    .append("number", getNumber())
    .append("hash", getHash()?.toString())
    .append("parentHash", getParentHash()?.toString())
    .append("uncle", getUncle()?.toString())
    .append("status", getStatus())
    .append("timestamp", getTimestamp().millis)
    .append("nonce", getNonce())
    .append("mixDigest", getMixDigest()?.toString())
    .append("sha3Uncles", getSha3Uncles()?.toString())
    .append("logsBloom", getLogsBloom()?.toString())
    .append("stateRoot", getStateRoot()?.toString())
    .append("transactionsRoot", getTransactionsRoot()?.toString())
    .append("miner", getMiner()?.toString())
    .append("difficulty", getDifficulty())
    .append("totalDifficulty", getTotalDifficulty())
    .append("extraData", getExtraData()?.toByteArray())
    .append("size", getSize())
    .append("gasLimit", getGasLimit())
    .append("gasUsed", getGasUsed())
    .append("txsFees", getTxsFees())
    .append("blockReward", getBlockReward())
    .append("uncleReward", getUncleReward())
    .append("stats", getStats().toDocument())
    .append("transactions", getTransactions()?.map{ tx -> tx.toDocument() })
    .append("uncles", getUncles()?.map{ u -> u.toString() })
}
