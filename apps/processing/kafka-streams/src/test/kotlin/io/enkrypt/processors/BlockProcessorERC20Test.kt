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
import io.enkrypt.di.TestModules.testBlockchain
import io.enkrypt.di.TestModules.testConfig
import io.enkrypt.di.TestModules.testDrivers
import io.enkrypt.kafka.streams.di.Modules.kafkaStreams
import io.enkrypt.kafka.streams.models.StaticAddresses.EtherZero
import io.enkrypt.util.KafkaStreamsTestListener
import io.enkrypt.util.KafkaUtil.readContractCreation
import io.enkrypt.util.KafkaUtil.readFungibleTokenMovement
import io.enkrypt.util.SolidityContract
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.StandaloneBlockchain.Companion.Alice
import io.enkrypt.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.util.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.util.TestContracts
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.ConsumerRecordFactory
import org.koin.standalone.StandAloneContext.startKoin
import org.koin.standalone.StandAloneContext.stopKoin

class BlockProcessorERC20Test : BehaviorSpec() {

  override fun listeners() = listOf(KafkaStreamsTestListener)

  init {

    stopKoin()

    val koin = startKoin(listOf(testConfig, kafkaStreams, testDrivers, testBlockchain))
    val kc = koin.koinContext

    val testDriver = kc.get<TopologyTestDriver>(name = "blockProcessorDriver")

    val blockRecordFactory = kc.get<ConsumerRecordFactory<BlockKeyRecord, BlockRecord>>()
    val bc = kc.get<StandaloneBlockchain>()

    // TODO test genesis block

    val contract = TestContracts.ERC20.contractFor("TestERC20Token")
    val contractAddress = SolidityContract.contractAddress(Bob, 0L).data20()!!

    given("a block which creates an ERC20 contract that mints tokens on construction") {

      bc.submitContract(Bob, contract, gasLimit = 1.gwei().toLong())
      val block = bc.createBlock()

      `when`("we publish it") {

        testDriver.pipeInput(blockRecordFactory.create(block.keyRecord(), block))

        then("there should be a token movement assigning ether to the miner") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(3.ether().byteBuffer())
        }

        then("there should be a token movement deducting the tx fee from the sender") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Bob.address.data20())
          record.value() shouldBe tokenBalance(141103900.gwei().negate().byteBuffer())
        }

        then("there should be a token movement adding the tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(141103900.gwei().byteBuffer())
        }

        then("there should be a contract creation") {
          val record = readContractCreation(testDriver)
          record.key() shouldBe contractKey(contractAddress)
          record.value() shouldBe contractCreation(
            ContractType.ERC20,
            contractAddress,
            Bob.address.data20(),
            block.getHeader().getHash(),
            block.getTransactions()[0].getHash(),
            block.getTransactions()[0].getInput()
          )
        }

        // TODO is the zero address typically used as the from in mintable ERC20 tokens?

        then("there should be a token movement deducting tokens from the zero address") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(EtherZero, contractAddress)
          record.value() shouldBe tokenBalance(10_000.ether().negate().byteBuffer())
        }

        then("there should be a token movement assigning tokens to the creator address") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Bob.address.data20(), contractAddress)
          record.value() shouldBe tokenBalance(10_000.ether().byteBuffer())
        }

      }

    }

    given("a block which transfers some tokens from Bob to Alice") {

      bc.callFunction(Bob, contractAddress, contract, "transfer", null, 1.gwei().toLong(), null, Alice.address, 1.ether())
      val block = bc.createBlock()

      `when`("we publish it") {

        testDriver.pipeInput(blockRecordFactory.create(block.keyRecord(), block))

        then("there should be a token movement assigning ether to the miner") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(3.ether().byteBuffer())
        }

        then("there should be a token movement deducting the tx fee from Bob") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Bob.address.data20())
          record.value() shouldBe tokenBalance(5164900.gwei().negate().byteBuffer())
        }

        then("there should be a token movement adding the tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(5164900.gwei().byteBuffer())
        }

        then("there should be a token movement deducting tokens from Bob") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Bob.address.data20(), contractAddress)
          record.value() shouldBe tokenBalance(1.ether().negate().byteBuffer())
        }

        then("there should be a token movement assigning tokens to Alice") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Alice.address.data20(), contractAddress)
          record.value() shouldBe tokenBalance(1.ether().byteBuffer())
        }

      }

    }

    // TODO test pre-approved transfer
  }

}
