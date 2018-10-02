package io.enkrypt.bolt.processors

import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import io.enkrypt.bolt.AppConfig
import org.apache.kafka.streams.KafkaStreams
import org.bson.Document
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.Properties

interface Processor {
  fun onPrepareProcessor()
  fun start()
}

abstract class AbstractBaseProcessor : Processor, KoinComponent {

  protected abstract val id: String

  protected val appConfig: AppConfig by inject()
  protected val baseKafkaProps: Properties by inject(name = "kafka.Properties")

  protected val mongoDB: MongoDatabase by inject()

  protected val addressesCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("addresses") }
  protected val pendingTransactionsCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("pending_transactions") }

  protected lateinit var streams: KafkaStreams

  override fun start() {
    streams.apply {
      cleanUp()
      start()
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }
}
