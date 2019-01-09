package io.enkrypt.kafka.streams.utils

import arrow.core.Option
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.common.extensions.setAmount
import java.math.BigInteger
import java.nio.file.Paths

object ERC20Abi : AbstractAbi(Paths.get(ERC20Abi::class.java.getResource("/abi/erc20.json").toURI())) {

  private const val FUNCTION_TOTAL_SUPPLY = "totalSupply"
  private const val FUNCTION_BALANCE_OF = "balanceOf"

  const val EVENT_TRANSFER = "Transfer"
  const val EVENT_APPROVAL = "Approval"

  override fun events(): Set<String> = setOf(EVENT_APPROVAL, EVENT_TRANSFER)

  override fun functions(): Set<String> = setOf(FUNCTION_BALANCE_OF, FUNCTION_TOTAL_SUPPLY)

  fun decodeTransferEvent(data: ByteArray, topics: List<Data32>): Option<TokenTransferRecord.Builder> {

    return if (topics.size != 3) {
      Option.empty()
    } else {

      this.matchEvent(topics[0])
        .map { it.decode(data, topics.map { it.bytes() }.toTypedArray()) }
        .map { values ->
          TokenTransferRecord.newBuilder()
            .setTransferType(BalanceType.ERC20)
            .setFrom(Data20(values[0] as ByteArray))
            .setTo(Data20(values[1] as ByteArray))
            .setAmount(values[2] as BigInteger)
        }
    }
  }
}
