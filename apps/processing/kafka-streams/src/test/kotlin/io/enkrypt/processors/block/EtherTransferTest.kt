package io.enkrypt.processors.block

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.txFees
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.kafka.streams.processors.block.ChainEvents.blockReward
import io.enkrypt.kafka.streams.processors.block.ChainEvents.fungibleTransfer
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.StandaloneBlockchain.Companion.Alice
import io.enkrypt.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.util.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.util.StandaloneBlockchain.Companion.Terence
import io.enkrypt.util.totalTxFees
import io.enkrypt.util.txFees
import io.kotlintest.matchers.collections.shouldContainExactly
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class EtherTransferTest : BehaviorSpec() {

  private val premineBalances = mapOf(
    Bob.address.data20() to 20.ether(),
    Alice.address.data20() to 50.ether(),
    Terence.address.data20() to 100.ether()
  )

  private val bcConfig = StandaloneBlockchain.Config(
    gasLimit = 21000,
    gasPrice = 1.gwei().toLong(),
    premineBalances = premineBalances,
    coinbase = Coinbase.address.data20()!!
  )

  val bc = StandaloneBlockchain(bcConfig)

  init {

    given("a block with a series of valid ether transfers") {

      bc.sendEther(Bob, Alice, 50.gwei())
      bc.sendEther(Alice, Terence, 25.gwei())
      bc.sendEther(Terence, Bob, 125.gwei())

      val block = bc.createBlock()

      `when`("we convert the block") {

        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 7 chain events") {
          chainEvents.size shouldBe 7
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }

        then("there should be an ether transfer between bob and alice") {
          chainEvents[1] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[0].unsignedByteBuffer()!!
          ) // tx fee
          chainEvents[2] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            Alice.address.data20()!!,
            50.gwei().unsignedByteBuffer()!!
          )
        }

        then("there should be an ether transfer between alice and terence") {
          chainEvents[3] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[1].unsignedByteBuffer()!!
          ) // tx fee
          chainEvents[4] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Terence.address.data20()!!,
            25.gwei().unsignedByteBuffer()!!
          )
        }

        then("there should be an ether transfer between terence and bob") {
          chainEvents[5] shouldBe fungibleTransfer(
            Terence.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[2].unsignedByteBuffer()!!
          ) // tx fee
          chainEvents[6] shouldBe fungibleTransfer(
            Terence.address.data20()!!,
            Bob.address.data20()!!,
            125.gwei().unsignedByteBuffer()!!
          )
        }
      }

      `when`("we reverse the block") {

        val reverseBlockRecord = BlockRecord.newBuilder(block)
          .setReverse(true)
          .build()

        val reversedChainEvents = ChainEvents.forBlock(reverseBlockRecord)

        then("there should be 7 chain events") {
          reversedChainEvents.size shouldBe 7
        }

        then("there should be a reversed fungible ether transfer for each originating transfer") {

          reversedChainEvents shouldContainExactly listOf(
            blockReward(Coinbase.address.data20()!!, 3.ether().unsignedByteBuffer()!!, true),
            fungibleTransfer(Bob.address.data20()!!, Coinbase.address.data20()!!, 21000.gwei().unsignedByteBuffer()!!, true),
            fungibleTransfer(Bob.address.data20()!!, Alice.address.data20()!!, 50.gwei().unsignedByteBuffer()!!, true),
            fungibleTransfer(Alice.address.data20()!!, Coinbase.address.data20()!!, 21000.gwei().unsignedByteBuffer()!!, true),
            fungibleTransfer(Alice.address.data20()!!, Terence.address.data20()!!, 25.gwei().unsignedByteBuffer()!!, true),
            fungibleTransfer(Terence.address.data20()!!, Coinbase.address.data20()!!, 21000.gwei().unsignedByteBuffer()!!, true),
            fungibleTransfer(Terence.address.data20()!!, Bob.address.data20()!!, 125.gwei().unsignedByteBuffer()!!, true)
          ).asReversed()
        }
      }
    }

    given("a block with some invalid ether transfers") {

      bc.sendEther(Bob, Alice, 100.ether())
      bc.sendEther(Alice, Terence, 56.gwei())
      bc.sendEther(Terence, Bob, 200.ether())

      val block = bc.createBlock()

      `when`("we convert the block") {

        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 5 chain events") {
          chainEvents.size shouldBe 5
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }

        then("there should be a tx fee for Bob") {
          chainEvents[1] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[0].unsignedByteBuffer()!!
          ) // tx fee
        }

        then("there should be a tx fee for Alice") {
          chainEvents[2] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[1].unsignedByteBuffer()!!
          ) // tx fee
        }

        then("there should be an ether transfer from alice to terence") {
          chainEvents[3] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Terence.address.data20()!!,
            56.gwei().unsignedByteBuffer()!!
          )
        }

        then("there should be a tx fee for Terence") {
          chainEvents[4] shouldBe fungibleTransfer(
            Terence.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[2].unsignedByteBuffer()!!
          ) // tx fee
        }
      }
    }
  }
}
