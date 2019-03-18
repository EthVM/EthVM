package io.enkrypt.common.extensions

import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord

fun TokenTransferRecord.isFungible() = !(this.getFrom() == null || this.getTo() == null || this.getAmount() == null || this.getTokenId() != null)

fun TokenTransferRecord.isNonFungible() = !(this.getFrom() == null || this.getTo() == null || this.getTokenId() == null || this.getAmount() != null)

fun TokenBalanceKeyRecord.isFungible() = this.getAddress() != null

fun TokenBalanceKeyRecord.isNonFungible() = this.getTokenId() != null

fun ExchangeRateRecord.isValid() = !(this.marketCap == -1.0 || this.marketCapRank == -1)

fun TraceListRecord.txSuccessful(): Boolean {

  val parentCalls = getTraces()
    .filter { t -> t.getType() != "reward" && t.getTraceAddress().isEmpty() }

  if (parentCalls.isEmpty()) {
    // no txs, only rewards in this block
    return true
  }

  require(parentCalls.size == 1) { "Expected 1 parent call, found ${parentCalls.size}" }

  val error = parentCalls.first().getError()

  return error == null || error.isEmpty()

}

object AvroHelpers {


}
