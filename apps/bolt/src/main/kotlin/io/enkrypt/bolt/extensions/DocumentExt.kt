package io.enkrypt.bolt.extensions

import io.enkrypt.bolt.models.avro.Block
import io.enkrypt.bolt.models.avro.BlockStats
import io.enkrypt.bolt.models.avro.Log
import io.enkrypt.bolt.models.avro.Trace
import io.enkrypt.bolt.models.avro.Transaction
import io.enkrypt.bolt.models.avro.Transfer
import org.bson.Document
import org.bson.conversions.Bson

fun Transfer?.toDocument(): Document? {
  if (this == null) {
    return null
  }
  return Document()
    .append("op", getOp()?.toByte())
    .append("value", getValue()?.toString())
    .append("from", getFrom()?.toHex())
    .append("fromBalance", getFromBalance()?.toBigDecimal())
    .append("to", getTo()?.toHex())
    .append("toBalance", getToBalance()?.toBigDecimal())
    .append("input", getInput()?.toHex())
}

fun Trace?.toDocument(): Document? {
  if (this == null) {
    return null
  }
  return Document()
    .append("isError", getIsError())
    .append("msg", getMsg()?.toString())
    .append("transfers", getTransfers()?.map { t -> t.toDocument() })
}

fun Log?.toDocument(): Document? {
  if (this == null) {
    return null
  }
  return Document()
    .append("address", getAddress()?.toHex())
    .append("topics", getTopics().map { t -> t?.toHex() })
    .append("data", getData()?.toByteArray())
    .append("index", getIndex())
    .append("removed", getRemoved())
}

fun Transaction?.toDocument(): Document? {
  if (this == null) {
    return null
  }
  return Document()
    .append("hash", getHash()?.toHex())
    .append("root", getRoot()?.toHex())
    .append("index", getIndex())
    .append("timestamp", getTimestamp().millis)
    .append("nonce", getNonce().toHex())
    .append("nonceHash", getNonceHash()?.toHex())
    .append("from", getFrom()?.toHex())
    .append("fromBalance", getFromBalance().toBigDecimal())
    .append("to", getTo()?.toHex())
    .append("toBalance", getToBalance().toBigDecimal())
    .append("input", getInput().toByteArray())
    .append("contractAddress", getContractAddress()?.toHex())
    .append("value", getValue())
    .append("gas", getGas().toBigDecimal())
    .append("gasPrice", getGasPrice().toBigDecimal())
    .append("gasUsed", getGasUsed().toBigDecimal())
    .append("cumulativeGasUsed", getCumulativeGasUsed().toBigDecimal())
    .append("v", getV()?.toHex())
    .append("r", getR()?.toHex())
    .append("s", getS()?.toHex())
    .append("status", getStatus())
    .append("logsBloom", getLogsBloom()?.toByteArray())
    .append("logs", getLogs()?.map { l -> l.toDocument() })
    .append("trace", getTrace()?.toDocument())
}

fun BlockStats?.toDocument(): Bson? {
  if (this == null) {
    return null
  }
  return Document()
    .append("blockTimeMs", getBlockTimeMs())
    .append("numFailedTxs", getNumFailedTxs())
    .append("numSuccessfulTxs", getNumSuccessfulTxs())
    .append("avgGasPrice", getAvgGasPrice())
    .append("avgTxsFees", getAvgTxsFees())

}

fun Block?.toDocument(): Document? {
  if (this == null) {
    return null
  }
  return Document()
//    .append("number", getNumber().toBigInteger())
    .append("hash", getHash()?.toHex())
    .append("parentHash", getParentHash()?.toHex())
    .append("mixDigest", getMixDigest()?.toHex())
    .append("uncle", getUncle()?.toString())
    .append("status", getStatus())
    .append("timestamp", getTimestamp().millis)
    .append("nonce", getNonce().toHex())
    .append("sha3Uncles", getSha3Uncles()?.toHex())
    .append("logsBloom", getLogsBloom()?.toHex())
    .append("stateRoot", getStateRoot()?.toHex())
    .append("transactionsRoot", getTransactionsRoot()?.toHex())
    .append("miner", getMiner()?.toHex())
//    .append("difficulty", getDifficulty())
//    .append("totalDifficulty", getTotalDifficulty())
    .append("extraData", getExtraData()?.toHex())
    .append("size", getSize().toBigDecimal())
    .append("gasLimit", getGasLimit().toBigDecimal())
    .append("gasUsed", getGasUsed().toBigDecimal())
    //    .append("transactions", getTransactions()?.map { tx -> tx.toDocument() })
    .append("txsFees", getTxsFees().toBigDecimal())
    .append("blockReward", getBlockReward().toBigDecimal())
    .append("uncleReward", getUncleReward().toBigDecimal())
    .append("uncles", getUncles()?.map { u -> u.toHex() })
  //    .append("stats", getStats().toDocument())
}
