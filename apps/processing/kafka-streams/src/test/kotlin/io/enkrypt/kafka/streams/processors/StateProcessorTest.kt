package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.common.extensions.AvroHelpers.tokenBalance
import io.enkrypt.common.extensions.AvroHelpers.tokenKey
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.di.Modules
import io.enkrypt.kafka.streams.di.TestModules
import io.enkrypt.kafka.streams.util.KafkaStreamsTestListener
import io.enkrypt.kafka.streams.util.KafkaUtil.readBalances
import io.enkrypt.testing.StandaloneBlockchain
import io.enkrypt.testing.StandaloneBlockchain.Companion.Alice
import io.enkrypt.testing.StandaloneBlockchain.Companion.Bob
import io.enkrypt.testing.StandaloneBlockchain.Companion.Terence
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.ConsumerRecordFactory
import org.koin.standalone.StandAloneContext
import org.koin.standalone.StandAloneContext.stopKoin

class StateProcessorTest : BehaviorSpec() {

  override fun listeners() = listOf(KafkaStreamsTestListener)

  init {

    stopKoin()

    val koin = StandAloneContext.startKoin(listOf(TestModules.testConfig, Modules.kafkaStreams, TestModules.testDrivers, TestModules.testBlockchain))
    val kc = koin.koinContext

    val testDriver = kc.get<TopologyTestDriver>(name = "stateProcessorDriver")

    val tbf = kc.get<ConsumerRecordFactory<TokenBalanceKeyRecord, TokenBalanceRecord>>("fungibleMovementRecordFactory")

    given("an initial set of ether balances") {

      listOf(
        Pair(tokenKey(Bob.address.data20()), tokenBalance(10.ether().byteBuffer())),
        Pair(tokenKey(Alice.address.data20()), tokenBalance(20.ether().byteBuffer())),
        Pair(tokenKey(Terence.address.data20()), tokenBalance(30.ether().byteBuffer()))
      ).forEach { (key, value) -> testDriver.pipeInput(tbf.create(key, value)) }

      val balances = readBalances(testDriver, 3)
        .map { Pair(it.key(), it.value()) }

      // balances are unsigned

      balances shouldBe listOf(
        Pair(tokenKey(Bob.address.data20()), tokenBalance(10.ether().unsignedByteBuffer())),
        Pair(tokenKey(Alice.address.data20()), tokenBalance(20.ether().unsignedByteBuffer())),
        Pair(tokenKey(Terence.address.data20()), tokenBalance(30.ether().unsignedByteBuffer()))
      )

      `when`("we publish additional positive ether movements") {

        listOf(
          Pair(tokenKey(Bob.address.data20()), tokenBalance(5.ether().byteBuffer())),
          Pair(tokenKey(Alice.address.data20()), tokenBalance(10.ether().byteBuffer())),
          Pair(tokenKey(Terence.address.data20()), tokenBalance(15.ether().byteBuffer()))
        ).forEach { (key, value) -> testDriver.pipeInput(tbf.create(key, value)) }

        then("an ether increase should be observed for each address") {
          readBalances(testDriver, 3)
            .map { Pair(it.key(), it.value()) } shouldBe listOf(
            Pair(tokenKey(Bob.address.data20()), tokenBalance(15.ether().unsignedByteBuffer())),
            Pair(tokenKey(Alice.address.data20()), tokenBalance(30.ether().unsignedByteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(45.ether().unsignedByteBuffer()))
          )
        }
      }

      `when`("we publish additional negative ether movements") {

        listOf(
          Pair(tokenKey(Bob.address.data20()), tokenBalance(2.ether().negate().byteBuffer())),
          Pair(tokenKey(Alice.address.data20()), tokenBalance(7.ether().negate().byteBuffer())),
          Pair(tokenKey(Terence.address.data20()), tokenBalance(12.ether().negate().byteBuffer()))
        ).forEach { (key, value) -> testDriver.pipeInput(tbf.create(key, value)) }

        then("an ether decrease should be observed for each address") {
          readBalances(testDriver, 3)
            .map { Pair(it.key(), it.value()) } shouldBe listOf(
            Pair(tokenKey(Bob.address.data20()), tokenBalance(13.ether().unsignedByteBuffer())),
            Pair(tokenKey(Alice.address.data20()), tokenBalance(23.ether().unsignedByteBuffer())),
            Pair(tokenKey(Terence.address.data20()), tokenBalance(33.ether().unsignedByteBuffer()))
          )
        }
      }
    }

//    given("an initial set of ERC20 token balances") {
//      TODO()
//    }
//
//    given("an initial set of ERC721 token balances") {
//      TODO()
//    }
//
//    given("an initial set of metrics") {
//      TODO()
//    }
  }
}
