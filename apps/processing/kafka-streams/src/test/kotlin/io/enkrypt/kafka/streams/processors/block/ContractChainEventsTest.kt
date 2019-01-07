package io.enkrypt.kafka.streams.processors.block

import io.enkrypt.avro.common.ContractType
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.data32
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.hexBuffer
import io.enkrypt.common.extensions.txFees
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.processors.block.ChainEvents.blockReward
import io.enkrypt.kafka.streams.processors.block.ChainEvents.contractCreate
import io.enkrypt.kafka.streams.processors.block.ChainEvents.contractDestroy
import io.enkrypt.kafka.streams.processors.block.ChainEvents.fungibleTransfer
import io.enkrypt.kafka.streams.util.SolidityContract
import io.enkrypt.kafka.streams.util.StandaloneBlockchain
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.kafka.streams.util.TestContracts
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec

class ContractChainEventsTest : BehaviorSpec() {

  private val premineBalances = mapOf(
    Bob.address.data20() to 20.ether()
  )

  private val bcConfig = StandaloneBlockchain.Config(
    gasLimit = 250_000,             // Enough to cover most transactions
    gasPrice = 100.gwei().toLong(), // Value chosen to speedup a little bit tests
    premineBalances = premineBalances,
    coinbase = Coinbase.address.data20()!!
  )

  val bc by lazy { StandaloneBlockchain(bcConfig) }

  init {

    given("an empty contract deployment") {

      `when`("we create an empty block") {

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 1 chain event") {
          chainEvents.size shouldBe 1
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }
      }
    }

    given("a contract with a self destruct function") {

      val contract = TestContracts.SELF_DESTRUCTS.contractFor("SelfDestruct")

      `when`("we instantiate it") {

        val tx = bc.submitContract(Bob, contract)
        val contractAddress = tx.contractAddress.data20()

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        val blockHeader = block.getHeader()
        val timestamp = blockHeader.getTimestamp()
        val blockHash = blockHeader.getHash()

        then("there should be 3 chain events") {
          chainEvents.size shouldBe 3
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }

        then("there should be a transaction fee") {
          chainEvents[1] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            Coinbase.address.data20()!!,
            block.txFees()[0].unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = tx.hash.data32()
          )
        }

        then("there should be a contract creation event") {
          chainEvents[2] shouldBe contractCreate(
            ContractType.GENERIC,
            Bob.address.data20()!!,
            blockHeader.getHash(),
            block.getTransactions().first().getHash(),
            contractAddress!!,
            contract.bin.hexBuffer()!!
          )
        }
      }

      `when`("we instantiate it with ether") {

        val tx = bc.submitContract(Bob, contract, value = 10.gwei())
        val contractAddress = tx.contractAddress.data20()

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        val blockHeader = block.getHeader()
        val timestamp = blockHeader.getTimestamp()
        val blockHash = blockHeader.getHash()

        then("there should be 4 chain events") {
          chainEvents.size shouldBe 4
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
            txHash = tx.hash.data32()
          )
        }

        then("there should be a contract creation event") {
          chainEvents[2] shouldBe contractCreate(
            ContractType.GENERIC,
            Bob.address.data20()!!,
            block.getHeader().getHash(),
            block.getTransactions().first().getHash(),
            contractAddress!!,
            contract.bin.hexBuffer()!!
          )
        }

        then("there should be a fungible transfer event for the ether sent") {
          chainEvents[3] shouldBe fungibleTransfer(
            Bob.address.data20()!!,
            contractAddress!!,
            10.gwei().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = tx.hash.data32()
          )
        }
      }

      `when`("we ask it to self destruct") {

        val createTx = bc.submitContract(Bob, contract, value = 35.gwei())
        val contractAddress = createTx.contractAddress.data20()!!

        bc.createBlock()

        val destroyTx = bc.callFunction(Bob, contractAddress, contract, "destroy")

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        val blockHeader = block.getHeader()
        val timestamp = blockHeader.getTimestamp()
        val blockHash = blockHeader.getHash()

        then("there should be 4 chain events") {
          chainEvents.size shouldBe 4
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
            txHash = destroyTx.hash.data32()
          )
        }

        then("there should be a contract destruct event") {
          chainEvents[2] shouldBe contractDestroy(
            block.getHeader().getHash(),
            block.getTransactions().first().getHash(),
            contractAddress
          )
        }

        then("there should be a fungible transfer to the sender with the contract balance") {
          chainEvents[3] shouldBe fungibleTransfer(
            contractAddress,
            Bob.address.data20()!!,
            35.gwei().unsignedByteBuffer()!!,
            timestamp = timestamp,
            blockHash = blockHash,
            txHash = destroyTx.hash.data32()
          )
        }
      }
    }

    given("a ping pong contract with delegating calls") {

      val contract = TestContracts.PING_PONG.contractFor("PingPong")

      val pingTx = bc.submitContract(Bob, contract)
      val pingAddress = SolidityContract.contractAddress(Bob, pingTx.nonce).data20()!!

      val pongTx = bc.submitContract(Bob, contract)
      val pongAddress = SolidityContract.contractAddress(Bob, pongTx.nonce).data20()!!

      bc.createBlock()

      `when`("we trigger a series of cascading calls that only emits events") {

        bc.callFunction(Bob, pingAddress, contract, "start", args = *arrayOf(pongAddress.bytes()))

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }
      }
    }

    given("a contract that tries to run indefinitely in the constructor") {

      val contract = TestContracts.OUT_OF_GAS.contractFor("OutOfGasInConstructor")

      `when`("we try to deploy the contract") {

        bc.submitContract(Bob, contract)

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }
      }
    }

    given("a contract that tries to run indefinitely") {

      val contract = TestContracts.OUT_OF_GAS.contractFor("OutOfGasInMethod")

      val tx = bc.submitContract(Bob, contract)
      val gluttonyAddress = SolidityContract.contractAddress(Bob, tx.nonce).data20()!!

      bc.createBlock()

      `when`("we ask to run indefinitely") {

        bc.callFunction(Bob, gluttonyAddress, contract, "infiniteLoop")

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }
      }
    }

    given("a pair of contracts deployment (one will be successful and the other's not)") {

      val c1 = TestContracts.PING_PONG.contractFor("PingPong")
      bc.submitContract(Bob, c1)

      val c2 = TestContracts.OUT_OF_GAS.contractFor("OutOfGasInConstructor")
      bc.submitContract(Bob, c2)

      `when`("we try to deploy all of them") {

        val block = bc.createBlock()
        val chainEvents = ChainEvents.forBlock(block)

        then("there should be 4 chain events") {
          chainEvents.size shouldBe 4
        }

        then("there should be a block reward for the coinbase") {
          chainEvents.first() shouldBe blockReward(
            Coinbase.address.data20()!!,
            3.ether().unsignedByteBuffer()!!
          )
        }
      }
    }
  }
}
