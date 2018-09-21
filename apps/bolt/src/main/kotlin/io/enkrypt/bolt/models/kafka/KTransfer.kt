package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.extensions.toBigDecimal
import io.enkrypt.bolt.extensions.toByteArray
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.models.avro.Transfer
import org.bson.Document
import java.math.BigDecimal

class KTransfer(private val delegate: Transfer) {

  val op: Int by lazy { delegate.getOp() }
  val value: BigDecimal? by lazy { delegate.getValue().toBigDecimal() }
  val from: String? by lazy { delegate.getFrom().toHex() }
  val to: String? by lazy { delegate.getTo().toHex() }
  val input: ByteArray? by lazy { delegate.getInput().toByteArray() }

  fun toDocument(): Document = Document()
    .append("op", op)
    .append("value", value)
    .append("from", from)
    .append("to", to)
    .append("input", input)

}
