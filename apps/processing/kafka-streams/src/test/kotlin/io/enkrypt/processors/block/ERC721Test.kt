package io.enkrypt.processors.block

import io.enkrypt.avro.common.ContractType
import io.enkrypt.common.extensions.*
import io.enkrypt.kafka.streams.models.ChainEvent
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.models.StaticAddresses.EtherZero
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.util.Blockchains.Coinbase
import io.enkrypt.util.Blockchains.Users.Alice
import io.enkrypt.util.Blockchains.Users.Bob
import io.enkrypt.util.Blockchains.Users.Terence
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.TestContracts
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class ERC721Test : BehaviorSpec() {

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

      val tx = bc.submitContract(Bob, contract, gasLimit = 1.gwei().toLong())
      val contractAddress = tx.contractAddress.data20()!!

      `when`("we instantiate it") {

        val createBlock = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(createBlock)

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a fungible ether transfer for the coinbase") {
          chainEvents.first() shouldBe ChainEvent.fungibleTransfer(EtherZero, Coinbase.address.data20()!!, 3002909450.gwei().byteBuffer()!!)
        }

        then("there should be a transaction fee ether transfer") {
          chainEvents[1] shouldBe ChainEvent.fungibleTransfer(Bob.address.data20()!!, EtherZero, 2909450.gwei().byteBuffer()!!)
        }

        then("there should be a contract creation event with type ERC721") {
          chainEvents[2] shouldBe ChainEvent.contractCreate(
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

      val createBlock = bc.createBlock()

      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Bob.address, 1.toBigInteger().unsignedByteArray())
      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Alice.address, 2.toBigInteger().unsignedByteArray())
      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Terence.address, 3.toBigInteger().unsignedByteArray())

      val mintBlock = bc.createBlock()

      `when`("Bob transfers token 1 to Alice") {

        bc.callFunction(Bob, contractAddress, contract, "safeTransferFrom", null, 1.gwei().toLong(), null, Bob.address, Alice.address, 1)

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a fungible ether transfer for the coinbase") {
          chainEvents.first() shouldBe ChainEvent.fungibleTransfer(EtherZero, Coinbase.address.data20()!!, 3000055490.gwei().byteBuffer()!!)
        }

        then("there should be a transaction fee ether transfer") {
          // TODO fix me, tx fee seems to be negative
          chainEvents[1] shouldBe ChainEvent.fungibleTransfer(Bob.address.data20()!!, EtherZero, 70490.gwei().byteBuffer()!!)
        }

        then("there should a token transfer to token from Bob to Alice") {
          // TODO fix encoding issues with unsigned big integers
          chainEvents[2] shouldBe ChainEvent.nonFungibleTransfer(contractAddress, Bob.address.data20()!!, Alice.address.data20()!!, 1.toBigInteger().unsignedByteBuffer()!!)
        }
      }

    }

  }


}
