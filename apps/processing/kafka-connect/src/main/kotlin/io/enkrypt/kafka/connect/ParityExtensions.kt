package io.enkrypt.kafka.connect

import org.web3j.protocol.Web3jService
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.Request
import org.web3j.protocol.core.Response
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.JsonRpc2_0Parity
import java.util.Arrays

class ParityBlockReceipts : Response<List<TransactionReceipt>>()

class JsonRpc2_0ParityExtended(web3jService: Web3jService?) : JsonRpc2_0Parity(web3jService) {

    fun parityGetBlockReceipts(defaultBlockParameter: DefaultBlockParameter): Request<*, ParityBlockReceipts> {
        return Request(
                "parity_getBlockReceipts",
                Arrays.asList(defaultBlockParameter.value),
                web3jService,
                ParityBlockReceipts::class.java
        )
    }
}
