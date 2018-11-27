package io.enkrypt.bolt.processors

import io.enkrypt.avro.processing.FungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.bolt.Addresses
import io.enkrypt.bolt.Modules
import io.enkrypt.bolt.TestModules
import io.enkrypt.bolt.Topics
import io.enkrypt.bolt.extensions.bigIntBuffer
import io.enkrypt.bolt.extensions.hexBuffer
import io.enkrypt.bolt.extensions.toBigInteger
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.kafka.IntegrationTestUtils
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.KeyValue
import org.koin.log.EmptyLogger
import org.koin.standalone.StandAloneContext.startKoin
import org.koin.standalone.inject
import org.koin.test.KoinTest
import java.math.BigInteger
import java.util.*


class StateProcessorTest : KoinTest, BehaviorSpec() {

  init {

    startKoin(listOf(TestModules.embeddedKafka, Modules.kafkaStreams), logger = EmptyLogger())

    val processor = StateProcessor()
    processor.buildTopology()
    processor.start(true)

    val producerConfig by inject<Properties>("producerConfig")
    val consumerConfig by inject<Properties>("consumerConfig")

    given("a series of ether balance movements") {

      val addressOne = Addresses.createAddress()
      val addressTwo = Addresses.createAddress()
      val addressThree = Addresses.createAddress()

      val movements = listOf(
        fungibleTokenBalanceMovements(addressOne, Addresses.ETHER_CONTRACT, 10, -5, 25, -15),      // 15
        fungibleTokenBalanceMovements(addressTwo, Addresses.ETHER_CONTRACT, 100, -20, 35, 125),   // 240
        fungibleTokenBalanceMovements(addressThree, Addresses.ETHER_CONTRACT, 25, 89, -74, 356)   // 396
      ).flatten()

      `when`("they are published to the fungible token movements topics") {

        IntegrationTestUtils
          .produceKeyValuesSynchronously(
            Topics.FungibleTokenMovements,
            movements,
            producerConfig
          )

        then("a series of balance updates should be emitted") {

          val balancesMap =
            IntegrationTestUtils
              .waitUntilMinKeyValueRecordsReceived<FungibleTokenBalanceKeyRecord, FungibleTokenBalanceRecord>(
                consumerConfig,
                Topics.FungibleTokenBalances,
                3,
                30000L
              ).map { it.key.getAddress().toHex() to it.value.getAmount().toBigInteger() }
              .toMap()

          balancesMap.size shouldBe 3
          balancesMap[addressOne] shouldBe BigInteger.valueOf(15L)
          balancesMap[addressTwo] shouldBe BigInteger.valueOf(240L)
          balancesMap[addressThree] shouldBe BigInteger.valueOf(396L)

        }

      }
    }

  }

  private fun fungibleTokenBalanceMovements(address: String = Addresses.createAddress(),
                                            contract: String,
                                            vararg movement: Long) =
    movement.map { KeyValue(fungibleTokenBalanceKey(address, contract), fungibleTokenBalance(it)) }


  private fun fungibleTokenBalanceKey(address: String = Addresses.createAddress(), contract: String = Addresses.ETHER_CONTRACT) =
    FungibleTokenBalanceKeyRecord
      .newBuilder()
      .setAddress(address.hexBuffer())
      .setContract(contract.hexBuffer())
      .build()

  private fun fungibleTokenBalance(amount: Long) =
    FungibleTokenBalanceRecord
      .newBuilder()
      .setAmount(amount.bigIntBuffer())
      .build()

}
