package io.enkrypt.di

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.kafka.streams.config.AppConfig
import io.enkrypt.kafka.streams.config.KafkaConfig
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.processors.BlockProcessor
import io.enkrypt.kafka.streams.processors.StateProcessor
import io.enkrypt.kafka.streams.serdes.Serdes
import io.enkrypt.util.StandaloneBlockchain
import io.enkrypt.util.StandaloneBlockchain.Companion.Alice
import io.enkrypt.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.util.StandaloneBlockchain.Companion.Coinbase
import io.enkrypt.util.StandaloneBlockchain.Companion.Terence
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.ConsumerRecordFactory
import org.koin.dsl.module.module
import java.util.Properties

object TestModules {

  val testConfig = module {

    single {
      KafkaConfig(
        "dummy:1234",
        "earliest",
        "transaction-1",
        "http://foo.com"
      )
    }

    single { AppConfig(true, get()) }
  }

  val testBlockchain = module {

    factory {

      val premineBalances = mapOf(
        Bob.address.data20() to 1000.ether(),
        Alice.address.data20() to 1000.ether(),
        Terence.address.data20() to 1000.ether()
      )

      val bcConfig = StandaloneBlockchain.Config(
        gasLimit = 250_000,             // Enough to cover most transactions
        gasPrice = 100.gwei().toLong(), // Value chosen to speedup a little bit tests
        premineBalances = premineBalances,
        coinbase = Coinbase.address.data20()!!
      )

      StandaloneBlockchain(bcConfig)
    }
  }

  val testDrivers = module {

    single("blockProcessorDriver") {

      val processor = BlockProcessor()

      val kafkaProps = get<Properties>(name = "baseKafkaStreamsConfig").apply {
        put(StreamsConfig.APPLICATION_ID_CONFIG, "block-processor-test")
      }

      TopologyTestDriver(processor.buildTopology(), kafkaProps)
    }

    single("stateProcessorDriver") {

      val processor = StateProcessor()

      val kafkaProps = get<Properties>(name = "baseKafkaStreamsConfig").apply {
        put(StreamsConfig.APPLICATION_ID_CONFIG, "state-processor-test")
      }

      TopologyTestDriver(processor.buildTopology(), kafkaProps)
    }

    factory("blockRecordFactory") {

      ConsumerRecordFactory<BlockKeyRecord, BlockRecord>(
        Topics.Blocks,
        Serdes.BlockKey().serializer(),
        Serdes.Block().serializer()
      )
    }

    factory("fungibleMovementRecordFactory") {

      ConsumerRecordFactory<TokenBalanceKeyRecord, TokenBalanceRecord>(
        Topics.FungibleTokenMovements,
        Serdes.TokenBalanceKey().serializer(),
        Serdes.TokenBalance().serializer()
      )
    }
  }
}
