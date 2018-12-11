package io.enkrypt.kafka.processors

import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.processing.FungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.kafka.Addresses
import io.enkrypt.kafka.streams.Modules
import io.enkrypt.kafka.TestModules
import io.enkrypt.kafka.streams.Topics
import io.enkrypt.kafka.streams.extensions.bigIntBuffer
import io.enkrypt.kafka.streams.extensions.byteBuffer
import io.enkrypt.kafka.streams.processors.StateProcessor
import io.enkrypt.kafka.test.utils.IntegrationTestUtils
import io.kotlintest.matchers.plusOrMinus
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.streams.KeyValue
import org.koin.log.EmptyLogger
import org.koin.standalone.StandAloneContext.startKoin
import org.koin.standalone.inject
import org.koin.test.KoinTest
import java.math.BigInteger
import java.util.Properties

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
              ).map {
                Pair(
                  it.key.getContract().bytes().hex(),
                  it.key.getAddress().bytes().hex()
                ) to it.value.getAmount().bigInteger()
              }
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

    given("a series of metric records") {

      val metrics = listOf(
        createMetric(1, "min", 12),
        createMetric(1, "max", 145.0),
        createMetric(1, "min", 124),
        createMetric(1, "max", 14.2),
        createMetric(1, "min", 34),
        createMetric(1, "max", 56.7),
        createMetric(2, "min", 12),
        createMetric(2, "max", 142.56),
        createMetric(2, "min", 144),
        createMetric(2, "max", 14.78),
        createMetric(2, "min", 34),
        createMetric(2, "max", 52.45),
        createMetric(3, "min", 12),
        createMetric(3, "max", 14.789),
        createMetric(3, "min", 1245),
        createMetric(3, "max", 143.12),
        createMetric(3, "min", 345),
        createMetric(3, "max", 5.57),
        createMetric(1, "min", 345),
        createMetric(2, "min", 123),
        createMetric(3, "max", 121.75)
      )

      `when`("they are published to the metrics topic") {

        IntegrationTestUtils
          .produceKeyValuesSynchronously(
            Topics.BlockMetrics,
            metrics,
            producerConfig
          )

        then("a series of averages should be emitted") {

          val avgMap =
            IntegrationTestUtils
              .waitUntilMinKeyValueRecordsReceived<MetricKeyRecord, MetricRecord>(
                consumerConfig,
                Topics.BlockStatistics,
                5,
                30000L
              ).map { Pair(it.key.getDate(), it.key.getName()) to it.value }
              .toMap()

          avgMap.size shouldBe 6
          avgMap[Pair(1L, "min")]!!.getIntValue() shouldBe 128
          avgMap[Pair(1L, "max")]!!.getDoubleValue() shouldBe (71.966666.plusOrMinus(0.000001))
          avgMap[Pair(2L, "min")]!!.getIntValue() shouldBe 78
          avgMap[Pair(2L, "max")]!!.getDoubleValue() shouldBe 69.93
          avgMap[Pair(3L, "min")]!!.getIntValue() shouldBe 534
          avgMap[Pair(3L, "max")]!!.getDoubleValue() shouldBe 71.30725

        }
      }

    }
  }

  private fun fungibleTokenBalanceMovements(
    contract: String,
    address: String = Addresses.createAddress(),
    vararg movement: Long
  ) =
    movement.map { KeyValue(fungibleTokenBalanceKey(address, contract), fungibleTokenBalance(it)) }

  private fun fungibleTokenBalanceKey(address: String = Addresses.createAddress(), contract: String = Addresses.ETHER_CONTRACT) =
    FungibleTokenBalanceKeyRecord
      .newBuilder()
      .setAddress(Data20(address.toByteArray()))
      .setContract(Data20(contract.toByteArray()))
      .build()

  private fun fungibleTokenBalance(amount: Long) =
    FungibleTokenBalanceRecord
      .newBuilder()
      .setAmount(amount.bigIntBuffer())
      .build()

  private fun createMetric(date: Long, name: String, value: Any): KeyValue<MetricKeyRecord, MetricRecord> {

    val key = MetricKeyRecord
      .newBuilder()
      .setDate(date)
      .setName(name)
      .build()

    val valueBuilder = MetricRecord.newBuilder()

    when (value) {
      is Int -> valueBuilder.intValue = value
      is Long -> valueBuilder.longValue = value
      is Float -> valueBuilder.floatValue = value
      is Double -> valueBuilder.doubleValue = value
      is BigInteger -> valueBuilder.bigIntegerValue = value.byteBuffer()
      else -> throw IllegalArgumentException("Unexpected value type: $value")
    }

    return KeyValue(key, valueBuilder.build())
  }

}
