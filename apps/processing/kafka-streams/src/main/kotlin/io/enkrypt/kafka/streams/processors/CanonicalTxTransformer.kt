package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.CanonicalRecord
import io.enkrypt.avro.capture.CompositeKeyRecord
import io.enkrypt.avro.capture.TransactionKeyRecord
import io.enkrypt.avro.processing.CanonicalApplyRecord
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores

class CanonicalTxTransformer(
  private val unitTesting: Boolean = false
) : Transformer<CanonicalKeyRecord?, CanonicalRecord?, KeyValue<TransactionKeyRecord, CanonicalApplyRecord>> {

  companion object {

    private const val STORE_NAME_CANONICAL_RECORDS = "canonical-records"

    val STORE_NAMES = arrayOf(STORE_NAME_CANONICAL_RECORDS)

    fun canonicalRecordsStore(unitTesting: Boolean = false): StoreBuilder<KeyValueStore<CompositeKeyRecord, CanonicalRecord>> =
      store(STORE_NAME_CANONICAL_RECORDS, Serdes.CompositeKey(), Serdes.Canonical(), unitTesting)

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

  private lateinit var canonicalStore: KeyValueStore<CanonicalKeyRecord, CanonicalRecord?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!
    this.canonicalStore = context.getStateStore(STORE_NAME_CANONICAL_RECORDS) as KeyValueStore<CanonicalKeyRecord, CanonicalRecord?>
  }

  override fun transform(key: CanonicalKeyRecord?, record: CanonicalRecord?): KeyValue<TransactionKeyRecord, CanonicalApplyRecord>? {

    if (key == null) {
      logger.warn("Null key received, ignoring")
      return null
    }

    val currentRecord = canonicalStore.get(key)

    if (record == null && currentRecord != null) {

      // tombstone
      forwardTxEvents(currentRecord, false)

      canonicalStore.delete(key)

    } else if (record != null && currentRecord == null) {

      // new entry
      forwardTxEvents(record, true)

    } else if (record != null && currentRecord != null && record.getBlockHash() != currentRecord.getBlockHash()) {

      // fork
      forwardTxEvents(currentRecord, false)
      forwardTxEvents(record, true)

    }

    return null
  }

  private fun forwardTxEvents(record: CanonicalRecord, apply: Boolean) {
    record.getTxHashes()
      .forEach { txHash ->
        context.forward(
          TransactionKeyRecord.newBuilder()
            .setTxHash(txHash)
            .build(),
          CanonicalApplyRecord.newBuilder()
            .setApply(apply)
            .build()
        )
      }
  }

  override fun close() {
  }
}
