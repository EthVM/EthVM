package io.enkrypt.kafka.connect.extensions

import io.enkrypt.common.extensions.hexUBigInteger
import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.core.methods.response.EthSyncing
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.JsonRpc2_0Parity
import java.math.BigInteger
import java.util.Arrays

class ParityBlockReceiptsResponse : Response<List<TransactionReceipt>>() {
  val receipts: List<TransactionReceipt>?
    get() = result
}

class JsonRpc2_0ParityExtended(web3jService: Web3jService?) : JsonRpc2_0Parity(web3jService) {

  fun parityGetBlockReceipts(defaultBlockParameter: DefaultBlockParameter): Request<*, ParityBlockReceiptsResponse> {
    return Request(
      "parity_getBlockReceipts",
      Arrays.asList(defaultBlockParameter.value),
      web3jService,
      ParityBlockReceiptsResponse::class.java
    )
  }


}

fun EthSyncing.Syncing.syncRanges(previous: EthSyncing.Syncing, batchSize: BigInteger): List<ClosedRange<BigInteger>> {

  var start = previous.currentBlock.hexUBigInteger()!!
  val end = this.currentBlock.hexUBigInteger()!!

  if(start > BigInteger.ZERO) start += BigInteger.ONE

  var ranges = emptyList<ClosedRange<BigInteger>>()

  var batchStart = start

  while(batchStart < end) {

    var batchEnd = batchStart + batchSize
    if(batchEnd > end) batchEnd = end

    ranges = ranges + batchStart.rangeTo(batchEnd)
    batchStart += (batchSize + BigInteger.ONE)
  }

  return ranges

}

