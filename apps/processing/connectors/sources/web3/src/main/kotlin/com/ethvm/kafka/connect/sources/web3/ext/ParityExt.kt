package com.ethvm.kafka.connect.sources.web3.ext

import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.JsonRpc2_0Parity
import org.web3j.protocol.parity.methods.response.Trace
import java.math.BigInteger
import java.util.Arrays

class JsonRpc2_0ParityExtended(web3jService: Web3jService) : JsonRpc2_0Parity(web3jService) {

  fun ethvmGetTracesByNumber(from: BigInteger, to: BigInteger): Request<*, EthvmTracesResponse> {
    return Request(
      "trace_blocks",
      Arrays.asList(
        DefaultBlockParameter.valueOf(from),
        DefaultBlockParameter.valueOf(to)
      ),
      web3jService,
      EthvmTracesResponse::class.java
    )
  }

  fun ethvmGetReceiptsByNumber(from: BigInteger, to: BigInteger): Request<*, EthvmReceiptsResponse> {
    return Request(
      "parity_getBlocksReceipts",
      Arrays.asList(
        DefaultBlockParameter.valueOf(from),
        DefaultBlockParameter.valueOf(to)
      ),
      web3jService,
      EthvmReceiptsResponse::class.java
    )
  }

  fun ethvmGetBlocksByNumber(from: BigInteger, to: BigInteger, includeTxs: Boolean): Request<*, EthvmBlocksResponse> {
    return Request(
      "eth_getBlocksByNumber",
      Arrays.asList(
        DefaultBlockParameter.valueOf(from),
        DefaultBlockParameter.valueOf(to),
        includeTxs
      ),
      web3jService,
      EthvmBlocksResponse::class.java
    )
  }

  fun ethvmGetUnclesByNumber(from: BigInteger, to: BigInteger): Request<*, EthvmUnclesResponse> {
    return Request(
      "eth_getUnclesByNumber",
      Arrays.asList(
        DefaultBlockParameter.valueOf(from),
        DefaultBlockParameter.valueOf(to)
      ),
      web3jService,
      EthvmUnclesResponse::class.java
    )
  }
}

class EthvmBlocksResponse : Response<List<EthBlock.Block>>() {
  val blocks: List<EthBlock.Block>
    get() = result
}

class EthvmUnclesResponse : Response<List<UncleBlock.Block>>() {
  val uncles: List<UncleBlock.Block>
    get() = result
}

class EthvmReceiptsResponse : Response<List<TransactionReceipt>>() {
  val receipts: List<TransactionReceipt>
    get() = result
}

class EthvmTracesResponse : Response<List<Trace>>() {
  val traces: List<Trace>
    get() = result
}
