package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.models.avro.Trace
import org.bson.Document

class KTrace(private val delegate: Trace) {

  val error: Int by lazy { delegate.getError() }
  val tranfers: List<KTransfer?> by lazy { delegate.getTransfers().map { KTransfer(it) } }

  fun toDocument(): Document = Document()
    .append("error", error)
    .append("transfers", tranfers.map { t -> t?.toDocument() })

  override fun toString(): String = toDocument().toString()

  companion object {
    const val TRACE_OK = 0
    const val TraceOutOfGasError = 1
    const val TRACE_DEPTH = 2
    const val TRACE_LIMIT_REACHED = 3
    const val TRACE_INSUFFICIENT_BALANCE = 4
    const val TRACE_CONTRACT_ADDRESS_COLLISION = 5
    const val TRACE_UNKNOWN_ERROR = 6
  }
}
