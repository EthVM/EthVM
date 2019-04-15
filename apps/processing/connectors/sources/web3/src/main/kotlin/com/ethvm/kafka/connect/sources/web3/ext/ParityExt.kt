package com.ethvm.kafka.connect.sources.web3.ext

import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.JsonRpc2_0Parity
import org.web3j.utils.Numeric
import java.math.BigInteger
import java.util.Arrays

class JsonRpc2_0ParityExtended(web3jService: Web3jService) : JsonRpc2_0Parity(web3jService) {

  fun parityGetBlockReceipts(defaultBlockParameter: DefaultBlockParameter): Request<*, ParityBlockReceiptsResponse> {
    return Request(
      "parity_getBlockReceipts",
      Arrays.asList(defaultBlockParameter.value),
      web3jService,
      ParityBlockReceiptsResponse::class.java
    )
  }

  fun parityGetPendingTransactions(): Request<*, ParityPendingTransactionsResponse> {
    return Request(
      "parity_pendingTransactions",
      emptyList<String>(),
      web3jService,
      ParityPendingTransactionsResponse::class.java
    )
  }

  fun ethvmGetUncleByBlockHashAndIndex(hash: String, index: BigInteger): Request<*, EthvmUncleResponse> {
    return Request(
      "eth_getUncleByBlockHashAndIndex",
      Arrays.asList(
        hash,
        Numeric.encodeQuantity(index)
      ),
      web3jService,
      EthvmUncleResponse::class.java
    )
  }

}

class EthvmUncleResponse : Response<EthBlock>() {
  val uncle: EthBlock
    get() = result
}

class ParityPendingTransactionsResponse : Response<List<Transaction>>() {
  val transactions: List<Transaction>?
    get() = result
}

class ParityBlockReceiptsResponse : Response<List<TransactionReceipt>>() {
  val receipts: List<TransactionReceipt>?
    get() = result
}
