package com.ethvm.kafka.streams.processors.transformers

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.common.extensions.bigInteger
import com.ethvm.common.extensions.byteBuffer
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
import java.math.BigInteger

class CanonicalKStreamReducer<V>(
  private val storeName: String,
  private val cacheSize: Int = 10_000
) : TransformerSupplier<CanonicalKeyRecord?, V?, KeyValue<CanonicalKeyRecord, Change<V>>?> {

  val logger: KLogger = KotlinLogging.logger {}

  override fun get(): Transformer<CanonicalKeyRecord?, V?, KeyValue<CanonicalKeyRecord, Change<V>>?> =
    CanonicalKStreamReduceTransformer()

  private inner class CanonicalKStreamReduceTransformer : Transformer<CanonicalKeyRecord?, V?, KeyValue<CanonicalKeyRecord, Change<V>>?> {

    private lateinit var context: ProcessorContext
    private lateinit var store: KeyValueStore<CanonicalKeyRecord, V?>

    override fun init(context: ProcessorContext) {
      this.context = context
      this.store = context.getStateStore(storeName) as KeyValueStore<CanonicalKeyRecord, V?>
    }

    override fun transform(key: CanonicalKeyRecord?, value: V?): KeyValue<CanonicalKeyRecord, Change<V>>? {

      if (key == null) {
        logger.warn { "Skipping record due to null key. topic=[${context.topic()}] partition=[${context.partition()}] offset=[${context.offset()}]" }
      }

      val oldValue = store.get(key)
      store.put(key, value)

      val change = Change<V>(value, oldValue)

      cleanStore(key)

      if (change.newValue == null && change.oldValue == null) {
        return null
      } else {
        return KeyValue(key!!, change)
      }

    }

    private fun cleanStore(key: CanonicalKeyRecord?) {

      if (key == null) return // do nothing

      val startNumber = key.number.bigInteger().minus(cacheSize.toBigInteger())

      var oldNumber = startNumber
      var oldValue: V?

      var removed = 0

      do {
        oldValue = store.delete(
          CanonicalKeyRecord.newBuilder()
            .setNumber(oldNumber.byteBuffer())
            .build()
        )

        if (oldValue != null) {
          removed += 1
        }

        oldNumber = oldNumber.minus(BigInteger.ONE)
      } while (oldValue != null)

      if (removed > 0) {
        logger.debug { "[${context.topic()}] Cleaned store. Removed $removed entries before and including $startNumber" }
      }

    }

    override fun close() {
      // Do nothing
    }

  }

  companion object {

    fun <V> store(name: String, valueSerde: Serde<V>, unitTesting: Boolean = false): StoreBuilder<KeyValueStore<CanonicalKeyRecord, V>> =
      store(name, Serdes.CanonicalKey(), valueSerde, unitTesting)

    private fun <K, V> store(name: String, keySerde: Serde<K>, valueSerde: Serde<V>, unitTesting: Boolean = false): StoreBuilder<KeyValueStore<K, V>> {
      val supplier = if (unitTesting)
        Stores.inMemoryKeyValueStore(name)
      else
        Stores.persistentKeyValueStore(name)

      val store = Stores.keyValueStoreBuilder(supplier, keySerde, valueSerde)
      return if (unitTesting) store.withLoggingDisabled() else store
    }

  }
}
