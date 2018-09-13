package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.extensions.toBigDecimal
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.models.avro.Transaction
import org.bson.Document
import org.joda.time.DateTime
import java.math.BigDecimal

class KTransaction(private val delegate: Transaction) {

  val hash: String? by lazy { delegate.getHash().toHex() }
  val root: String? by lazy { delegate.getRoot().toHex() }
  val index: Int by lazy { delegate.getIndex() }
  val timestamp: DateTime by lazy { delegate.getTimestamp() }
  val nonce: String? by lazy { delegate.getNonce().toHex() }
  val nonceHash: String? by lazy { delegate.getNonce().toHex() }
  val from: String? by lazy { delegate.getFrom().toHex() }
  val fromBalance: BigDecimal? by lazy { delegate.getFromBalance().toBigDecimal() }
  val to: String? by lazy { delegate.getTo().toHex() }
  val toBalance: BigDecimal? by lazy { delegate.getToBalance().toBigDecimal() }
  val input: String? by lazy { delegate.getInput().toHex() }
  val contractAddress: String? by lazy { delegate.getContractAddress().toHex() }
  val value: String? by lazy { delegate.getValue().toHex() }
  val gas: BigDecimal? by lazy { delegate.getGas().toBigDecimal() }
  val gasPrice: BigDecimal? by lazy { delegate.getGasPrice().toBigDecimal() }
  val gasUsed: BigDecimal? by lazy { delegate.getGasUsed().toBigDecimal() }
  val cumulativeGasUsed: BigDecimal? by lazy { delegate.getCumulativeGasUsed().toBigDecimal() }
  val v: String? by lazy { delegate.getV().toHex() }
  val r: String? by lazy { delegate.getR().toHex() }
  val s: String? by lazy { delegate.getS().toHex() }
  val status: String? by lazy { delegate.getStatus().toHex() }
  val logsBloom: String? by lazy { delegate.getLogsBloom().toHex() }
  val logs: List<KLog?> by lazy { delegate.getLogs().map { KLog(it) } }
  val trace: KTrace? by lazy { KTrace(delegate.getTrace()) }

  fun toDocument(): Document = Document()
    .append("hash", hash)
    .append("root", root)
    .append("index", index)
    .append("timestamp", timestamp.millis)
    .append("nonce", nonce)
    .append("nonceHash", nonceHash)
    .append("from", from)
    .append("fromBalance", fromBalance)
    .append("to", to)
    .append("toBalance", toBalance)
    .append("input", input)
    .append("contractAddress", contractAddress)
    .append("value", value)
    .append("gas", gas)
    .append("gasPrice", gasPrice)
    .append("gasUsed", gasUsed)
    .append("cumulativeGasUsed", cumulativeGasUsed)
    .append("v", v)
    .append("r", r)
    .append("s", s)
    .append("status", status)
    .append("logsBloom", logsBloom)
    .append("logs", logs.map { it?.toDocument() })
    .append("trace", trace?.toDocument())

}
