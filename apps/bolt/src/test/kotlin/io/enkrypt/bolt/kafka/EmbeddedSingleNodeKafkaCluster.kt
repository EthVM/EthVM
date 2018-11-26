package io.enkrypt.bolt.kafka

import io.confluent.kafka.schemaregistry.RestApp
import io.confluent.kafka.schemaregistry.rest.SchemaRegistryConfig
import io.enkrypt.bolt.zookeeper.ZooKeeperEmbedded
import kafka.server.`KafkaConfig$`
import kafka.utils.ZkUtils
import mu.KotlinLogging
import org.apache.kafka.common.errors.UnknownTopicOrPartitionException
import org.apache.kafka.common.security.JaasUtils
import org.apache.kafka.test.TestCondition
import org.apache.kafka.test.TestUtils
import org.junit.rules.ExternalResource
import java.io.IOException
import java.util.*


/**
 * Runs an in-memory, "embedded" Kafka cluster with 1 ZooKeeper instance, 1 Kafka broker, and 1
 * Confluent Schema Registry instance.
 */
class EmbeddedSingleNodeKafkaCluster : ExternalResource {

  private val log = KotlinLogging.logger {}

  private val DEFAULT_BROKER_PORT = 0 // 0 results in a random port being selected
  private val KAFKA_SCHEMAS_TOPIC = "_schemas"
  private val AVRO_COMPATIBILITY_TYPE = "NONE"

  private val KAFKASTORE_OPERATION_TIMEOUT_MS = "10000"
  private val KAFKASTORE_DEBUG = "true"
  private val KAFKASTORE_INIT_TIMEOUT = "90000"

  private val brokerConfig: Properties = Properties()

  private var zookeeper: ZooKeeperEmbedded? = null
  private var zkUtils: ZkUtils? = null
  private var broker: KafkaEmbedded? = null
  private var schemaRegistry: RestApp? = null

  private var running: Boolean = false

  constructor(): this(Properties())

  constructor(config: Properties): super() {
    this.brokerConfig.putAll(config)
  }

  /**
   * Creates and starts the cluster.
   */
  @Throws(Exception::class)
  fun start() {

    log.debug("Initiating embedded Kafka cluster startup")
    log.debug("Starting a ZooKeeper instance...")
    zookeeper = ZooKeeperEmbedded()
    log.debug{"ZooKeeper instance is running at ${zookeeper!!.connectString}"}

    zkUtils = ZkUtils.apply(
      zookeeper!!.connectString,
      30000,
      30000,
      JaasUtils.isZkSecurityEnabled())

    val effectiveBrokerConfig = effectiveBrokerConfigFrom(brokerConfig, zookeeper!!)
    log.debug("Starting a Kafka instance on port {} ...",
      effectiveBrokerConfig.getProperty(`KafkaConfig$`.`MODULE$`.PortProp()))
    broker = KafkaEmbedded(effectiveBrokerConfig)
    log.debug("Kafka instance is running at {}, connected to ZooKeeper at {}",
      broker!!.brokerList(), broker!!.zookeeperConnect())

    val schemaRegistryProps = Properties()

    schemaRegistryProps[SchemaRegistryConfig.KAFKASTORE_TIMEOUT_CONFIG] = KAFKASTORE_OPERATION_TIMEOUT_MS
    schemaRegistryProps[SchemaRegistryConfig.DEBUG_CONFIG] = KAFKASTORE_DEBUG
    schemaRegistryProps[SchemaRegistryConfig.KAFKASTORE_INIT_TIMEOUT_CONFIG] = KAFKASTORE_INIT_TIMEOUT

    schemaRegistry = RestApp(0, zookeeperConnect(), KAFKA_SCHEMAS_TOPIC, AVRO_COMPATIBILITY_TYPE, schemaRegistryProps)
    schemaRegistry!!.start()
    running = true
  }

  private fun effectiveBrokerConfigFrom(brokerConfig: Properties, zookeeper: ZooKeeperEmbedded): Properties {
    val effectiveConfig = Properties()
    effectiveConfig.putAll(brokerConfig)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.ZkConnectProp(), zookeeper.connectString)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.ZkSessionTimeoutMsProp(), 30 * 1000)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.PortProp(), DEFAULT_BROKER_PORT)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.ZkConnectionTimeoutMsProp(), 60 * 1000)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.DeleteTopicEnableProp(), true)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.LogCleanerDedupeBufferSizeProp(), 2 * 1024 * 1024L)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.GroupMinSessionTimeoutMsProp(), 0)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.OffsetsTopicReplicationFactorProp(), 1.toShort())
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.OffsetsTopicPartitionsProp(), 1)
    effectiveConfig.put(`KafkaConfig$`.`MODULE$`.AutoCreateTopicsEnableProp(), true)
    return effectiveConfig
  }

  @Throws(Exception::class)
  override fun before() {
    start()
  }

  override fun after() {
    stop()
  }

  /**
   * Stops the cluster.
   */
  fun stop() {
    log.info("Stopping Confluent")
    try {
      try {
        if (schemaRegistry != null) {
          schemaRegistry!!.stop()
        }
      } catch (e: Exception) {
        throw RuntimeException(e)
      }

      if (broker != null) {
        broker!!.stop()
      }
      try {
        if (zookeeper != null) {
          zookeeper!!.stop()
        }
      } catch (e: IOException) {
        throw RuntimeException(e)
      }

    } finally {
      running = false
    }
    log.info("Confluent Stopped")
  }

  /**
   * This cluster's `bootstrap.servers` value.  Example: `127.0.0.1:9092`.
   *
   * You can use this to tell Kafka Streams applications, Kafka producers, and Kafka consumers (new
   * consumer API) how to connect to this cluster.
   */
  fun bootstrapServers(): String {
    return broker!!.brokerList()
  }

  /**
   * This cluster's ZK connection string aka `zookeeper.connect` in `hostnameOrIp:port` format.
   * Example: `127.0.0.1:2181`.
   *
   * You can use this to e.g. tell Kafka consumers (old consumer API) how to connect to this
   * cluster.
   */
  fun zookeeperConnect(): String {
    return zookeeper!!.connectString
  }

  /**
   * The "schema.registry.url" setting of the schema registry instance.
   */
  fun schemaRegistryUrl(): String {
    return schemaRegistry!!.restConnect
  }

  /**
   * Creates a Kafka topic with 1 partition and a replication factor of 1.
   *
   * @param topic The name of the topic.
   */
  fun createTopic(topic: String) {
    createTopic(topic, 1, 1, Properties())
  }

  /**
   * Creates a Kafka topic with the given parameters.
   *
   * @param topic       The name of the topic.
   * @param partitions  The number of partitions for this topic.
   * @param replication The replication factor for (the partitions of) this topic.
   */
  fun createTopic(topic: String, partitions: Int, replication: Int) {
    createTopic(topic, partitions, replication, Properties())
  }

  /**
   * Creates a Kafka topic with the given parameters.
   *
   * @param topic       The name of the topic.
   * @param partitions  The number of partitions for this topic.
   * @param replication The replication factor for (partitions of) this topic.
   * @param topicConfig Additional topic-level configuration settings.
   */
  fun createTopic(topic: String,
                  partitions: Int,
                  replication: Int,
                  topicConfig: Properties) {
    broker!!.createTopic(topic, partitions, replication, topicConfig)
  }

  /**
   * Deletes multiple topics and blocks until all topics got deleted.
   *
   * @param timeoutMs the max time to wait for the topics to be deleted (does not block if `<= 0`)
   * @param topics the name of the topics
   */
  @Throws(InterruptedException::class)
  fun deleteTopicsAndWait(timeoutMs: Long, vararg topics: String) {
    for (topic in topics) {
      try {
        broker!!.deleteTopic(topic)
      } catch (e: UnknownTopicOrPartitionException) {
      }

    }

    // TODO find testing dependency
    if (timeoutMs > 0) {
      TestUtils.waitForCondition(TopicsDeletedCondition(*topics), timeoutMs, "Topics not deleted after $timeoutMs milli seconds.")
    }
  }

  fun isRunning(): Boolean {
    return running
  }

  private inner class TopicsDeletedCondition(vararg topics: String) : TestCondition {

    internal val deletedTopics = topics.toSet()

    override fun conditionMet(): Boolean {
      val allTopics = HashSet(scala.collection.JavaConversions.seqAsJavaList(zkUtils!!.getAllTopics()))
      return !allTopics.removeAll(deletedTopics)
    }
  }


}
