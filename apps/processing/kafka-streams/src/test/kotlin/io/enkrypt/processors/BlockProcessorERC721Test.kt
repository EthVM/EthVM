package io.enkrypt.processors

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.ContractType
import io.enkrypt.common.extensions.AvroHelpers.contractCreation
import io.enkrypt.common.extensions.AvroHelpers.contractKey
import io.enkrypt.common.extensions.AvroHelpers.tokenBalance
import io.enkrypt.common.extensions.AvroHelpers.tokenKey
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.keyRecord
import io.enkrypt.common.extensions.microEther
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.di.TestModules.testBlockchain
import io.enkrypt.di.TestModules.testConfig
import io.enkrypt.di.TestModules.testDrivers
import io.enkrypt.kafka.streams.di.Modules.kafkaStreams
import io.enkrypt.util.KafkaStreamsTestListener
import io.enkrypt.util.KafkaUtil.readContractCreation
import io.enkrypt.util.KafkaUtil.readFungibleTokenMovement
import io.enkrypt.util.KafkaUtil.readNonFungibleTokenBalance
import io.enkrypt.util.SolidityContract
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.StandaloneBlockchain.Companion.Alice
import io.enkrypt.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.util.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.util.StandaloneBlockchain.Companion.Terence
import io.enkrypt.util.TestContracts
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.ConsumerRecordFactory
import org.koin.standalone.StandAloneContext.startKoin
import org.koin.standalone.StandAloneContext.stopKoin

class BlockProcessorERC721Test : BehaviorSpec() {

  override fun listeners() = listOf(KafkaStreamsTestListener)

  init {

    stopKoin()

    val koin = startKoin(listOf(testConfig, kafkaStreams, testDrivers, testBlockchain))
    val kc = koin.koinContext

    val testDriver = kc.get<TopologyTestDriver>(name = "blockProcessorDriver")

    val blockRecordFactory = kc.get<ConsumerRecordFactory<BlockKeyRecord, BlockRecord>>("blockRecordFactory")
    val bc = kc.get<StandaloneBlockchain>()

    // TODO test genesis block

    val contract = TestContracts.ERC721.contractFor("TestERC721Token")
    val contractAddress = SolidityContract.contractAddress(Bob, 0L).data20()!!

    given("a block which creates an ERC721 contract") {

      bc.submitContract(Bob, contract, gasLimit = 1.gwei().toLong())
      val block = bc.createBlock()

      `when`("we publish it") {

        testDriver.pipeInput(blockRecordFactory.create(block.keyRecord(), block))

        then("there should be a token movement assigning ether to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(3.ether().byteBuffer())
        }

        then("there should be a token movement deducting the tx fee from the sender") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Bob.address.data20())
          record.value() shouldBe tokenBalance(294265.microEther().negate().byteBuffer())
        }

        then("there should be a token movement adding the tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(294265.microEther().byteBuffer())
        }

        then("there should be a contract creation") {
          val record = readContractCreation(testDriver)!!
          record.key() shouldBe contractKey(contractAddress)
          record.value() shouldBe contractCreation(
            ContractType.ERC721,
            contractAddress,
            Bob.address.data20(),
            block.getHeader().getHash(),
            block.getTransactions()[0].getHash(),
            block.getTransactions()[0].getInput()
          )
        }
      }
    }

    given("a block which mints some ERC721 tokens") {

      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Bob.address, 1.toBigInteger())
      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Alice.address, 2.toBigInteger())
      bc.callFunction(Bob, contractAddress, contract, "mint", null, 1.gwei().toLong(), null, Terence.address, 3.toBigInteger())

      val block = bc.createBlock()

      `when`("we publish it") {

        testDriver.pipeInput(blockRecordFactory.create(block.keyRecord(), block))

        then("there should be a token movement assigning ether to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(3.ether().byteBuffer())
        }

        then("there should be a token movement deducting the first tx fee from the sender") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Bob.address.data20())
          record.value() shouldBe tokenBalance(15867200.gwei().negate().byteBuffer())
        }

        then("there should be a token movement adding the first tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(15867200.gwei().byteBuffer())
        }

        then("there should be a token balance assigning token 1 to Bob") {
          val record = readNonFungibleTokenBalance(testDriver)!!
          record.key() shouldBe tokenKey(contract = contractAddress, tokenId = 1.toBigInteger().unsignedByteBuffer())
          record.value() shouldBe tokenBalance(address = Bob.address.data20())
        }

        then("there should be a token movement deducting the second tx fee from the sender") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Bob.address.data20())
          record.value() shouldBe tokenBalance(15867200.gwei().negate().byteBuffer())
        }

        then("there should be a token movement adding the second tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(15867200.gwei().byteBuffer())
        }

        then("there should be a token balance assigning token 2 to Alice") {
          val record = readNonFungibleTokenBalance(testDriver)!!
          record.key() shouldBe tokenKey(contract = contractAddress, tokenId = 2.toBigInteger().unsignedByteBuffer())
          record.value() shouldBe tokenBalance(address = Alice.address.data20())
        }

        then("there should be a token movement deducting the third tx fee from the sender") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Bob.address.data20())
          record.value() shouldBe tokenBalance(15867200.gwei().negate().byteBuffer())
        }

        then("there should be a token movement adding the third tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(15867200.gwei().byteBuffer())
        }

        then("there should be a token balance assigning token 3 to Terence") {
          val record = readNonFungibleTokenBalance(testDriver)!!
          record.key() shouldBe tokenKey(contract = contractAddress, tokenId = 3.toBigInteger().unsignedByteBuffer())
          record.value() shouldBe tokenBalance(address = Terence.address.data20())
        }
      }
    }

    given("a block that transfer token 2 from Alice to Terence") {

      bc.callFunction(Alice, contractAddress, contract, "safeTransferFrom", null, 1.gwei().toLong(), null, Alice.address, Terence.address, 2)
      val block = bc.createBlock()

      `when`("we publish it") {

        testDriver.pipeInput(blockRecordFactory.create(block.keyRecord(), block))

        then("there should be a token movement assigning ether to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(3.ether().byteBuffer())
        }

        then("there should be a token movement deducting the tx fee from the sender") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Alice.address.data20())
          record.value() shouldBe tokenBalance(5797.microEther().negate().byteBuffer())
        }

        then("there should be a token movement adding the tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(5797.microEther().byteBuffer())
        }

        then("there should be a token balance assigning token 2 to Terence") {
          val record = readNonFungibleTokenBalance(testDriver)!!
          record.key() shouldBe tokenKey(contract = contractAddress, tokenId = 2.toBigInteger().unsignedByteBuffer())
          record.value() shouldBe tokenBalance(address = Terence.address.data20())
        }
      }
    }
  }
}
