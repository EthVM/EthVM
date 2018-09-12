package io.enkrypt.bolt.models

import org.bson.Document
import java.math.BigDecimal

// TODO: Add Address type (Contract or Address)
// TODO: Add Address regular transactions
// TODO: Add Address internal txs
// TODO: Add Address Tokens (ERC20 - ERC721)
data class Address(
  val address: String,
  val balance: BigDecimal
) {

  fun toDocument(): Document {
    return Document()
      .append("balance", this.balance)
  }
}
