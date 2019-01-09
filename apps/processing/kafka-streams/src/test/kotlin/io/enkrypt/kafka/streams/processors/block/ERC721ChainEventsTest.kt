package io.enkrypt.kafka.streams.processors.block

import io.enkrypt.avro.common.ContractType
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.data32
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.hexBuffer
import io.enkrypt.common.extensions.txFees
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.processors.block.ChainEvents.blockReward
import io.enkrypt.kafka.streams.processors.block.ChainEvents.contractCreate
import io.enkrypt.kafka.streams.processors.block.ChainEvents.fungibleTransfer
import io.enkrypt.kafka.streams.processors.block.ChainEvents.erc721Transfer
import io.enkrypt.testing.StandaloneBlockchain
import io.enkrypt.testing.StandaloneBlockchain.Companion.Alice
import io.enkrypt.testing.StandaloneBlockchain.Companion.Bob
import io.enkrypt.testing.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.testing.StandaloneBlockchain.Companion.Terence
import io.enkrypt.testing.TestContracts
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class ERC721ChainEventsTest : BehaviorSpec() {

  private val premineBalances = mapOf(
    Bob.address.data20() to 20.ether(),
    Alice.address.data20() to 20.ether(),
    Terence.address.data20() to 20.ether()
  )

  private val bcConfig = StandaloneBlockchain.Config(
    gasLimit = 31000,
    gasPrice = 1.gwei().toLong(),
    premineBalances = premineBalances,
    coinbase = Coinbase.address.data20()!!
  )

  val bc = StandaloneBlockchain(bcConfig)

  init {

    val contract = TestContracts.ERC721.contractFor("TestERC721Token")

    given("an ERC721 compliant contract") {

      val createTx = bc.submitContract(Bob, contract, gasLimit = 1.gwei().toLong())
      val contractAddress = createTx.contractAddress.data20()!!

      `when`("we instantiate it") {

        val createBlock = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(createBlock)

        val blockHeader = createBlock.getHeader()
        val timestamp = blockHeader.getTimestamp()
        val blockHash = blockHeader.getHash()
        val txHash = createTx.hash.data32()!!

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }

        then("there should be a transaction fee ether transfer") {
          chainEvents[1] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            Coinbase.address.data20()!!,
            createBlock.txFees()[0].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txHash,
            transferType = BalanceType.ETHER
          )
        }

        then("there should be a contract creation event with type ERC721") {
          chainEvents[2] shouldBe contractCreate(
            ContractType.ERC721,
            Bob.address.data20()!!,
            createBlock.getHeader().getHash(),
            createBlock.getTransactions().first().getHash(),
            contractAddress,
            contract.bin.hexBuffer()!!
          )
        }
      }
    }

    given("some minted token ids") {

      val tx = bc.submitContract(Bob, contract, gasLimit = 1.gwei().toLong())
      val contractAddress = tx.contractAddress.data20()!!

      bc.createBlock()

      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Bob.address, 1.toBigInteger())
      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Alice.address, 2.toBigInteger())
      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Terence.address, 3.toBigInteger())

      bc.createBlock()

      `when`("Bob transfers token 1 to Alice") {

        val transferTx = bc.callFunction(Bob, contractAddress, contract, "safeTransferFrom", null, 1.gwei().toLong(), null, Bob.address, Alice.address, 1)

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        val blockHeader = block.getHeader()
        val timestamp = blockHeader.getTimestamp()
        val blockHash = blockHeader.getHash()
        val txHash = transferTx.hash.data32()!!

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }

        then("there should be a transaction fee ether transfer") {
          chainEvents[1] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[0].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txHash,
            transferType = BalanceType.ETHER
          )
        }

        then("there should a token transfer to token from Bob to Alice") {
          chainEvents[2] shouldBe erc721Transfer(
            contractAddress,
            Bob.address.data20()!!,
            Alice.address.data20()!!,
            1.toBigInteger().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txHash
          )
        }
      }

      `when`("Alice transfers token 2 to Terence") {

        val transferTx = bc.callFunction(Alice, contractAddress, contract, "safeTransferFrom", null, 1.gwei().toLong(), null, Alice.address, Terence.address, 2)

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        val blockHeader = block.getHeader()
        val timestamp = blockHeader.getTimestamp()
        val blockHash = blockHeader.getHash()
        val txHash = transferTx.hash.data32()!!

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }

        then("there should be a transaction fee ether transfer") {
          chainEvents[1] shouldBe fungibleTransfer(
            Alice.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[0].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txHash,
            transferType = BalanceType.ETHER
          )
        }

        then("there should a token transfer to token from Alice to Terence") {
          chainEvents[2] shouldBe erc721Transfer(
            contractAddress,
            Alice.address.data20()!!,
            Terence.address.data20()!!,
            2.toBigInteger().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txHash
          )
        }
      }

      `when`("Terence transfers token 2 to Bob") {

        val transferTx = bc.callFunction(Terence, contractAddress, contract, "safeTransferFrom", null, 1.gwei().toLong(), null, Terence.address, Bob.address, 2)

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        val blockHeader = block.getHeader()
        val timestamp = blockHeader.getTimestamp()
        val blockHash = blockHeader.getHash()
        val txHash = transferTx.hash.data32()!!

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }

        then("there should be a transaction fee ether transfer") {
          // TODO fix me, tx fee seems to be negative
          chainEvents[1] shouldBe fungibleTransfer(
            Terence.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[0].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txHash,
            transferType = BalanceType.ETHER
          )
        }

        then("there should a token transfer to token from Terence to Bob") {
          chainEvents[2] shouldBe erc721Transfer(
            contractAddress,
            Terence.address.data20()!!,
            Bob.address.data20()!!,
            2.toBigInteger().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = txHash
          )
        }
      }
    }
  }
}
