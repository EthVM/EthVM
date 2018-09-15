package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.models.avro.Log
import org.bson.Document

class KLog(private val delegate: Log) {

  val address: String? by lazy { delegate.getAddress().toHex() }
  val topics: List<String?> by lazy { delegate.getTopics().map { it.toHex() } }
  val data: String? by lazy { delegate.getData().toHex() }
  val index: Int by lazy { delegate.getIndex() }
  val removed: Boolean by lazy { delegate.getRemoved() }

  fun toDocument(): Document = Document()
    .append("address", address)
    .append("topics", topics)
    .append("data", data)
    .append("index", index)
    .append("removed", removed)

  override fun toString(): String {
    return toDocument().toString()
  }


}
