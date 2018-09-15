package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.models.avro.Trace
import org.bson.Document

class KTrace(private val delegate: Trace) {

  val isError: Boolean by lazy { delegate.getIsError() }
  val msg: String? by lazy { delegate.getMsg().toString() }
  val tranfers: List<KTransfer?> by lazy { delegate.getTransfers().map { KTransfer(it) } }

  fun toDocument(): Document = Document()
    .append("isError", isError)
    .append("msg", msg)
    .append("transfers", tranfers.map { t -> t?.toDocument() })

  override fun toString(): String {
    return toDocument().toString()
  }


}
