package com.ethvm.kafka.connect.sinks.mongo

import com.mongodb.ConnectionString
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.ethvm.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.sink.SinkRecord
import org.apache.kafka.connect.sink.SinkTask

class MongoSinkTask : SinkTask() {

  private val logger = KotlinLogging.logger {}

  private val maxBackoffMs = 30000L
  private val initialBackoffMs = 1000L

  private var backoffMs: Long? = null

  private val writer: com.ethvm.kafka.connect.sinks.mongo.MongoWriter = com.ethvm.kafka.connect.sinks.mongo.MongoWriter()

  private lateinit var client: MongoClient

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {
    val uri = com.ethvm.kafka.connect.sinks.mongo.MongoSinkConnector.Config.mongoUri(props)
    val connectionString = ConnectionString(uri)

    this.client = MongoClients.create(uri)
    writer.start(client, connectionString)

    logger.info { "Started" }
  }

  override fun open(partitions: MutableCollection<TopicPartition>) {
    val topics = partitions.map { it.topic() }.toSet()
    writer.addTopics(topics)
    logger.info { "Partitions opened, topics = $topics" }
  }

  override fun put(records: MutableCollection<SinkRecord>) {
    logger.trace { "Putting ${records.size} records" }
    writer.put(records)
  }

  override fun flush(currentOffsets: MutableMap<TopicPartition, OffsetAndMetadata>) {
    try {
      logger.trace { "Flushing, offsets = $currentOffsets" }
      writer.flush()

      // reset backoff
      backoffMs = null
    } catch (e: RetriableException) {

      // set timeout
      val backoffMs = this.backoffMs ?: initialBackoffMs
      context.timeout(backoffMs)

      logger.warn { "Retriable exception detected, timeout set to $backoffMs ms" }

      // increment for next timeout
      this.backoffMs = backoffMs * 2
      if (this.backoffMs!! > maxBackoffMs) {
        this.backoffMs = maxBackoffMs
      }

      // re-throw
      throw e
    }
  }

  override fun stop() {
    writer.stop()
    client.close()

    logger.info { "Stopped" }
  }
}
