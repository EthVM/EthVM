package io.enkrypt.bolt.processors.blocks

import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerializer
import io.enkrypt.bolt.AppConfig
import io.enkrypt.bolt.models.avro.Block
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.clients.producer.RecordMetadata
import org.apache.kafka.common.serialization.StringSerializer
import org.koin.standalone.KoinComponent
import java.util.Properties
import java.util.concurrent.Future

class BlocksProducer(config: AppConfig) : KoinComponent {

  private val topic: String by lazy { config.topicsConfig.processedBlocks }

  private val producer: KafkaProducer<String, Block> by lazy {
    val producerConfig = Properties().apply {
      put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, config.bootstrapServers)
      put(ProducerConfig.ACKS_CONFIG, "0")
      put(ProducerConfig.RETRIES_CONFIG, "0")
    }
    KafkaProducer(producerConfig, StringSerializer(), SpecificAvroSerializer<Block>())
  }

  fun send(key: String, block: Block): Future<RecordMetadata> = producer.send(ProducerRecord(topic, key, block))

}
