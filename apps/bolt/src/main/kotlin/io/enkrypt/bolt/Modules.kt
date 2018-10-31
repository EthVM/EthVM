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

  val mongoModule = module("mongo") {

    single {

      val config = get<AppConfig>()

      val optionsBuilder = MongoClientOptions.Builder()
        .codecRegistry(CodecRegistries.fromRegistries(
          MongoClient.getDefaultCodecRegistry(),
          CodecRegistries.fromCodecs(BigIntegerCodec())   // biginteger to Decimal codec
        ))

      MongoClientURI(config.mongo.uri, optionsBuilder)
    }

    single {
      val uri = get<MongoClientURI>()
      MongoClient(uri)
    }

    single {
      val client = get<MongoClient>()
      val uri = get<MongoClientURI>()

      client.getDatabase(uri.database!!)
    }

  }

  val kafkaModule = module("kafka") {

    val config = get<AppConfig>()

    single {
      Properties().apply {
        // App
        put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, config.kafka.bootstrapServers)

        // Processing
        put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, config.kafka.startingOffset)
        put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.AT_LEAST_ONCE)

        // Serdes - Defaults
        put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass.name)
        put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ByteArray().javaClass.name)
      }
    }

  }

  val processorsModule = module("processors") {
    factory { BlockMongoTransformer() }
    factory { TokenDetectorTransformer() }
    factory { AccountStateMongoProcessor() }
    factory { PendingTransactionMongoProcessor() }
    factory { StatisticMongoProcessor() }
    factory { TokenTransferMongoProcessor() }
  }

}
