package io.enkrypt.bolt.eth.utils

import arrow.core.Option
import io.enkrypt.avro.common.DataWord
import io.enkrypt.avro.processing.NonFungibleTokenTransferRecord
import io.enkrypt.bolt.extensions.setTokenId
import io.enkrypt.bolt.extensions.toByteBuffer
import java.math.BigInteger
import java.nio.file.Paths

object ERC721Abi : AbstractAbi(Paths.get(ERC721Abi::class.java.getResource("/abi/erc721.json").toURI())) {

  private const val EVENT_TRANSFER = "Transfer"
  private const val EVENT_APPROVAL = "Approval"

  override fun events(): Set<String> = setOf(EVENT_APPROVAL, EVENT_TRANSFER)

  override fun functions(): Set<String> = emptySet()

  fun decodeTransferEvent(data: ByteArray, topics: List<DataWord>): Option<NonFungibleTokenTransferRecord.Builder> {

    return if (topics.size != 4) {
      Option.empty()
    } else {

      this.matchEvent(topics[0])
        .map { it.decode(data, topics.map { it.bytes() }.toTypedArray()) }
        .map { values ->
          NonFungibleTokenTransferRecord.newBuilder()
            .setFrom((values[0] as ByteArray).toByteBuffer())
            .setTo((values[1] as ByteArray).toByteBuffer())
            .setTokenId(values[2] as BigInteger)
        }

    }

  }

}
