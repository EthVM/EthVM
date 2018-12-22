package io.enkrypt.processors.block

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.amountBI
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.util.Blockchains
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.TestEthereumListener
import io.kotlintest.matchers.collections.shouldContainExactly
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class FungibleTokenTransferTest : BehaviorSpec() {

  private val premineBalances = mapOf(
    Blockchains.Users.Bob.address.data20() to 20.ether(),
    Blockchains.Users.Alice.address.data20() to 50.ether(),
    Blockchains.Users.Terence.address.data20() to 100.ether()
  )

  val bcConfig = StandaloneBlockchain.Config(
    gasLimit = 21000,
    gasPrice = 1.gwei().toLong(),
    premineBalances = premineBalances,
    coinbase = Blockchains.Coinbase.address.data20()!!
  )

  val bc = StandaloneBlockchain(bcConfig)

  init {

    given("a block with a series of valid ether transfers") {

      bc.sendEther(Blockchains.Users.Bob, Blockchains.Users.Alice, 50.gwei())
      bc.sendEther(Blockchains.Users.Alice, Blockchains.Users.Terence, 25.gwei())
      bc.sendEther(Blockchains.Users.Terence, Blockchains.Users.Bob, 125.gwei())

      val block = bc.createBlock()

      `when`("we convert the block") {

        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 4 chain events") {
          chainEvents.size shouldBe 4
        }

        then("there should be a fungible ether transfer for the coinbase") {
          val coinbaseTransfer = chainEvents.first().fungibleTransfer
          coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
          coinbaseTransfer.getTo() shouldBe Blockchains.Coinbase.address.data20()
          coinbaseTransfer.amountBI shouldBe 3000063000000000000.toBigInteger()
          coinbaseTransfer.getReverse() shouldBe false
        }

        then("there should be 3 fungible ether transfers between bob, alice and terence") {

          val bobToAlice = chainEvents[1].fungibleTransfer
          bobToAlice.getFrom() shouldBe Blockchains.Users.Bob.address.data20()
          bobToAlice.getTo() shouldBe Blockchains.Users.Alice.address.data20()
          bobToAlice.amountBI shouldBe 50.gwei()
          bobToAlice.getReverse() shouldBe false

          val aliceToTerence = chainEvents[2].fungibleTransfer
          aliceToTerence.getFrom() shouldBe Blockchains.Users.Alice.address.data20()
          aliceToTerence.getTo() shouldBe Blockchains.Users.Terence.address.data20()
          aliceToTerence.amountBI shouldBe 25.gwei()
          aliceToTerence.getReverse() shouldBe false

          val terenceToBob = chainEvents[3].fungibleTransfer
          terenceToBob.getFrom() shouldBe Blockchains.Users.Terence.address.data20()
          terenceToBob.getTo() shouldBe Blockchains.Users.Bob.address.data20()
          terenceToBob.amountBI shouldBe 125.gwei()
          terenceToBob.getReverse() shouldBe false
        }
      }

      `when`("we reverse the block") {

        val chainEvents = ChainEvents.forBlock(block)

        val reverseBlockRecord = BlockRecord.newBuilder(block)
          .setReverse(true)
          .build()

        val reversedChainEvents = ChainEvents.forBlock(reverseBlockRecord)

        then("there should be 4 chain events") {
          reversedChainEvents.size shouldBe 4
        }

        then("the chain events should be in reverse order") {
          chainEvents.map { it.reverse() }.asReversed() shouldContainExactly reversedChainEvents
        }

        then("there should be a reversed fungible ether transfer for the coinbase") {
          val coinbaseTransfer = reversedChainEvents.last().fungibleTransfer
          coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
          coinbaseTransfer.getTo() shouldBe Blockchains.Coinbase.address.data20()
          coinbaseTransfer.amountBI shouldBe 3000063000000000000.toBigInteger()
          coinbaseTransfer.getReverse() shouldBe true
        }

        then("there should be a reversed fungible ether transfer for each originating transfer") {

          val bobToAlice = reversedChainEvents[2].fungibleTransfer
          bobToAlice.getFrom() shouldBe Blockchains.Users.Bob.address.data20()
          bobToAlice.getTo() shouldBe Blockchains.Users.Alice.address.data20()
          bobToAlice.amountBI shouldBe 50.gwei()
          bobToAlice.getReverse() shouldBe true

          val aliceToTerence = reversedChainEvents[1].fungibleTransfer
          aliceToTerence.getFrom() shouldBe Blockchains.Users.Alice.address.data20()
          aliceToTerence.getTo() shouldBe Blockchains.Users.Terence.address.data20()
          aliceToTerence.amountBI shouldBe 25.gwei()
          aliceToTerence.getReverse() shouldBe true

          val terenceToBob = reversedChainEvents[0].fungibleTransfer
          terenceToBob.getFrom() shouldBe Blockchains.Users.Terence.address.data20()
          terenceToBob.getTo() shouldBe Blockchains.Users.Bob.address.data20()
          terenceToBob.amountBI shouldBe 125.gwei()
          terenceToBob.getReverse() shouldBe true
        }
      }
    }

    given("a block with some invalid ether transfers") {

      bc.sendEther(Blockchains.Users.Bob, Blockchains.Users.Alice, 100.ether())
      bc.sendEther(Blockchains.Users.Alice, Blockchains.Users.Terence, 56.gwei())
      bc.sendEther(Blockchains.Users.Terence, Blockchains.Users.Bob, 200.ether())

      val block = bc.createBlock()

      `when`("we convert the block") {

        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a fungible ether transfer for the coinbase") {
          val coinbaseTransfer = chainEvents.first().fungibleTransfer
          coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
          coinbaseTransfer.getTo() shouldBe Blockchains.Coinbase.address.data20()
          coinbaseTransfer.amountBI shouldBe 3000021000000000000.toBigInteger()
        }

        then("there should be a single transfer from alice to terence") {
          val aliceToTerence = chainEvents[1].fungibleTransfer
          aliceToTerence.getFrom() shouldBe Blockchains.Users.Alice.address.data20()
          aliceToTerence.getTo() shouldBe Blockchains.Users.Terence.address.data20()
          aliceToTerence.amountBI shouldBe 56.gwei()
        }
      }
    }
  }
}
