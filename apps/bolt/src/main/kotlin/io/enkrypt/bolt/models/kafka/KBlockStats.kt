package io.enkrypt.bolt.models.kafka

import org.bson.Document
import java.math.BigDecimal

class KBlockStats(
  var blockTimeMs: Int = 0,
  var numFailedTxs: Int = 0,
  var numSuccessfulTxs: Int = 0,
  var avgGasPrice: BigDecimal? = null,
  var avgTxsFees: BigDecimal? = null
) {

  fun toDocument(): Document = Document()
    .append("blockTimeMs", blockTimeMs)
    .append("numFailedTxs", numFailedTxs)
    .append("numSuccessfulTxs", numSuccessfulTxs)
    .append("avgGasPrice", avgGasPrice)
    .append("avgTxsFees", avgTxsFees)

}
