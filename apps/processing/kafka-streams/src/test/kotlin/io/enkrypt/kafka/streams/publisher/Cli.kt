package io.enkrypt.kafka.streams.publisher

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option
import io.confluent.kafka.serializers.KafkaAvroSerializerConfig
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.keyRecord
import io.enkrypt.kafka.streams.util.StandaloneBlockchain
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Coinbase
import org.apache.kafka.clients.producer.ProducerConfig
import org.koin.dsl.module.module
import org.koin.standalone.StandAloneContext.startKoin
import java.util.Properties

class Cli : CliktCommand() {

  // General - CLI

  private val bootstrapServers: String by option(
    help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster",
    envvar = "KAFKA_BOOTSTRAP_SERVERS"
  ).default(DEFAULT_BOOTSTRAP_SERVERS)

  private val schemaRegistryUrl: String by option(
    help = "Kafka schema registry url",
    envvar = "KAFKA_SCHEMA_REGISTRY_URL"
  ).default(DEFAULT_SCHEMA_REGISTRY_URL)

  // DI

  private val configModule = module {

    factory("baseKafkaConfig") {
      Properties().apply {
        put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
        put(KafkaAvroSerializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl)
        put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 2000000000)
      }
    }
  }

  override fun run() {

    startKoin(listOf(configModule))

    val blockPublisher = BlockPublisher()
    val scenario = TestScenarioOne

    val blockChain = StandaloneBlockchain(StandaloneBlockchain.Config(
      gasLimit = 250_000,             // Enough to cover most transactions
      gasPrice = 100.gwei().toLong(), // Value chosen to speedup a little bit tests
      coinbase = Coinbase.address.data20()!!,
      premineBalances = scenario.premineBalances
    ))

    val genesisBlock = blockChain.genesisBlock
    blockPublisher.publish(genesisBlock.keyRecord(), genesisBlock, true)

    scenario.run(blockPublisher, blockChain)

    blockPublisher.close()

    System.exit(0)
  }

  companion object Defaults {
    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka-1:9091"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://kafka-schema-registry:8081"
  }
}
