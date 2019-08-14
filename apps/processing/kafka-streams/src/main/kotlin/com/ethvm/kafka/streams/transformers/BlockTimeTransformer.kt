package com.ethvm.kafka.streams.transformers

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.common.extensions.bigInteger
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores
import java.math.BigInteger
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class BlockTimeTransformer(
  private val unitTesting: Boolean = false,
  private val cacheSize: Int = 100_000
) : Transformer<CanonicalKeyRecord, BlockHeaderRecord, KeyValue<CanonicalKeyRecord, BlockHeaderRecord>> {

  companion object {

    private const val STORE_NAME_BLOCK_TIME = "block-time"

    val STORE_NAMES = arrayOf(STORE_NAME_BLOCK_TIME)

    fun blockHeaderStore(unitTesting: Boolean = false): StoreBuilder<KeyValueStore<Long, Long>> =
      store(STORE_NAME_BLOCK_TIME, KafkaSerdes.Long(), KafkaSerdes.Long(), unitTesting)

    private fun <K, V> store(name: String, keySerde: Serde<K>, valueSerde: Serde<V>, unitTesting: Boolean = false): StoreBuilder<KeyValueStore<K, V>> {
      val supplier = if (unitTesting)
        Stores.inMemoryKeyValueStore(name)
      else
        Stores.persistentKeyValueStore(name)

      val store = Stores.keyValueStoreBuilder(supplier, keySerde, valueSerde)
      return if (unitTesting) store.withLoggingDisabled() else store
    }
  }

  private lateinit var context: ProcessorContext

  private lateinit var store: KeyValueStore<Long, Long?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!
    this.store = context.getStateStore(STORE_NAME_BLOCK_TIME) as KeyValueStore<Long, Long?>
  }

  override fun transform(key: CanonicalKeyRecord, value: BlockHeaderRecord): KeyValue<CanonicalKeyRecord, BlockHeaderRecord>? {

    val blockNumber = key.number.bigInteger()
    val prevBlockNumber = blockNumber.minus(BigInteger.ONE)

    // store current block timestamp
    store.put(blockNumber.longValueExact(), value.timestamp)

    // calculate block time based on previous block timestamp
    val previousTimestamp = store.get(prevBlockNumber.longValueExact())

    val result = if (previousTimestamp == null) {
      KeyValue(key,
        BlockHeaderRecord.newBuilder(value)
          .setTimestamp(value.timestamp)
          .setBlockTime(null)
          .build()
      ) // we cannot calculate block time so we just pass it through. this should only be for genesis block
    } else {
      val blockTime = (value.timestamp - previousTimestamp) / 1000 // ms to seconds
      KeyValue(
        key,
        BlockHeaderRecord.newBuilder(value)
          .setTimestamp(value.timestamp)
          .setBlockTime(blockTime.toInt())
          .build()
      )
    }

    // clean up older entries
    cleanStore(key)

    return result
  }

  private fun cleanStore(key: CanonicalKeyRecord?) {

    if (key == null) return // do nothing

    val startNumber = key.number.bigInteger().longValueExact() - 1L

    var oldNumber = startNumber
    var oldValue: Long?

    var removed = 0

    do {
      oldValue = store.delete(oldNumber)

      if (oldValue != null) {
        removed += 1
      }

      oldNumber -= 1L
    } while (oldValue != null)

    if (removed > 0) {
      logger.debug { "[${context.topic()}] Cleaned store. Removed $removed entries before and including $startNumber" }
    }
  }

  override fun close() {
  }
}
