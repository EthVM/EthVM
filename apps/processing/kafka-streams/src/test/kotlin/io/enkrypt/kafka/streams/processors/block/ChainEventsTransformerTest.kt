package io.enkrypt.kafka.streams.processors.block

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.AvroHelpers.tokenBalance
import io.enkrypt.common.extensions.AvroHelpers.tokenKey
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.keyRecord
import io.enkrypt.common.extensions.microEther
import io.enkrypt.kafka.streams.di.Modules.kafkaStreams
import io.enkrypt.kafka.streams.di.TestModules.testBlockchain
import io.enkrypt.kafka.streams.di.TestModules.testConfig
import io.enkrypt.kafka.streams.di.TestModules.testDrivers
import io.enkrypt.kafka.streams.util.KafkaStreamsTestListener
import io.enkrypt.kafka.streams.util.KafkaUtil.readBalance
import io.enkrypt.kafka.streams.util.KafkaUtil.readContractCreation
import io.enkrypt.kafka.streams.util.KafkaUtil.readContractDestruction
import io.enkrypt.kafka.streams.util.KafkaUtil.readFungibleTokenMovement
import io.enkrypt.kafka.streams.util.KafkaUtil.readFungibleTokenMovements
import io.enkrypt.testing.StandaloneBlockchain
import io.enkrypt.testing.StandaloneBlockchain.Companion.Alice
import io.enkrypt.testing.StandaloneBlockchain.Companion.Bob
import io.enkrypt.testing.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.testing.StandaloneBlockchain.Companion.Terence
import io.kotlintest.matchers.collections.shouldContainAll
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.ConsumerRecordFactory
import org.koin.standalone.StandAloneContext.startKoin
import org.koin.standalone.StandAloneContext.stopKoin

class ChainEventsTransformerTest : BehaviorSpec() {

  override fun listeners() = listOf(KafkaStreamsTestListener)

  init {

    stopKoin()

    val koin = startKoin(listOf(testConfig, kafkaStreams, testDrivers, testBlockchain))
    val kc = koin.koinContext

    val testDriver = kc.get<TopologyTestDriver>(name = "blockProcessorDriver")

    val brf = kc.get<ConsumerRecordFactory<BlockKeyRecord, BlockRecord>>("blockRecordFactory")
    val bc = kc.get<StandaloneBlockchain>()

    given("a chain with simple ether transfers") {

      bc.sendEther(Bob, Alice, 1.ether())
      val blockOne = bc.createBlock()

      bc.sendEther(Alice, Terence, 2.ether())
      val blockTwo = bc.createBlock()

      bc.sendEther(Terence, Bob, 5.ether())
      val blockThree = bc.createBlock()

      testDriver.pipeInput(brf.create(blockOne.keyRecord(), blockOne))
      testDriver.pipeInput(brf.create(blockTwo.keyRecord(), blockTwo))
      testDriver.pipeInput(brf.create(blockThree.keyRecord(), blockThree))

      `when`("we create a fork") {

        val forkBlock = bc.createForkBlock(1)

        testDriver.pipeInput(brf.create(forkBlock.keyRecord(), forkBlock))

        then("there should be movements for the original chain") {

          val movements = readFungibleTokenMovements(testDriver, 15)
            .map { Pair(it.key(), it.value()) }

          movements shouldContainAll listOf(
            // block one
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(3.ether().byteBuffer())),
            Pair(tokenKey(Bob.address.data20()), tokenBalance(2100.microEther().negate().byteBuffer())),
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(2100.microEther().byteBuffer())),
            Pair(tokenKey(Bob.address.data20()), tokenBalance(1.ether().negate().byteBuffer())),
            Pair(tokenKey(Alice.address.data20()), tokenBalance(1.ether().byteBuffer())),

            // block two
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(3.ether().byteBuffer())),
            Pair(tokenKey(Alice.address.data20()), tokenBalance(2100.microEther().negate().byteBuffer())),
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(2100.microEther().byteBuffer())),
            Pair(tokenKey(Alice.address.data20()), tokenBalance(2.ether().negate().byteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(2.ether().byteBuffer())),

            // block three
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(3.ether().byteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(2100.microEther().negate().byteBuffer())),
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(2100.microEther().byteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(5.ether().negate().byteBuffer())),
            Pair(tokenKey(Bob.address.data20()), tokenBalance(5.ether().byteBuffer()))
          )
        }

        then("there should be reversals for blocks two and three") {

          val movements = readFungibleTokenMovements(testDriver, 10)
            .map { Pair(it.key(), it.value()) }

          movements shouldContainAll listOf(
            // block two
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(3.ether().negate().byteBuffer())),
            Pair(tokenKey(Alice.address.data20()), tokenBalance(2100.microEther().byteBuffer())),
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(2100.microEther().negate().byteBuffer())),
            Pair(tokenKey(Alice.address.data20()), tokenBalance(2.ether().byteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(2.ether().negate().byteBuffer())),

            // block three
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(3.ether().negate().byteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(2100.microEther().byteBuffer())),
            Pair(tokenKey(Coinbase.address.data20()), tokenBalance(2100.microEther().negate().byteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(5.ether().byteBuffer())),
            Pair(tokenKey(Bob.address.data20()), tokenBalance(5.ether().negate().byteBuffer()))
          )
        }

        then("there should be new movements for the fork block") {
          val record = readFungibleTokenMovement(testDriver)!!
          record.key() shouldBe tokenKey(Coinbase.address.data20())
          record.value() shouldBe tokenBalance(3.ether().byteBuffer())
        }

        then("there should be no more movements") {
          readFungibleTokenMovement(testDriver) shouldBe null
        }

        then("there should have been no other events") {
          readBalance(testDriver) shouldBe null
          readContractCreation(testDriver) shouldBe null
          readContractDestruction(testDriver) shouldBe null
        }
      }
    }

//    given("a chain of contract related transactions") {
//
//      TODO()
//    }
  }
}
