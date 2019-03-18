package io.enkrypt.kafka.streams.utils

import arrow.core.Option
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.common.extensions.byteArray
import java.math.BigInteger
import java.nio.ByteBuffer

object ERC20Abi : AbstractAbi(ERC20Abi::class.java.getResourceAsStream("/abi/erc20.json")) {

  private const val FUNCTION_TOTAL_SUPPLY = "totalSupply"
  private const val FUNCTION_BALANCE_OF = "balanceOf"

  const val EVENT_TRANSFER = "Transfer"
  const val EVENT_APPROVAL = "Approval"

  override fun events(): Set<String> = setOf(EVENT_APPROVAL, EVENT_TRANSFER)

  override fun functions(): Set<String> = setOf(FUNCTION_BALANCE_OF, FUNCTION_TOTAL_SUPPLY)

  fun decodeTransferEvent(data: ByteArray, topics: List<ByteBuffer>): Option<TokenTransferRecord.Builder> {

    return if (topics.size != 3) {
      Option.empty()
    } else {

      this.matchEvent(topics[0])
        .map { it.decode(data, topics.map { it.byteArray() }.toTypedArray()) }
        .map { values ->
          TokenTransferRecord.newBuilder()
            .setTransferType(BalanceType.ERC20)
            .setFrom((values[0] as ByteArray).toString())
            .setTo((values[1] as ByteArray).toString())
            .setAmount((values[2] as BigInteger).toString())
        }
    }
  }
}
