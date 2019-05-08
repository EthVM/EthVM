package com.ethvm.kafka.streams.processors.transformers

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.kafka.streams.Serdes
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class OncePerBlockTransformer(
  private val unitTesting: Boolean = false
) : Transformer<CanonicalKeyRecord?, BlockHeaderRecord?, KeyValue<CanonicalKeyRecord, BlockHeaderRecord?>> {

  companion object {

    private const val STORE_NAME_ONCE_PER_BLOCK = "once-per-block"

    val STORE_NAMES = arrayOf(STORE_NAME_ONCE_PER_BLOCK)

    fun canonicalRecordsStore(unitTesting: Boolean = false): StoreBuilder<KeyValueStore<CanonicalKeyRecord, String>> =
      store(STORE_NAME_ONCE_PER_BLOCK, Serdes.CanonicalKey(), KafkaSerdes.String(), unitTesting)

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

  private lateinit var canonicalStore: KeyValueStore<CanonicalKeyRecord, String?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!
    this.canonicalStore = context.getStateStore(STORE_NAME_ONCE_PER_BLOCK) as KeyValueStore<CanonicalKeyRecord, String?>
  }

  override fun transform(key: CanonicalKeyRecord?, value: BlockHeaderRecord?): KeyValue<CanonicalKeyRecord, BlockHeaderRecord?>? {

    if (key == null) {
      logger.warn("Null key received, ignoring")
      return null
    }

    val currentRecord = canonicalStore.get(key)

    return if (currentRecord == null) {
      canonicalStore.put(key, "")
      KeyValue(key, value)
    } else null
  }

  override fun close() {
  }
}
