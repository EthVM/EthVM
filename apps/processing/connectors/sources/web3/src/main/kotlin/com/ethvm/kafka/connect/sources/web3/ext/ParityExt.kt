package com.ethvm.kafka.connect.sources.web3.ext

import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.parity.JsonRpc2_0Parity
import java.math.BigInteger
import java.util.Arrays

class JsonRpc2_0ParityExtended(web3jService: Web3jService) : JsonRpc2_0Parity(web3jService) {

  fun ethChainId(): Request<*, EthChainIdResponse> {
    return Request(
      "eth_chainId",
      emptyList<Any>(),
      web3jService,
      EthChainIdResponse::class.java
    )
  }

  fun ethvmGetBlocksByNumber(from: BigInteger, to: BigInteger, maxTraceCount: Int): Request<*, EthvmBlocksResponse> {
    return Request(
      "ethvm_getBlocksByNumber",
      Arrays.asList(
        DefaultBlockParameter.valueOf(from),
        DefaultBlockParameter.valueOf(to),
        maxTraceCount
      ),
      web3jService,
      EthvmBlocksResponse::class.java
    )
  }
}

class EthChainIdResponse : Response<String>() {
  val chainId: String
    get() = result
}

class EthvmBlocksResponse : Response<List<FullBlock>>() {
  val fullBlocks: List<FullBlock>
    get() = result
}
