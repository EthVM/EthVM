package io.enkrypt.bolt.models

import io.enkrypt.bolt.extensions.toHex
import org.bson.Document

class Contract(
  val address: ByteArray,
  private val contract: Boolean? = false,
  private val type: ContractType? = ContractType.GENERIC
) {

  fun toDocument(): Document = Document(
    mapOf(
      "address" to address.toHex(),
      "contract" to contract,
      "type" to type?.name
    )
  )

}

enum class ContractType {
  ERC20,
  ERC721,
  GENERIC
}
