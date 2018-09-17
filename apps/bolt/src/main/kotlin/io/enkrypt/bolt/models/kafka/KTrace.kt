package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.models.avro.Trace
import org.bson.Document

class KTrace(private val delegate: Trace) {

  val error: Int by lazy { delegate.getError() }
  val tranfers: List<KTransfer?> by lazy { delegate.getTransfers().map { KTransfer(it) } }

  fun toDocument(): Document = Document()
    .append("error", error)
    .append("transfers", tranfers.map { t -> t?.toDocument() })

  override fun toString(): String {
    return toDocument().toString()
  }

}
