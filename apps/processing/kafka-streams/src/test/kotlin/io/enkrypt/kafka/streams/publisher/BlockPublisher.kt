package io.enkrypt.kafka.streams.publisher

import io.confluent.kafka.serializers.KafkaAvroSerializer
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.kafka.streams.config.Topics
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.clients.producer.RecordMetadata
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.Properties

class BlockPublisher : KoinComponent {

  private val baseKafkaProps: Properties by inject(name = "baseKafkaConfig")

  private val kafkaProps by lazy {
    baseKafkaProps[ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java.name
    baseKafkaProps[ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java.name

    // transactional settings
    baseKafkaProps[ProducerConfig.CLIENT_ID_CONFIG] = "test-block-publisher"
    baseKafkaProps[ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG] = true
    baseKafkaProps[ProducerConfig.TRANSACTIONAL_ID_CONFIG] = "testing"

    baseKafkaProps
  }

  private val producer =
    KafkaProducer<BlockKeyRecord, BlockRecord>(kafkaProps).apply {
      initTransactions()
    }

  fun beginTransaction() {
    producer.beginTransaction()
  }

  fun publish(key: BlockKeyRecord, value: BlockRecord, autoTxn: Boolean = false): RecordMetadata {
    if (autoTxn) producer.beginTransaction()
    val result = producer.send(ProducerRecord(Topics.Blocks, key, value)).get()
    if (autoTxn) producer.commitTransaction()
    return result
  }

  fun commit() {
    producer.commitTransaction()
  }

  fun close() {
    producer.close()
  }
}
