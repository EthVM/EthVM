package com.ethvm.kafka.streams.di

import com.ethvm.kafka.streams.config.AppConfig
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Web3Config
import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.MockSchemaRegistryClient
import io.confluent.kafka.schemaregistry.client.SchemaRegistryClient
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.StreamsConfig
import org.koin.core.qualifier.named
import org.koin.dsl.module
import org.web3j.protocol.Web3j
import org.web3j.protocol.websocket.WebSocketService
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

object Modules {

  val logger = KotlinLogging.logger {}

  val web3 = module {

    single<Web3j> {

      val config = get<Web3Config>()

      val wsService = WebSocketService(config.wsUrl, false)
      wsService.connect()
      Web3j.build(wsService)
    }
  }

  val kafkaStreams = module {

    single {

      val config = get<AppConfig>()

      val registryClient = when (config.unitTesting) {
        false -> CachedSchemaRegistryClient(config.kafka.schemaRegistryUrl, 200)
        true -> MockSchemaRegistryClient()
      }

      registryClient
    }

    single(createdAtStart = true) {

      val registryClient = get<SchemaRegistryClient>()

      logger.info { "Registering schemas with schema registry" }

      // pre-emptively register schemas to prevent issues with ad-hoc registration under load and to
      // get schema migration error feedback immediately on startup
      Topics.all
        .map { topic ->

          registryClient.register(topic.keySubject, topic.keySchema)
          registryClient.register(topic.valueSubject, topic.valueSchema)
        }

      // to stop koin from complaining
      Topics
    }

    factory(named("baseKafkaStreamsConfig")) {

      val config = get<AppConfig>()

      Properties().apply {
        // App
        put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, config.kafka.bootstrapServers)
        put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE)

        // We can have large transactions
        put(ProducerConfig.TRANSACTION_TIMEOUT_CONFIG, 300_000) // 5 mins

        // Allows for large messages, in our case large lists of traces primarily
        put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 52428800) // 50 mb

        //
        put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, config.kafka.startingOffset)

        put(StreamsConfig.STATE_DIR_CONFIG, config.kafka.streamsStateDir)

        put(StreamsConfig.REPLICATION_FACTOR_CONFIG, config.kafka.replicationFactor)

        put(StreamsConfig.METRICS_RECORDING_LEVEL_CONFIG, "DEBUG")

        // Serdes - Defaults
        put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, KafkaSerdes.String().javaClass.name)
        put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, KafkaSerdes.ByteArray().javaClass.name)
      }
    }
  }
}
