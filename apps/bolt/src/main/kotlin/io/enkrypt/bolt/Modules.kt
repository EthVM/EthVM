package io.enkrypt.bolt

import com.mongodb.MongoClient
import com.mongodb.MongoClientOptions
import com.mongodb.MongoClientURI
import io.enkrypt.bolt.mongo.codecs.BigIntegerCodec
import io.enkrypt.bolt.processors.*
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.requests.IsolationLevel
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.StreamsConfig
import org.bson.codecs.configuration.CodecRegistries
import org.koin.dsl.module.module
import java.util.*

object Modules {

  val kafkaModule = module("kafka") {

    val config = get<AppConfig>()

    single {
      Properties().apply {
        // App
        put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, config.kafka.bootstrapServers)
        put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE)

        //
        put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, config.kafka.startingOffset)

        put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000)    // important when dealing with aggregations/reduces

        // Serdes - Defaults
        put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
        put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().javaClass.name)
      }
    }

  }

  val processorsModule = module("processors") {
    factory { TokenDetectorTransformer() }
  }

}
