package io.enkrypt.kafka.streams.processors.block

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.data32
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.txFees
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.processors.block.ChainEvents.blockReward
import io.enkrypt.kafka.streams.processors.block.ChainEvents.fungibleTransfer
import io.enkrypt.testing.StandaloneBlockchain
import io.enkrypt.testing.StandaloneBlockchain.Companion.Alice
import io.enkrypt.testing.StandaloneBlockchain.Companion.Bob
import io.enkrypt.testing.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.testing.StandaloneBlockchain.Companion.Terence
import io.kotlintest.matchers.collections.shouldContainExactly
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class EtherTransferChainEventsTest : BehaviorSpec() {

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

      val txZero = bc.sendEther(Bob, Alice, 50.gwei())
      val txOne = bc.sendEther(Alice, Terence, 25.gwei())
      val txTwo = bc.sendEther(Terence, Bob, 125.gwei())

      val block = bc.createBlock()

      val blockHeader = block.getHeader()
      val timestamp = blockHeader.getTimestamp()
      val blockHash = blockHeader.getHash()

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
            block.txFees()[0].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txZero.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 0
          ) // tx fee
          chainEvents[2] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            Alice.address.data20()!!,
            50.gwei().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txZero.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 0
          )
        }

        then("there should be an ether transfer between alice and terence") {
          chainEvents[3] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[1].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txOne.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 1
          ) // tx fee
          chainEvents[4] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Terence.address.data20()!!,
            25.gwei().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txOne.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 1
          )
        }

        then("there should be an ether transfer between terence and bob") {
          chainEvents[5] shouldBe fungibleTransfer(
            Terence.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[2].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txTwo.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 2
          ) // tx fee
          chainEvents[6] shouldBe fungibleTransfer(
            Terence.address.data20()!!,
            Bob.address.data20()!!,
            125.gwei().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txTwo.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 2
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
            fungibleTransfer(Bob.address.data20()!!, Coinbase.address.data20()!!, 21000.gwei().unsignedByteBuffer()!!, true, null, timestamp, blockHash, txZero.hash.data32(), 0, transferType = BalanceType.ETHER),
            fungibleTransfer(Bob.address.data20()!!, Alice.address.data20()!!, 50.gwei().unsignedByteBuffer()!!, true, null, timestamp, blockHash, txZero.hash.data32(), 0, transferType = BalanceType.ETHER),
            fungibleTransfer(Alice.address.data20()!!, Coinbase.address.data20()!!, 21000.gwei().unsignedByteBuffer()!!, true, null, timestamp, blockHash, txOne.hash.data32(), 1, transferType = BalanceType.ETHER),
            fungibleTransfer(Alice.address.data20()!!, Terence.address.data20()!!, 25.gwei().unsignedByteBuffer()!!, true, null, timestamp, blockHash, txOne.hash.data32(), 1, transferType = BalanceType.ETHER),
            fungibleTransfer(Terence.address.data20()!!, Coinbase.address.data20()!!, 21000.gwei().unsignedByteBuffer()!!, true, null, timestamp, blockHash, txTwo.hash.data32(), 2, transferType = BalanceType.ETHER),
            fungibleTransfer(Terence.address.data20()!!, Bob.address.data20()!!, 125.gwei().unsignedByteBuffer()!!, true, null, timestamp, blockHash, txTwo.hash.data32(), 2, transferType = BalanceType.ETHER)
          ).asReversed()
        }
      }
    }

    given("a block with some invalid ether transfers") {

      val txZero = bc.sendEther(Bob, Alice, 100.ether())
      val txOne = bc.sendEther(Alice, Terence, 56.gwei())
      val txTwo = bc.sendEther(Terence, Bob, 200.ether())

      val block = bc.createBlock()

      val blockHeader = block.getHeader()
      val timestamp = blockHeader.getTimestamp()
      val blockHash = blockHeader.getHash()

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
            block.txFees()[0].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txZero.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 0
          ) // tx fee
        }

        then("there should be a tx fee for Alice") {
          chainEvents[2] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[1].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txOne.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 1
          ) // tx fee
        }

        then("there should be an ether transfer from alice to terence") {
          chainEvents[3] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Terence.address.data20()!!,
            56.gwei().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txOne.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 1
          )
        }

        then("there should be a tx fee for Terence") {
          chainEvents[4] shouldBe fungibleTransfer(
            Terence.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[2].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txTwo.hash.data32(),
            transferType = BalanceType.ETHER,
            txIndex = 2
          ) // tx fee
        }
      }
    }
  }
}
