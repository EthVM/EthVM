package io.enkrypt.processors.block

import io.enkrypt.avro.common.ContractType
import io.enkrypt.common.extensions.*
import io.enkrypt.kafka.streams.models.ChainEvent
import io.enkrypt.kafka.streams.models.ChainEvent.Companion.fungibleTransfer
import io.enkrypt.kafka.streams.models.StaticAddresses.EtherZero
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.util.Blockchains
import io.enkrypt.util.Blockchains.Coinbase
import io.enkrypt.util.Blockchains.Users.Alice
import io.enkrypt.util.Blockchains.Users.Bob
import io.enkrypt.util.Blockchains.Users.Terence
import io.enkrypt.util.SolidityContract
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.TestContracts
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import mu.KotlinLogging

class ERC20Test : BehaviorSpec() {

  private val logger = KotlinLogging.logger {}

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

    val contract = TestContracts.ERC20.contractFor("TestERC20Token")

    given("an ERC20 compliant contract") {

      val tx = bc.submitContract(Bob, contract, gasLimit = 1.gwei().toLong())
      val contractAddress = tx.contractAddress.data20()!!
      val createBlock = bc.createBlock()

      // TODO test: No gas to return just created contract. We don't seem to get any indication of failure in the tx receipt

      `when`("we instantiate it") {

        val chainEvents = ChainEvents.forBlock(createBlock)

        then("there should be 4 chain events") {
          chainEvents.size shouldBe 4
        }

        then("there should be a fungible ether transfer for the coinbase") {
          chainEvents.first() shouldBe fungibleTransfer(EtherZero, Coinbase.address.data20()!!, 3001378099.gwei().byteBuffer()!!)
        }

        then("there should be a transaction fee ether transfer") {
          chainEvents[1] shouldBe fungibleTransfer(Bob.address.data20()!!, EtherZero, 1378099.gwei().byteBuffer()!!)
        }

        then("there should be a contract creation event") {
          chainEvents[2] shouldBe ChainEvent.contractCreate(
            ContractType.ERC20,
            Bob.address.data20()!!,
            createBlock.getHeader().getHash(),
            createBlock.getTransactions().first().getHash(),
            contractAddress,
            contract.bin.hexBuffer()!!
          )
        }

        then("there should be an ERC20 fungible transfer corresponding to the initial mint") {
          chainEvents[3] shouldBe fungibleTransfer(EtherZero, Bob.address.data20()!!, 10_000.ether().byteBuffer()!!, contract = contractAddress)
        }
      }

      `when`("we transfer some tokens from Bob to Alice") {

        bc.callFunction(Bob, contractAddress, contract, "transfer", null, 1.gwei().toLong(), null, Alice.address, 1.ether().unsignedByteArray())

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a fungible ether transfer for the coinbase") {
          chainEvents.first() shouldBe fungibleTransfer(EtherZero, Coinbase.address.data20()!!, 3000051349.gwei().byteBuffer()!!)
        }

        then("there should be a transaction fee ether transfer") {
          // TODO fix me, tx fee seems to be negative
          chainEvents[1] shouldBe fungibleTransfer(Bob.address.data20()!!, EtherZero, 1378099.gwei().byteBuffer()!!)
        }

        then("there should be a token transfer from Bob to Alice") {
          chainEvents[2] shouldBe fungibleTransfer(Bob.address.data20()!!, Alice.address.data20()!!, 1.ether().byteBuffer()!!, contract = contractAddress)
        }
      }

    }

    given("a pre-approved token transfer from Bob to Terence") {

      val tx = bc.submitContract(Bob, contract, gasLimit = 1.gwei().toLong())
      val contractAddress = tx.contractAddress.data20()!!
      bc.createBlock()

      bc.callFunction(Bob, contractAddress, contract, "approve", null, 1.gwei().toLong(), null, Terence.address, 1.ether().unsignedByteArray())
      bc.createBlock()

      `when`("Terence attempts to transfer a portion of the allowance") {

        bc.callFunction(
          Terence,
          contractAddress,
          contract,
          "transferFrom",
          null, 100.kwei().toLong(), null,
          Bob.address, Terence.address, 1.finney().unsignedByteArray()
        )

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 3 events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a fungible ether transfer for the coinbase") {
          chainEvents.first() shouldBe fungibleTransfer(EtherZero, Coinbase.address.data20()!!, 3000060232.gwei().byteBuffer()!!)
        }

        then("there should be a transaction fee ether transfer") {
          // TODO fix me, tx fee seems to be negative
          chainEvents[1] shouldBe fungibleTransfer(Terence.address.data20()!!, EtherZero, 1378099.gwei().byteBuffer()!!)
        }

        then("there should be a token transfer from Bob to Terence") {
          chainEvents[2] shouldBe fungibleTransfer(Bob.address.data20()!!, Terence.address.data20()!!, 1.finney().byteBuffer()!!, contract = contractAddress)
        }

      }

      `when`("Terence attempts to transfer the remainder of the allowance") {

        bc.callFunction(
          Terence,
          contractAddress,
          contract,
          "transferFrom",
          null, 100.kwei().toLong(), null,
          Bob.address, Terence.address, 999.finney().unsignedByteArray()
        )

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 3 events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a fungible ether transfer for the coinbase") {
          chainEvents.first() shouldBe fungibleTransfer(EtherZero, Coinbase.address.data20()!!, 3000030296.gwei().byteBuffer()!!)
        }

        then("there should be a transaction fee ether transfer") {
          // TODO fix me, tx fee seems to be negative
          chainEvents[1] shouldBe fungibleTransfer(Terence.address.data20()!!, EtherZero, 30296.gwei().byteBuffer()!!)
        }

        then("there should be a token transfer from Bob to Terence") {
          chainEvents[2] shouldBe fungibleTransfer(Bob.address.data20()!!, Terence.address.data20()!!, 999.finney().byteBuffer()!!, contract = contractAddress)
        }

      }

      `when`("Terence attempts to transfer more than his allowance") {

        // TODO implement

      }
    }

  }


}
