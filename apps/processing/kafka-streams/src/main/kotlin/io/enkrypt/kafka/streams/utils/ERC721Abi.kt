package io.enkrypt.kafka.streams.utils

import arrow.core.Option
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.common.extensions.byteArray
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.fixed20
import io.enkrypt.common.extensions.setTokenId
import java.math.BigInteger
import java.nio.ByteBuffer

object ERC721Abi : AbstractAbi(ERC721Abi::class.java.getResourceAsStream("/abi/erc721.json")) {

  private const val EVENT_TRANSFER = "Transfer"
  private const val EVENT_APPROVAL = "Approval"

  override fun events(): Set<String> = setOf(EVENT_APPROVAL, EVENT_TRANSFER)

  override fun functions(): Set<String> = emptySet()

  fun decodeTransferEvent(data: ByteArray, topics: List<ByteBuffer>): Option<TokenTransferRecord.Builder> {

    return if (topics.size != 4) {
      Option.empty()
    } else {

      this.matchEvent(topics[0])
        .map { it.decode(data, topics.map { it.byteArray() }.toTypedArray()) }
        .map { values ->
          TokenTransferRecord.newBuilder()
            .setTransferType(BalanceType.ERC721)
            .setFrom((values[0] as ByteArray).byteBuffer().fixed20())
            .setTo((values[1] as ByteArray).byteBuffer().fixed20())
            .setTokenId(values[2] as BigInteger)
        }
    }
  }
}
