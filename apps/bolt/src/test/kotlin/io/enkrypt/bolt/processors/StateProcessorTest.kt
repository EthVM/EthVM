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

    given("a series of balance movements") {

      val addressOne = Addresses.createAddress()
      val addressTwo = Addresses.createAddress()
      val addressThree = Addresses.createAddress()

      val contractOne = Addresses.createAddress()
      val contractTwo = Addresses.createAddress()

      val movements = listOf(
        fungibleTokenBalanceMovements(Addresses.ETHER_CONTRACT, addressOne, 10, -5, 25, -15),      // 15
        fungibleTokenBalanceMovements(Addresses.ETHER_CONTRACT, addressTwo, 100, -20, 35, 125),    // 240
        fungibleTokenBalanceMovements(Addresses.ETHER_CONTRACT, addressThree, 25, 89, -74, 356),   // 396
        fungibleTokenBalanceMovements(contractOne, addressOne, 126, 587, -156, -75, 89),           // 571
        fungibleTokenBalanceMovements(contractTwo, addressTwo, 100000, -1567, 879, -2564),         // 96748
        fungibleTokenBalanceMovements(Addresses.ETHER_CONTRACT, addressTwo, -45, 65789, -1245),    // 64739
        fungibleTokenBalanceMovements(Addresses.ETHER_CONTRACT, addressThree, 1000000, -56789)     // 943607
      ).flatten()

      `when`("they are published to the fungible token movements topic") {

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
                5,
                30000L
              ).map { Pair(it.key.getContract().toHex(), it.key.getAddress().toHex()) to it.value.getAmount().toBigInteger() }
              .toMap()

          balancesMap.size shouldBe 5
          balancesMap[Pair(Addresses.ETHER_CONTRACT, addressOne)] shouldBe BigInteger.valueOf(15L)
          balancesMap[Pair(Addresses.ETHER_CONTRACT, addressTwo)] shouldBe BigInteger.valueOf(64739L)
          balancesMap[Pair(Addresses.ETHER_CONTRACT, addressThree)] shouldBe BigInteger.valueOf(943607L)
          balancesMap[Pair(contractOne, addressOne)] shouldBe BigInteger.valueOf(571L)
          balancesMap[Pair(contractTwo, addressTwo)] shouldBe BigInteger.valueOf(96748L)

        }

      }
    }

  }

  private fun fungibleTokenBalanceMovements(contract: String,
                                            address: String = Addresses.createAddress(),
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
