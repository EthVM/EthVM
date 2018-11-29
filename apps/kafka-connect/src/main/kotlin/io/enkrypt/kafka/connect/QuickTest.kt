package io.enkrypt.kafka.connect

import mu.KotlinLogging
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.websocket.WebSocketService
import java.math.BigInteger

fun main(args: Array<String>) {

  val wsService = WebSocketService("ws://localhost:8546", false)
  wsService.connect()

  val web3 = Web3j.build(wsService)

  val logger = KotlinLogging.logger {}

  val block = web3.ethGetBlockByNumber(DefaultBlockParameter.valueOf(BigInteger.valueOf(46220)), true).send()

  web3
    .replayPastAndFutureBlocksFlowable(DefaultBlockParameter.valueOf(BigInteger.valueOf(0)), true)
    .subscribe{ resp ->

      logger.info { "Block received: ${resp.block}" }

    }

}
