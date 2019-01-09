package io.enkrypt.kafka.streams.utils

import arrow.core.Option
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.avro.processing.TokenTransferType
import io.enkrypt.common.extensions.setTokenId
import java.math.BigInteger
import java.nio.file.Paths

object ERC721Abi : AbstractAbi(Paths.get(ERC721Abi::class.java.getResource("/abi/erc721.json").toURI())) {

  private const val EVENT_TRANSFER = "Transfer"
  private const val EVENT_APPROVAL = "Approval"

  override fun events(): Set<String> = setOf(EVENT_APPROVAL, EVENT_TRANSFER)

  override fun functions(): Set<String> = emptySet()

  fun decodeTransferEvent(data: ByteArray, topics: List<Data32>): Option<TokenTransferRecord.Builder> {

    return if (topics.size != 4) {
      Option.empty()
    } else {

      this.matchEvent(topics[0])
        .map { it.decode(data, topics.map { it.bytes() }.toTypedArray()) }
        .map { values ->
          TokenTransferRecord.newBuilder()
            .setTransferType(BalanceType.ERC721)
            .setFrom(Data20(values[0] as ByteArray))
            .setTo(Data20(values[1] as ByteArray))
            .setTokenId(values[2] as BigInteger)
        }
    }
  }
}
