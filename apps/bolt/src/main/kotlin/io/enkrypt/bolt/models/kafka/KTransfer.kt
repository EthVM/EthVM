package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.extensions.toBigDecimal
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.models.avro.Transfer
import org.bson.Document
import java.math.BigDecimal

class KTransfer(private val delegate: Transfer) {

  val op: Byte by lazy { delegate.getOp().toByte() }
  val value: String? by lazy { delegate.getValue().toHex() }
  val from: String? by lazy { delegate.getFrom().toHex() }
  val fromBalance: BigDecimal? by lazy { delegate.getFromBalance().toBigDecimal() }
  val to: String? by lazy { delegate.getTo().toHex() }
  val toBalance: BigDecimal? by lazy { delegate.getToBalance().toBigDecimal() }
  val input: String? by lazy { delegate.getInput().toHex() }

  fun toDocument(): Document = Document()
    .append("op", op)
    .append("value", value)
    .append("from", from)
    .append("fromBalance", fromBalance)
    .append("to", to)
    .append("toBalance", toBalance)
    .append("input", input)

}
