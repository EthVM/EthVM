package com.ethvm.kafka.streams.processors.transformers

import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.kafka.streams.Serdes
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.kstream.TransformerSupplier
import org.apache.kafka.streams.kstream.internals.Change
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores

class CanonicalCounter(
  private val storeName: String
) : TransformerSupplier<CanonicalCountKeyRecord, Change<CanonicalCountRecord>, KeyValue<CanonicalCountKeyRecord, CanonicalCountRecord>?> {

  val logger: KLogger = KotlinLogging.logger {}

  val initialCount = CanonicalCountRecord.newBuilder()
    .setCount(0L)
    .build()!!

  override fun get(): Transformer<CanonicalCountKeyRecord, Change<CanonicalCountRecord>, KeyValue<CanonicalCountKeyRecord, CanonicalCountRecord>?> =
    CanonicalCountTransformer()

  private inner class CanonicalCountTransformer : Transformer<CanonicalCountKeyRecord, Change<CanonicalCountRecord>, KeyValue<CanonicalCountKeyRecord, CanonicalCountRecord>?> {

    private lateinit var context: ProcessorContext
    private lateinit var store: KeyValueStore<CanonicalCountKeyRecord, CanonicalCountRecord?>

    override fun init(context: ProcessorContext) {
      this.context = context
      this.store = context.getStateStore(storeName) as KeyValueStore<CanonicalCountKeyRecord, CanonicalCountRecord?>
    }

    override fun transform(key: CanonicalCountKeyRecord, value: Change<CanonicalCountRecord>): KeyValue<CanonicalCountKeyRecord, CanonicalCountRecord>? {

      val entityKey = CanonicalCountKeyRecord.newBuilder()
        .setEntity(key.entity)
        .build()

      val currentCount = store.get(entityKey) ?: initialCount

      // we subtract the old value and add the new value

      val delta =
        (value.newValue?.count ?: 0L) -
        (value.oldValue?.count ?: 0L)

      val newCount = CanonicalCountRecord.newBuilder()
        .setCount(currentCount.count + delta)
        .build()

      store.put(entityKey, newCount)

      return KeyValue(key, newCount)
    }

    override fun close() {
      // Do nothing
    }
  }

  companion object {

    fun <V> store(name: String, valueSerde: Serde<V>, unitTesting: Boolean = false): StoreBuilder<KeyValueStore<CanonicalCountKeyRecord, V>> =
      store(name, Serdes.CanonicalCountKey(), valueSerde, unitTesting)

    private fun <K, V> store(name: String, keySerde: Serde<K>, valueSerde: Serde<V>, unitTesting: Boolean = false): StoreBuilder<KeyValueStore<K, V>> {
      val supplier = if (unitTesting)
        Stores.inMemoryKeyValueStore(name)
      else
        Stores.persistentKeyValueStore(name)

      val store = Stores
        .keyValueStoreBuilder(supplier, keySerde, valueSerde)
        .withCachingEnabled()

      return if (unitTesting) store.withLoggingDisabled() else store
    }
  }
}
