package io.enkrypt.bolt.models

import io.enkrypt.bolt.eth.utils.ContractType
import io.enkrypt.bolt.extensions.toHex
import org.bson.Document

class Contract(
  val address: ByteArray,
  private val type: ContractType? = ContractType.GENERIC
) {

  fun toDocument(): Document = Document(
    mapOf(
      "address" to address.toHex(),
      "contract" to type?.ordinal
    )
  )
}
