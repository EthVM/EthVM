package io.enkrypt.kafka.streams.utils

import arrow.core.Option
import io.enkrypt.common.extensions.byteArray
import io.enkrypt.common.extensions.hex
import io.enkrypt.common.extensions.hexBuffer
import io.enkrypt.common.extensions.hexBytes
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
