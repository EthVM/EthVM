package io.enkrypt.kafka.test.utils

import org.apache.kafka.clients.consumer.ConsumerRecords
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.errors.InvalidStateStoreException
import org.apache.kafka.streams.state.QueryableStoreType
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore
import org.apache.kafka.test.TestUtils
import java.util.ArrayList
import java.util.Properties

object IntegrationTestUtils {

  private const val UNLIMITED_MESSAGES = -1
  private const val DEFAULT_TIMEOUT = 30 * 1000L

  fun <K, V> readValues(topic: String, consumerConfig: Properties, maxMessages: Int): List<V> =
    readKeyValues<K, V>(topic, consumerConfig, maxMessages)
      .map { it.value }

  fun <K, V> readKeyValues(topic: String, consumerConfig: Properties): List<KeyValue<K, V>> =
    readKeyValues(topic, consumerConfig, UNLIMITED_MESSAGES)

  fun <K, V> readKeyValues(topic: String, consumerConfig: Properties, maxMessages: Int): List<KeyValue<K, V>> {
    val consumer = KafkaConsumer<K, V>(consumerConfig)
    consumer.subscribe(listOf(topic))

    val pollIntervalMs = 100L
    val maxTotalPollTimeMs = 2000L
    var totalPollTimeMs = 0L

    var consumedValues = listOf<KeyValue<K, V>>()

    while (totalPollTimeMs < maxTotalPollTimeMs && continueConsuming(consumedValues.size, maxMessages)) {
      totalPollTimeMs += pollIntervalMs
      val records: ConsumerRecords<K, V> = consumer.poll(pollIntervalMs)
      consumedValues += records.map { KeyValue<K, V>(it.key(), it.value()) }
    }
    consumer.close()

    return consumedValues
  }

  private fun continueConsuming(messagesConsumed: Int, maxMessages: Int): Boolean =
    maxMessages <= 0 || messagesConsumed < maxMessages

  fun <K, V> produceKeyValuesSynchronously(topic: String, records: List<KeyValue<K, V>>, producerConfig: Properties) {
    val producer = KafkaProducer<K, V>(producerConfig)
    records
      .map { ProducerRecord(topic, it.key, it.value) }
      .map { producer.send(it) }
      .forEach { it.get() }
    producer.flush()
    producer.close()
  }

  fun <K, V> produceValuesSynchronously(topic: String, records: List<V>, producerConfig: Properties) {
    produceKeyValuesSynchronously(topic, records.map { KeyValue(null, it) }, producerConfig)
  }

  @Throws(InterruptedException::class)
  fun <K, V> waitUntilMinKeyValueRecordsReceived(
    consumerConfig: Properties,
    topic: String,
    expectedNumRecords: Int
  ): List<KeyValue<K, V>> =
    waitUntilMinKeyValueRecordsReceived(consumerConfig, topic, expectedNumRecords,
      DEFAULT_TIMEOUT)

  /**
   * Wait until enough data (key-value records) has been consumed.
   *
   * @param consumerConfig     Kafka Consumer configuration
   * @param topic              Topic to consume from
   * @param expectedNumRecords Minimum number of expected records
   * @param waitTime           Upper bound in waiting time in milliseconds
   * @return All the records consumed, or null if no records are consumed
   * @throws AssertionError if the given wait time elapses
   */
  @Throws(InterruptedException::class)
  fun <K, V> waitUntilMinKeyValueRecordsReceived(
    consumerConfig: Properties,
    topic: String,
    expectedNumRecords: Int,
    waitTime: Long
  ): List<KeyValue<K, V>> {
    val accumData = ArrayList<KeyValue<K, V>>()
    val startTime = System.currentTimeMillis()
    while (true) {
      val readData = readKeyValues<K, V>(topic, consumerConfig)
      accumData.addAll(readData)
      if (accumData.size >= expectedNumRecords)
        return accumData
      if (System.currentTimeMillis() > startTime + waitTime)
        throw AssertionError("Expected " + expectedNumRecords +
          " but received only " + accumData.size +
          " records before timeout " + waitTime + " ms")
      Thread.sleep(Math.min(waitTime, 100L))
    }
  }

  @Throws(InterruptedException::class)
  fun <V> waitUntilMinValuesRecordsReceived(
    consumerConfig: Properties,
    topic: String,
    expectedNumRecords: Int
  ): List<V> {

    return waitUntilMinValuesRecordsReceived(consumerConfig, topic, expectedNumRecords,
      DEFAULT_TIMEOUT)
  }

  /**
   * Wait until enough data (value records) has been consumed.
   *
   * @param consumerConfig     Kafka Consumer configuration
   * @param topic              Topic to consume from
   * @param expectedNumRecords Minimum number of expected records
   * @param waitTime           Upper bound in waiting time in milliseconds
   * @return All the records consumed, or null if no records are consumed
   * @throws AssertionError if the given wait time elapses
   */
  @Throws(InterruptedException::class)
  fun <V> waitUntilMinValuesRecordsReceived(
    consumerConfig: Properties,
    topic: String,
    expectedNumRecords: Int,
    waitTime: Long
  ): List<V> {
    val accumData = ArrayList<V>()
    val startTime = System.currentTimeMillis()
    while (true) {
      val readData = readValues<Any, V>(topic, consumerConfig, expectedNumRecords)
      accumData.addAll(readData)
      if (accumData.size >= expectedNumRecords)
        return accumData
      if (System.currentTimeMillis() > startTime + waitTime)
        throw AssertionError("Expected " + expectedNumRecords +
          " but received only " + accumData.size +
          " records before timeout " + waitTime + " ms")
      Thread.sleep(Math.min(waitTime, 100L))
    }
  }

  /**
   * Waits until the named store is queryable and, once it is, returns a reference to the store.
   *
   * Caveat: This is a point in time view and it may change due to partition reassignment.
   * That is, the returned store may still not be queryable in case a rebalancing is happening or
   * happened around the same time.  This caveat is acceptable for testing purposes when only a
   * single `KafkaStreams` instance of the application is running.
   *
   * @param streams            the `KafkaStreams` instance to which the store belongs
   * @param storeName          the name of the store
   * @param queryableStoreType the type of the (queryable) store
   * @param <T>                the type of the (queryable) store
   * @return the same store, which is now ready for querying (but see caveat above)
  </T> */
  @Throws(InterruptedException::class)
  fun <T> waitUntilStoreIsQueryable(
    storeName: String,
    queryableStoreType: QueryableStoreType<T>,
    streams: KafkaStreams
  ): T {
    while (true) {
      try {
        return streams.store(storeName, queryableStoreType)
      } catch (ignored: InvalidStateStoreException) {
        // store not yet ready for querying
        Thread.sleep(50)
      }

    }
  }

  /**
   * Asserts that the key-value store contains exactly the expected content and nothing more.
   *
   * @param store    the store to be validated
   * @param expected the expected contents of the store
   * @param <K>      the store's key type
   * @param <V>      the store's value type
  </V></K> */
  @Throws(InterruptedException::class)
  fun <K, V> assertThatKeyValueStoreContains(store: ReadOnlyKeyValueStore<K, V>, expected: Map<K, V>) {
    TestUtils.waitForCondition({
      expected.keys
        .stream()
        .allMatch { k -> expected[k] == store.get(k) }
    },
      30000,
      "Expected values not found in KV store")
  }

}
