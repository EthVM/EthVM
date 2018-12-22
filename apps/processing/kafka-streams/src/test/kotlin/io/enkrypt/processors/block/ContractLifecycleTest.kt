package io.enkrypt.processors.block

import io.enkrypt.common.extensions.*
import io.enkrypt.kafka.streams.models.ChainEvent
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.util.*
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.ethereum.crypto.ECKey
import java.math.BigInteger

class ContractLifecycleTest : BehaviorSpec() {

  val coinbase = ECKey()
  val bob = ECKey()

  private val premineBalances = mapOf(
    bob.address.data20() to 20.ether()
  )

  val bcConfig = StandaloneBlockchain.Config(
    gasLimit = 31000,
    gasPrice = 1.gwei().toLong(),
    premineBalances = premineBalances,
    coinbase = coinbase.address.data20()!!
  )

  val bc = StandaloneBlockchain(bcConfig)

  init {

    given("a contract with a self destruct function") {

      val testContract = TestContracts.SELF_DESTRUCTS.contractFor("LazySuicide")

      `when`("we instantiate it") {

        val tx = bc.submitContract(bob, testContract, gasLimit = 500_000)
        val contractAddress = SolidityContract.contractAddress(bob, tx.nonce).data20()

        val blockRecord = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(blockRecord)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a fungible ether transfer for the coinbase") {
          checkCoinbase(chainEvents.first(), 3000058769.gwei())
        }

        then("there should be a contract creation event") {
          val creation = chainEvents[1].contractCreate
          creation.getAddress() shouldBe contractAddress
          creation.getData().hex() shouldBe testContract.bin
          creation.getCreator() shouldBe bob.address.data20()
          creation.getBlockHash() shouldBe blockRecord.getHeader().getHash()
          creation.getTxHash() shouldBe blockRecord.getTransactions().first().getHash()
          creation.getReverse() shouldBe false
        }

      }

      `when`("we instantiate it with ether") {

        val tx = bc.submitContract(bob, testContract, gasLimit = 500_000, value = 10.gwei())
        val contractAddress = SolidityContract.contractAddress(bob, tx.nonce).data20()

        val blockRecord = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(blockRecord)

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a fungible ether transfer for the coinbase") {
          checkCoinbase(chainEvents.first(), 3000058769.gwei())
        }

        then("there should be a contract creation event") {
          val creation = chainEvents[1].contractCreate
          creation.getAddress() shouldBe contractAddress
          creation.getData().hex() shouldBe testContract.bin
          creation.getCreator() shouldBe bob.address.data20()
          creation.getBlockHash() shouldBe blockRecord.getHeader().getHash()
          creation.getTxHash() shouldBe blockRecord.getTransactions().first().getHash()
          creation.getReverse() shouldBe false
        }

        then("there should be a fungible transfer event") {
          val transfer = chainEvents[2].fungibleTransfer
          transfer.getFrom() shouldBe bob.address.data20()
          transfer.getTo() shouldBe contractAddress
          transfer.getContract() shouldBe null
          transfer.amountBI shouldBe 10.gwei()
          transfer.getReverse() shouldBe false
        }

      }

      `when`("we ask it to self destruct") {

        val tx = bc.submitContract(bob, testContract, gasLimit = 500_000, value = 35.gwei())
        bc.createBlock()

        val contractAddress = SolidityContract.contractAddress(bob, tx.nonce).data20()!!

        bc.callFunction(bob, contractAddress, testContract, "killYourself")

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a fungible ether transfer for the coinbase") {
          checkCoinbase(chainEvents.first(), 3000010690.gwei())
        }

        then("there should be a contract suicide event") {
          val suicide = chainEvents[1].contractDestruct
          suicide.getAddress() shouldBe contractAddress
          suicide.getBlockHash() shouldBe block.getHeader().getHash()
          suicide.getTxHash() shouldBe block.getTransactions().first().getHash()
          suicide.getReverse() shouldBe false
        }

        then("there should be a fungible transfer to the sender with the contract balance") {
          val transfer = chainEvents[2].fungibleTransfer
          transfer.getFrom() shouldBe contractAddress
          transfer.getTo() shouldBe bob.address.data20()
          transfer.amountBI shouldBe 35.gwei()
          transfer.getReverse() shouldBe false
        }


      }
    }

  }

  private fun checkCoinbase(event: ChainEvent, reward: BigInteger) {
    val coinbaseTransfer = event.fungibleTransfer
    coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
    coinbaseTransfer.getTo() shouldBe coinbase.address.data20()
    coinbaseTransfer.amountBI shouldBe reward
  }
}
