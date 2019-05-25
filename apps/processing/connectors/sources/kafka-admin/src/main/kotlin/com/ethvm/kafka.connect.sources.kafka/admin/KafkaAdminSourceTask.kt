package com.ethvm.kafka.connect.sources.kafka.admin

import com.ethvm.avro.processing.KafkaOffsetInfoKeyRecord
import com.ethvm.avro.processing.KafkaOffsetInfoRecord
import com.ethvm.kafka.connect.sources.kafka.admin.utils.AvroToConnect
import com.ethvm.kafka.connect.sources.kafka.admin.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.clients.admin.AdminClient
import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import org.joda.time.DateTime
import java.util.Properties
import java.util.concurrent.TimeUnit

class KafkaAdminSourceTask : SourceTask() {

  private val logger = KotlinLogging.logger {}

  private lateinit var bootstrapServers: String
  private lateinit var configuredConsumerGroupIds: List<String>

  private lateinit var client: AdminClient
  private lateinit var consumer: KafkaConsumer<String, String>

  private var intervalMs: Long = 10000

  private val waitForResponseTime: Long = 30000

  private var assignedPartitions: List<TopicPartition> = emptyList()

  override fun version(): String = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    bootstrapServers = KafkaAdminConnector.Config.bootstrapServers(props)
    configuredConsumerGroupIds = KafkaAdminConnector.Config.consumerGroups(props)
    intervalMs = KafkaAdminConnector.Config.interval(props)

    client = createAdminClient(bootstrapServers)
    consumer = createConsumer(bootstrapServers)

    assignedPartitions = emptyList()
  }

  override fun stop() {
  }

  override fun poll(): MutableList<SourceRecord> {

    logger.debug { "Sleeping for $intervalMs ms" }

    Thread.sleep(intervalMs)

    val startMs = System.currentTimeMillis()

    val records = determineLag()

    val elapsedMs = System.currentTimeMillis() - startMs

    logger.debug { "Runtime = $elapsedMs ms, record count = ${records.size}" }

    return records.toMutableList()
  }

  private fun getConsumerGroupIds(): List<String> {

    logger.info { "getting consumer group ids. Configured count = ${configuredConsumerGroupIds.size}, list = $configuredConsumerGroupIds" }

    return if (configuredConsumerGroupIds.isNotEmpty()) {
      configuredConsumerGroupIds
    } else {
      client.listConsumerGroups()
        .all()
        .get(waitForResponseTime, TimeUnit.MILLISECONDS)
        .map { it.groupId() }
    }
  }

  private fun determineLag(): List<SourceRecord> {

    val timestamp = System.currentTimeMillis()

    return getConsumerGroupIds()
      .map { groupId -> groupId to client.listConsumerGroupOffsets(groupId).partitionsToOffsetAndMetadata() }
      .map { (groupId, future) -> groupId to future.get(waitForResponseTime, TimeUnit.MILLISECONDS) }
      .map { (groupId, offsetsByPartition) ->

        val totalOffsetsByTopic = offsetsByPartition
          .entries
          .map { entry ->

            val committedOffset = entry.value.offset()
            val logEndOffset = getLogEndOffset(entry.key)

            entry.key.topic() to Pair(logEndOffset, committedOffset)
          }.groupBy { it.first }
          .mapValues { (_, list) ->
            list.fold(Pair(0L, 0L)) { acc, pair ->
              Pair(acc.first + pair.second.first, acc.second + pair.second.second)
            }
          }

        totalOffsetsByTopic
          .map { (topic, offsets) ->

            val key = KafkaOffsetInfoKeyRecord.newBuilder()
              .setTimestamp(timestamp)
              .setConsumerGroupId(groupId)
              .setTopic(topic)
              .build()

            val value = KafkaOffsetInfoRecord.newBuilder()
              .setTimestamp(timestamp)
              .setConsumerGroupId(groupId)
              .setTopic(topic)
              .setTotalLength(offsets.first)
              .setTotalOffset(offsets.second)
              .build()

            val keySchemaAndValue = AvroToConnect.toConnectData(key)
            val valueSchemaAndValue = AvroToConnect.toConnectData(value)

            SourceRecord(
              emptyMap<String, Any>(),
              emptyMap<String, Any>(),
              "kafka_offset_info",
              keySchemaAndValue.schema(),
              keySchemaAndValue.value(),
              valueSchemaAndValue.schema(),
              valueSchemaAndValue.value()
            )
          }.toList()
      }.flatten()
  }

  private fun getLogEndOffset(topicPartition: TopicPartition): Long {

    if (!assignedPartitions.contains(topicPartition)) {
      // assign this partition to our consumer
      consumer.assign(listOf(topicPartition))
    }

    consumer.seekToEnd(listOf(topicPartition))

    return consumer.position(topicPartition)
  }

  private fun createAdminClient(bootstrapServers: String): AdminClient {
    val kafkaProps = Properties().apply {
      put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
      put(AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, "5000")
    }
    return AdminClient.create(kafkaProps)
  }

  private fun createConsumer(bootstrapServers: String): KafkaConsumer<String, String> {

    val kafkaProps = Properties().apply {
      put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
      put(ConsumerConfig.GROUP_ID_CONFIG, "kafka-connect-source")
      put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false")
      put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000")
      put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
      put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
    }

    return KafkaConsumer(kafkaProps)
  }
}
