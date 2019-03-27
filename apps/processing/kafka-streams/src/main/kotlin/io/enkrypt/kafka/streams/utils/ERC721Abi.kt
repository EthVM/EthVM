package io.enkrypt.kafka.streams.utils

import arrow.core.Option
import io.enkrypt.common.extensions.byteArray
import io.enkrypt.common.extensions.hex
import io.enkrypt.common.extensions.hexBuffer
import io.enkrypt.common.extensions.hexBytes
import java.math.BigInteger
import java.nio.ByteBuffer

data class ERC721Transfer(val from: String,
                          val to: String,
                          val tokenId: BigInteger)

object ERC721Abi : AbstractAbi(ERC721Abi::class.java.getResourceAsStream("/abi/erc721.json")) {

  private const val EVENT_TRANSFER = "Transfer"
  private const val EVENT_APPROVAL = "Approval"

  override fun events(): Set<String> = setOf(EVENT_APPROVAL, EVENT_TRANSFER)

  override fun functions(): Set<String> = emptySet()

  fun decodeTransferEventHex(data: String, topics: List<String>): Option<ERC721Transfer> =
    decodeTransferEvent(data.hexBytes(), topics.map { it.hexBuffer()!! })


  fun decodeTransferEvent(data: ByteArray, topics: List<ByteBuffer>): Option<ERC721Transfer> {

    return if (topics.size != 4) {
      Option.empty()
    } else {

      this.matchEvent(topics[0])
        .map { it.decode(data, topics.map { it.byteArray() }.toTypedArray()) }
        .map { values ->
          ERC721Transfer(
            "0x${(values[0] as ByteArray).hex()!!}",
            "0x${(values[1] as ByteArray).hex()!!}",
            (values[2] as BigInteger)
          )
        }
    }
  }
}
