package io.enkrypt.bolt.kafka.processors

import com.mongodb.MongoClient
import com.mongodb.client.MongoDatabase
import io.enkrypt.bolt.AppConfig
import mu.KotlinLogging
import org.apache.kafka.streams.processor.Processor
import org.apache.kafka.streams.processor.ProcessorContext
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject

abstract class MongoProcessor<K, V> : Processor<K, V>, KoinComponent {

  open val timeoutMs = 5000L
  open val batchSize = 10

  protected val config: AppConfig by inject()

  protected val mongoClient: MongoClient by inject()
  protected val mongoDB: MongoDatabase by inject()

  protected lateinit var context: ProcessorContext
  protected var running: Boolean = false

  protected val logger = KotlinLogging.logger {}

  override fun init(context: ProcessorContext) {
    this.context = context
    running = true
  }

  override fun close() {
    running = false
  }
}
