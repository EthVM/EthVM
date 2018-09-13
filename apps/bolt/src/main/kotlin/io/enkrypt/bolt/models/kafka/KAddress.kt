package io.enkrypt.bolt.models.kafka

import org.bson.Document
import java.math.BigDecimal

// TODO: Add KAddress type (Contract or KAddress)
// TODO: Add KAddress regular transactions
// TODO: Add KAddress internal txs
// TODO: Add KAddress Tokens (ERC20 - ERC721)
data class KAddress(
  val address: String,
  val balance: BigDecimal
) {

  fun toDocument(): Document {
    return Document()
      .append("balance", this.balance)
  }
}
