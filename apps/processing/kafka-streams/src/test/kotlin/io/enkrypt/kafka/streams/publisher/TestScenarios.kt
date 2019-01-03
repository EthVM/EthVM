package io.enkrypt.kafka.streams.publisher

import io.enkrypt.avro.common.Data20
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.keyRecord
import io.enkrypt.common.extensions.mwei
import io.enkrypt.kafka.streams.util.SolidityContract
import io.enkrypt.kafka.streams.util.StandaloneBlockchain
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Alice
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Terence
import org.ethereum.crypto.ECKey
import java.math.BigInteger

enum class TestEventType {
  ETHER_TRANSFER,
  CONTRACT_CREATE,
  ERC20_TRANSFER,
  ERC721_TRANSFER
}

abstract class TestEvent(val type: TestEventType)

data class EtherTransfer(
  val from: ECKey,
  val to: ECKey,
  val amount: BigInteger
) : TestEvent(TestEventType.ETHER_TRANSFER)

data class CreateContract(
  val sender: ECKey,
  val contract: SolidityContract,
  val gasPrice: Long? = null,
  val gasLimit: Long? = null,
  val value: BigInteger? = null
) : TestEvent(TestEventType.CONTRACT_CREATE)

data class ERC20Transfer(
  val from: ECKey,
  val contractAddress: Data20,
  val contract: SolidityContract,
  val gasPrice: Long? = null,
  val gasLimit: Long? = null,
  val to: ECKey,
  val amount: BigInteger
) : TestEvent(TestEventType.ERC20_TRANSFER)

abstract class TestScenario {

  abstract val premineBalances: Map<Data20?, BigInteger>

  abstract val blockEvents: List<List<TestEvent>>

  fun run(publisher: BlockPublisher, blockchain: StandaloneBlockchain) {

    blockEvents.forEach {

      // generate events

      it.forEach { event ->
        when (event.type) {
          TestEventType.ETHER_TRANSFER -> {
            val transfer = event as EtherTransfer
            blockchain.sendEther(transfer.from, transfer.to, transfer.amount)
          }
          TestEventType.CONTRACT_CREATE -> {
            val create = event as CreateContract
            blockchain.submitContract(
              create.sender,
              create.contract,
              create.gasPrice,
              create.gasLimit,
              create.value
            )
          }
          TestEventType.ERC20_TRANSFER -> {
            val transfer = event as ERC20Transfer
            blockchain.callFunction(
              transfer.from,
              transfer.contractAddress,
              transfer.contract,
              "transfer",
              transfer.gasPrice,
              transfer.gasLimit,
              null,
              transfer.to,
              transfer.amount
            )
          }
          TestEventType.ERC721_TRANSFER -> TODO()
        }
      }

      // create block and publish
      val block = blockchain.createBlock()
      publisher.publish(block.keyRecord(), block, true)
    }
  }
}

object TestScenarioOne : TestScenario() {

  override val premineBalances = mapOf(
    Bob.address.data20() to 1000.ether(),
    Alice.address.data20() to 1000.ether(),
    Terence.address.data20() to 1000.ether()
  )

  override val blockEvents = listOf(
    listOf(
      EtherTransfer(Bob, Alice, 1.ether()),
      EtherTransfer(Alice, Terence, 125.gwei()),
      EtherTransfer(Terence, Bob, 375.mwei())
    )
  )
}
