package io.enkrypt.processors

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.AvroHelpers.tokenBalance
import io.enkrypt.common.extensions.AvroHelpers.tokenKey
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.keyRecord
import io.enkrypt.common.extensions.microEther
import io.enkrypt.di.TestModules.testBlockchain
import io.enkrypt.di.TestModules.testConfig
import io.enkrypt.di.TestModules.testDrivers
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.di.Modules.kafkaStreams
import io.enkrypt.kafka.streams.serdes.Serdes
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.StandaloneBlockchain.Companion.Alice
import io.enkrypt.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.util.StandaloneBlockchain.Companion.Coinbase
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.ConsumerRecordFactory
import org.koin.standalone.StandAloneContext.startKoin

class BlockProcessorTest : BehaviorSpec() {

  init {

    val koin = startKoin(listOf(testConfig, kafkaStreams, testDrivers, testBlockchain))
    val kc = koin.koinContext

    val testDriver = kc.get<TopologyTestDriver>(name = "blockProcessorDriver")


    val blockRecordFactory = kc.get<ConsumerRecordFactory<BlockKeyRecord, BlockRecord>>()
    val bc = kc.get<StandaloneBlockchain>()

    // TODO test genesis block

    given("a block with a simple ether transaction") {

      bc.sendEther(Bob, Alice, 1.ether())

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
          record.value() shouldBe tokenBalance(2100.microEther().negate().byteBuffer())
        }

        then("there should be a token movement adding the tx fee to the miner") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(2100.microEther().byteBuffer())
        }

        then("there should be a token movement deducting ether from the sender") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Bob.address.data20())
          record.value() shouldBe tokenBalance(1.ether().negate().byteBuffer())
        }

        then("there should be a token movement adding ether to the receiver") {
          val record = readFungibleTokenMovement(testDriver)
          record.key() shouldBe tokenKey(Alice.address.data20())
          record.value() shouldBe tokenBalance(1.ether().byteBuffer())
        }

      }

    }
  }

  private fun readFungibleTokenMovement(testDriver: TopologyTestDriver) =
    testDriver.readOutput(
      Topics.FungibleTokenMovements,
      Serdes.TokenBalanceKey().deserializer(),
      Serdes.TokenBalance().deserializer()
    )

}
