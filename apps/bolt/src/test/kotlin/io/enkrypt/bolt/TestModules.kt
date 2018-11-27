package io.enkrypt.bolt

import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.serializers.KafkaAvroDeserializer
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig
import io.confluent.kafka.serializers.KafkaAvroSerializer
import io.enkrypt.bolt.kafka.EmbeddedSingleNodeKafkaCluster
import io.enkrypt.kafka.db.BlockSummaryStore
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.ethereum.datasource.DbSettings
import org.ethereum.datasource.rocksdb.RocksDbDataSource
import org.koin.dsl.module.module
import java.util.*

object TestModules {

  val embeddedKafka = module("embeddedKafka") {

    single {

      val cluster = EmbeddedSingleNodeKafkaCluster()
      cluster.start()

      cluster.createTopic(Topics.FungibleTokenMovements, 3, 1)
      cluster.createTopic(Topics.FungibleTokenBalances, 3, 1)
      cluster.createTopic(Topics.BlockMetrics, 3, 1)
      cluster.createTopic(Topics.BlockStatistics, 3, 1)

      cluster

    }

    factory(name = "producerConfig") {

      val cluster = get<EmbeddedSingleNodeKafkaCluster>()

      Properties().apply {
        put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, cluster.bootstrapServers())
        put(ProducerConfig.ACKS_CONFIG, "all")
        put(ProducerConfig.RETRIES_CONFIG, 0)
        put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java)
        put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java)
        put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, cluster.schemaRegistryUrl())
      }
    }

    factory(name = "consumerConfig") {

      val cluster = get<EmbeddedSingleNodeKafkaCluster>()

      Properties().apply {
        put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, cluster.bootstrapServers())
        put(ConsumerConfig.GROUP_ID_CONFIG, "state-processor-test")
        put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
        put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
        put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
        put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, cluster.schemaRegistryUrl())
        put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true)
      }
    }

    single {

      val cluster = get<EmbeddedSingleNodeKafkaCluster>()

      KafkaConfig(
        cluster.bootstrapServers(),
        "earliest",
        "test",
        cluster.schemaRegistryUrl(),
        KafkaInputTopicsConfig(
          Cli.DEFAULT_BLOCK_SUMMARIES_TOPIC,
          Cli.DEFAULT_PENDING_TXS_TOPIC,
          Cli.DEFAULT_METADATA_TOPIC
        ))
    }

    single { AppConfig(get()) }

  }

}
