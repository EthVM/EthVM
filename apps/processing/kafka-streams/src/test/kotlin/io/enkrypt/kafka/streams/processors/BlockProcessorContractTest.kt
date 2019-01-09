package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.ContractType
import io.enkrypt.common.extensions.AvroHelpers.contractCreation
import io.enkrypt.common.extensions.AvroHelpers.contractDestruction
import io.enkrypt.common.extensions.AvroHelpers.contractKey
import io.enkrypt.common.extensions.AvroHelpers.tokenBalance
import io.enkrypt.common.extensions.AvroHelpers.tokenKey
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.keyRecord
import io.enkrypt.common.extensions.microEther
import io.enkrypt.kafka.streams.di.Modules.kafkaStreams
import io.enkrypt.kafka.streams.di.TestModules.testBlockchain
import io.enkrypt.kafka.streams.di.TestModules.testConfig
import io.enkrypt.kafka.streams.di.TestModules.testDrivers
import io.enkrypt.kafka.streams.util.KafkaStreamsTestListener
import io.enkrypt.kafka.streams.util.KafkaUtil.readContractCreation
import io.enkrypt.kafka.streams.util.KafkaUtil.readContractDestruction
import io.enkrypt.kafka.streams.util.KafkaUtil.readFungibleTokenMovement
import io.enkrypt.testing.SolidityContract
import io.enkrypt.testing.StandaloneBlockchain
import io.enkrypt.testing.StandaloneBlockchain.Companion.Alice
import io.enkrypt.testing.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.testing.TestContracts
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.ConsumerRecordFactory
import org.koin.standalone.StandAloneContext.startKoin
import org.koin.standalone.StandAloneContext.stopKoin

class BlockProcessorContractTest : BehaviorSpec() {

  override fun listeners() = listOf(KafkaStreamsTestListener)

  init {

    stopKoin()

    val koin = startKoin(listOf(testConfig, kafkaStreams, testDrivers, testBlockchain))
    val kc = koin.koinContext

    val testDriver = kc.get<TopologyTestDriver>(name = "blockProcessorDriver")

    val blockRecordFactory = kc.get<ConsumerRecordFactory<BlockKeyRecord, BlockRecord>>("blockRecordFactory")
    val bc = kc.get<StandaloneBlockchain>()

    // TODO test genesis block

    val contract = TestContracts.SELF_DESTRUCTS.contractFor("SelfDestruct")
    val contractAddress = SolidityContract.contractAddress(Alice, 0L).data20()!!

    given("a block with a contract creation") {

      bc.submitContract(Alice, contract)
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
          record.value() shouldBe tokenBalance(9076900.gwei().negate().byteBuffer())
        }

        then("there should be a token movement adding the tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(9076900.gwei().byteBuffer())
        }

        then("there should be a contract creation") {
          val record = readContractCreation(testDriver)!!
          record.key() shouldBe contractKey(contractAddress)
          record.value() shouldBe contractCreation(
            ContractType.GENERIC,
            contractAddress,
            Alice.address.data20(),
            block.getHeader().getHash(),
            block.getTransactions()[0].getHash(),
            block.getTransactions()[0].getInput()
          )
        }
      }
    }

    given("a block with contract destruction") {

      bc.callFunction(Alice, contractAddress, contract, "destroy")
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
          record.value() shouldBe tokenBalance(1319.microEther().negate().byteBuffer())
        }

        then("there should be a token movement adding the tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(1319.microEther().byteBuffer())
        }

        then("there should be a contract destruction") {
          val record = readContractDestruction(testDriver)!!
          record.key() shouldBe contractKey(contractAddress)
          record.value() shouldBe contractDestruction(
            contractAddress,
            block.getHeader().getHash(),
            block.getTransactions()[0].getHash()
          )
        }
      }
    }
  }
}
