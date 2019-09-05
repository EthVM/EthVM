package com.ethvm.processing.web3

import arrow.core.Option
import com.ethvm.common.extensions.byteArray
import com.ethvm.common.extensions.hex
import com.ethvm.common.extensions.hexBuffer
import com.ethvm.common.extensions.hexBytes
import java.math.BigInteger
import java.nio.ByteBuffer

data class ERC20Transfer(
  val from: String,
  val to: String,
  val amount: BigInteger
)

object ERC20Abi : AbstractAbi(ERC20Abi::class.java.getResourceAsStream("/abi/erc20.json")) {

  private const val FUNCTION_TOTAL_SUPPLY = "totalSupply"
  private const val FUNCTION_BALANCE_OF = "balanceOf"

  const val EVENT_TRANSFER = "Transfer"
  const val EVENT_APPROVAL = "Approval"

  override fun events(): Set<String> = setOf(EVENT_APPROVAL, EVENT_TRANSFER)

  override fun functions(): Set<String> = setOf(FUNCTION_BALANCE_OF, FUNCTION_TOTAL_SUPPLY)

  fun decodeTransferEventHex(data: String, topics: List<String>): Option<ERC20Transfer> =
    decodeTransferEvent(data.hexBytes(), topics.map { it.hexBuffer()!! })

  fun decodeTransferEvent(data: ByteArray, topics: List<ByteBuffer>): Option<ERC20Transfer> {

    return if (topics.size != 3) {
      Option.empty()
    } else {

      this.matchEvent(topics[0])
        .map { it.decode(data, topics.map { topic -> topic.byteArray() }.toTypedArray()) }
        .map { values ->
          ERC20Transfer(
            "0x${(values[0] as ByteArray).hex()!!}",
            "0x${(values[1] as ByteArray).hex()!!}",
            values[2] as BigInteger
          )
        }
    }
  }
}


fun main(args: Array<String>) {


  val topics = listOf(
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef".hexBuffer()!!,
    "0x00000000000000000000000027eddd316c8a9bfed82e7d271c87922abb0c153c".hexBuffer()!!,
    "0x00000000000000000000000033f8161cf4252d285a93f4020873a28a7fcca661".hexBuffer()!!
  )

  val data = "0000000000000000000000000000000000000000000000000000000000000005".hexBytes()

  val event = ERC20Abi.decodeTransferEvent(data, topics)

  println("Event = $event")

}
