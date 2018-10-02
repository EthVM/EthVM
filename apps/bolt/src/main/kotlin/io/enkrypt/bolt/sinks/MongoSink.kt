package io.enkrypt.bolt.sinks

import com.mongodb.MongoClient
import com.mongodb.client.ClientSession
import com.mongodb.client.MongoDatabase
import mu.KotlinLogging
import org.apache.kafka.streams.processor.Processor
import org.apache.kafka.streams.processor.ProcessorContext
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject

abstract class MongoSink<K, V> : Processor<K, V>, KoinComponent {

  open val timeoutMs = 500L
  open val batchSize = 10

  protected val mongoClient: MongoClient by inject()
  protected val mongoDB: MongoDatabase by inject()

  protected var mongoSession: ClientSession? = null

  protected val logger = KotlinLogging.logger {}

  protected var context: ProcessorContext? = null
  protected var running: Boolean = false

  override fun init(context: ProcessorContext?) {
    this.context = context
    this.mongoSession = mongoClient.startSession()
    this.running = true
  }



  override fun close() {
    this.running = false
  }
}
