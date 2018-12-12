package io.enkrypt.kafka.test.utils

import kafka.admin.AdminUtils
import kafka.admin.RackAwareMode
import kafka.server.KafkaConfig
import kafka.server.KafkaServer
import kafka.utils.TestUtils
import kafka.utils.ZkUtils
import kafka.utils.`ZKStringSerializer$`
import mu.KotlinLogging
import org.I0Itec.zkclient.ZkClient
import org.I0Itec.zkclient.ZkConnection
import org.apache.kafka.common.network.ListenerName
import org.apache.kafka.common.security.auth.SecurityProtocol
import org.apache.kafka.common.utils.Time
import org.junit.rules.TemporaryFolder
import java.io.File
import java.util.Properties

/**
 * Adapted from https://github.com/confluentinc/kafkaStreams-streams-examples/blob/5.0.0-post/src/test/java/io/confluent/examples/streams/kafkaStreams/KafkaEmbedded.java
 *
 */
class KafkaEmbedded(config: Properties) {

  private val log = KotlinLogging.logger {}

  companion object {
    private const val DEFAULT_ZK_CONNECT = "127.0.0.1:2181"
    private const val DEFAULT_ZK_SESSION_TIMEOUT_MS = 10 * 1000
    private const val DEFAULT_ZK_CONNECTION_TIMEOUT_MS = 8 * 1000
  }

  private val tmpFolder: TemporaryFolder = TemporaryFolder().apply { create() }
  private val logDir: File = tmpFolder.newFolder()

  private val effectiveConfig: Properties = Properties().apply {
    put(KafkaConfig.BrokerIdProp(), 0)
    put(KafkaConfig.HostNameProp(), "127.0.0.1")
    put(KafkaConfig.PortProp(), "9092")
    put(KafkaConfig.NumPartitionsProp(), 1)
    put(KafkaConfig.AutoCreateTopicsEnableProp(), false)
    put(KafkaConfig.MessageMaxBytesProp(), 1000000)
    put(KafkaConfig.ControlledShutdownEnableProp(), true)

    // allow for transactions with just one broker
    put(KafkaConfig.TransactionsTopicMinISRProp(), 1)
    put(KafkaConfig.TransactionsTopicReplicationFactorProp(), 1.toShort())

    putAll(config)

    put(KafkaConfig.LogDirProp(), logDir.absolutePath)
  }

  private val kafka: KafkaServer

  init {

    val loggingEnabled = true

    val kafkaConfig = KafkaConfig(effectiveConfig, loggingEnabled)
    log.debug { "Starting embedded Kafka broker (with log.dirs=$logDir and ZK ensemble at ${zookeeperConnect()}) ..." }

    kafka = TestUtils.createServer(kafkaConfig, Time.SYSTEM)

    log.debug { "Startup of embedded Kafka broker at ${brokerList()} completed (with ZK ensemble at ${zookeeperConnect()}) ..." }
  }

  /**
   * This broker's `metadata.broker.list` value.  Example: `127.0.0.1:9092`.
   *
   * You can use this to tell Kafka producers and consumers how to connect to this instance.
   */
  fun brokerList(): String =
    arrayOf(kafka.config().hostName(), Integer.toString(kafka.boundPort(ListenerName.forSecurityProtocol(SecurityProtocol
      .PLAINTEXT)))).joinToString(":")

  /**
   * The ZooKeeper connection string aka `zookeeper.connect`.
   */
  fun zookeeperConnect(): String = effectiveConfig.getProperty("zookeeper.connect", DEFAULT_ZK_CONNECT)

  /**
   * Stop the broker.
   */
  fun stop() {
    log.debug("Shutting down embedded Kafka broker at {} (with ZK ensemble at {}) ...", brokerList(), zookeeperConnect())
    kafka.shutdown()
    kafka.awaitShutdown()
    log.debug("Removing temp folder {} with logs.dir at {} ...", tmpFolder, logDir)
    tmpFolder.delete()
    log.debug("Shutdown of embedded Kafka broker at {} completed (with ZK ensemble at {}) ...", brokerList(), zookeeperConnect())
  }

  /**
   * Create a Kafka topic with 1 partition and a replication factor of 1.
   *
   * @param topic The name of the topic.
   */
  fun createTopic(topic: String) {
    createTopic(topic, 1, 1, Properties())
  }

  /**
   * Create a Kafka topic with the given parameters.
   *
   * @param topic The name of the topic.
   * @param partitions The number of partitions for this topic.
   * @param replication The replication factor for (the partitions of) this topic.
   */
  fun createTopic(topic: String, partitions: Int, replication: Int) {
    createTopic(topic, partitions, replication, Properties())
  }

  /**
   * Create a Kafka topic with the given parameters.
   *
   * @param topic The name of the topic.
   * @param partitions The number of partitions for this topic.
   * @param replication The replication factor for (partitions of) this topic.
   * @param topicConfig Additional topic-level configuration settings.
   */
  fun createTopic(
    topic: String,
    partitions: Int,
    replication: Int,
    topicConfig: Properties
  ) {
    log.debug("Creating topic { name: {}, partitions: {}, replication: {}, config: {} }",
      topic, partitions, replication, topicConfig)
    // Note: You must initialize the ZkClient with ZKStringSerializer.  If you don't, then
    // createTopic() will only seem to work (it will return without error).  The topic will exist in
    // only ZooKeeper and will be returned when listing topics, but Kafka itself does not create the
    // topic.
    val zkClient = ZkClient(
      zookeeperConnect(),
      DEFAULT_ZK_SESSION_TIMEOUT_MS,
      DEFAULT_ZK_CONNECTION_TIMEOUT_MS,
      `ZKStringSerializer$`.`MODULE$`
    )
    val isSecure = false
    val zkUtils = ZkUtils(zkClient, ZkConnection(zookeeperConnect()), isSecure)
    AdminUtils.createTopic(zkUtils, topic, partitions, replication, topicConfig, RackAwareMode.`Enforced$`.`MODULE$`)
    zkClient.close()
  }

  /**
   * Delete a Kafka topic.
   *
   * @param topic The name of the topic.
   */
  fun deleteTopic(topic: String) {
    log.debug("Deleting topic {}", topic)
    val zkClient = ZkClient(
      zookeeperConnect(),
      DEFAULT_ZK_SESSION_TIMEOUT_MS,
      DEFAULT_ZK_CONNECTION_TIMEOUT_MS,
      `ZKStringSerializer$`.`MODULE$`
    )
    val isSecure = false
    val zkUtils = ZkUtils(zkClient, ZkConnection(zookeeperConnect()), isSecure)
    AdminUtils.deleteTopic(zkUtils, topic)
    zkClient.close()
  }
}
