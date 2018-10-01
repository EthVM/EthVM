package io.enkrypt.bolt.processors

import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.MongoCollection
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

  protected val mongoUri: MongoClientURI by inject()
  protected val mongoClient: MongoClient by inject()
  protected val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database!!) }
  protected val mongoSession by lazy { mongoClient.startSession() }

  protected val addressesCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("addresses") }
  protected val unclesCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("uncles") }
  protected val blocksCollection: MongoCollection<Document>by lazy { mongoDB.getCollection("blocks") }
  protected val transactionsCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("transactions") }
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
