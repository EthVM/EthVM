package com.ethvm.kafka.connect.sources.web3.ext

import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.JsonRpc2_0Parity
import java.util.Arrays

class JsonRpc2_0ParityExtended(web3jService: Web3jService) : JsonRpc2_0Parity(web3jService) {

  fun parityGetBlockReceipts(defaultBlockParameter: DefaultBlockParameter): Request<*, com.ethvm.kafka.connect.sources.web3.ext.ParityBlockReceiptsResponse> {
    return Request(
      "parity_getBlockReceipts",
      Arrays.asList(defaultBlockParameter.value),
      web3jService,
      com.ethvm.kafka.connect.sources.web3.ext.ParityBlockReceiptsResponse::class.java
    )
  }

  fun parityGetPendingTransactions(): Request<*, com.ethvm.kafka.connect.sources.web3.ext.ParityPendingTransactionsResponse> {
    return Request(
      "parity_pendingTransactions",
      emptyList<String>(),
      web3jService,
      com.ethvm.kafka.connect.sources.web3.ext.ParityPendingTransactionsResponse::class.java
    )
  }
}

class ParityPendingTransactionsResponse : Response<List<Transaction>>() {
  val transactions: List<Transaction>?
    get() = result
}

class ParityBlockReceiptsResponse : Response<List<TransactionReceipt>>() {
  val receipts: List<TransactionReceipt>?
    get() = result
}
