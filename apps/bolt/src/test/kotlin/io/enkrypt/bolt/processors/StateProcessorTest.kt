package io.enkrypt.bolt.processors

import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.serializers.KafkaAvroDeserializer
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig
import io.confluent.kafka.serializers.KafkaAvroSerializer
import io.enkrypt.avro.capture.BlockSummaryRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.bolt.*
import io.enkrypt.bolt.extensions.*
import io.enkrypt.bolt.kafka.EmbeddedSingleNodeKafkaCluster
import io.enkrypt.bolt.kafka.IntegrationTestUtils
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.KeyValue
import org.koin.dsl.module.module
import org.koin.standalone.StandAloneContext.startKoin
import org.koin.standalone.inject
import org.koin.test.KoinTest
import java.math.BigInteger
import java.util.*


class StateProcessorTest : KoinTest, BehaviorSpec() {

  val cluster = EmbeddedSingleNodeKafkaCluster()

  val appConfig: AppConfig by inject()
  val kafkaProps: Properties by inject("kafka")

//  val blockRecordFactory = ConsumerRecordFactory<String, BlockSummaryRecord>(KafkaAvroSerializer(), KafkaAvroSerializer())

  init {

    cluster.start()

    // TODO add compaction and other properties
    cluster.createTopic(Topics.FungibleTokenMovements, 3, 1)
    cluster.createTopic(Topics.FungibleTokenBalances, 3, 1)
    cluster.createTopic(Topics.BlockMetrics, 3, 1)
    cluster.createTopic(Topics.BlockStatistics, 3, 1)

    val producerConfig = Properties().apply {
      put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, cluster.bootstrapServers())
      put(ProducerConfig.ACKS_CONFIG, "all")
      put(ProducerConfig.RETRIES_CONFIG, 0)
      put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java)
      put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java)
      put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, cluster.schemaRegistryUrl())
    }

    val consumerConfig = Properties().apply {
      put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, cluster.bootstrapServers())
      put(ConsumerConfig.GROUP_ID_CONFIG, "state-processor-test")
      put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
      put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
      put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
      put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, cluster.schemaRegistryUrl())
      put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true)
    }

    startKoin(listOf(
      module("config") {

        single {
          KafkaConfig(
            cluster.bootstrapServers(),
            "earliest",
            "test",
            cluster.schemaRegistryUrl(),
            KafkaInputTopicsConfig(
              "block-summaries",
              "pending-txs",
              "metadata"
            ))
        }

        single { AppConfig(get()) }

      }, Modules.kafkaModule))


    val processor = StateProcessor()
    processor.buildTopology()
    processor.start(true)

    given("a series of ether balance movements") {

      val addressOne = Addresses.createAddress()
      val addressTwo = Addresses.createAddress()
      val addressThree = Addresses.createAddress()

      val movements = listOf(
        fungibleTokenBalanceMovements(addressOne, Addresses.ETHER_CONTRACT, 10, -5, 25, -15),      // 15
        fungibleTokenBalanceMovements(addressTwo, Addresses.ETHER_CONTRACT, 100, -20, 35, 125),   // 240
        fungibleTokenBalanceMovements(addressThree, Addresses.ETHER_CONTRACT, 25, 89, -74, 356)   // 396
      ).flatten()

      `when`("published to the fungible token movements topics") {

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
