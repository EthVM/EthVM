package io.enkrypt.kafka.streams.transformers

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.common.extensions.getNumberBI
import io.enkrypt.common.extensions.toHex
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores
import java.math.BigInteger

class BlockTimeTransformer(
  private val unitTesting: Boolean = false
) : Transformer<CanonicalKeyRecord, BlockHeaderRecord, KeyValue<CanonicalKeyRecord, BlockHeaderRecord>> {

  companion object {

    private const val STORE_NAME_BLOCK_TIMES = "block-times"

    val STORE_NAMES = arrayOf(STORE_NAME_BLOCK_TIMES)

    fun blockTimesStore(unitTesting: Boolean = false): StoreBuilder<KeyValueStore<String, Long>> =
      store(STORE_NAME_BLOCK_TIMES, Serdes.String(), Serdes.Long(), unitTesting)

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

  private lateinit var blockTimesStore: KeyValueStore<String, Long?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!
    this.blockTimesStore = context.getStateStore(STORE_NAME_BLOCK_TIMES) as KeyValueStore<String, Long?>
  }

  override fun transform(key: CanonicalKeyRecord, value: BlockHeaderRecord): KeyValue<CanonicalKeyRecord, BlockHeaderRecord>? {

    val timestamp = value.getTimestamp()
    checkNotNull(timestamp) { "value cannot have a null timestamp" }

    blockTimesStore.put(key.getNumberBI()!!.toHex(), timestamp)

    val blockNumber = key.getNumberBI()!!

    // genesis value throws off calculation at the start
    if (blockNumber < 2.toBigInteger())
      return KeyValue(key, value)

    val prevBlockNumber = blockNumber - BigInteger.ONE
    val prevTimestamp = blockTimesStore.get(prevBlockNumber.toHex())

    // TODO add cleanup of older state after a certain number of blocks

    return when (prevTimestamp) {
      null -> {
        KeyValue(key, value)
      }
      else -> KeyValue(
        key,
        BlockHeaderRecord.newBuilder(value)
          .setBlockTime(timestamp - prevTimestamp)
          .build()
      )
    }
  }

  override fun close() {
  }
}
