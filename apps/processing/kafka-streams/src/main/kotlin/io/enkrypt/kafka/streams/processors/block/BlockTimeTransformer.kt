package io.enkrypt.kafka.streams.processors.block

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.processing.BlockChainEventsRecord
import io.enkrypt.avro.processing.ChainEventRecord
import io.enkrypt.avro.processing.ReorgKeyRecord
import io.enkrypt.common.config.NetConfig
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
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
import java.nio.ByteBuffer

class BlockTimeTransformer(
  private val unitTesting: Boolean = false
) : Transformer<BlockKeyRecord?, BlockRecord?, KeyValue<BlockKeyRecord, BlockRecord>> {

  companion object {

    private const val STORE_NAME_BLOCK_TIMES = "block-times"

    val STORE_NAMES = arrayOf(STORE_NAME_BLOCK_TIMES)

    fun blockTimesStore(unitTesting: Boolean = false): StoreBuilder<KeyValueStore<ByteBuffer, Long>> =
      store(STORE_NAME_BLOCK_TIMES, Serdes.ByteBuffer(), Serdes.Long(), unitTesting)

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

  private lateinit var blockTimesStore: KeyValueStore<ByteBuffer, Long?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!
    this.blockTimesStore = context.getStateStore(STORE_NAME_BLOCK_TIMES) as KeyValueStore<ByteBuffer, Long?>
  }

  override fun transform(key: BlockKeyRecord?, block: BlockRecord?): KeyValue<BlockKeyRecord, BlockRecord>? {

    if (key == null) {
      logger.warn("Null key received, ignoring")
      return null
    }

    if (block == null) {
      logger.warn("Null block received, ignoring")
      return null
    }

    blockTimesStore.put(key.getNumber(), block.getHeader().getTimestamp())

    val blockNumber = key.getNumber().unsignedBigInteger()!!

    // genesis block throws off calculation at the start
    if(blockNumber < 2.toBigInteger()) return KeyValue(key, block)

    val prevBlockNumber = blockNumber - BigInteger.ONE

    val prevTimestamp = blockTimesStore.get(prevBlockNumber.unsignedByteBuffer())

    // TODO add cleanup of older state after a certain number of blocks

    return when(prevTimestamp) {
      null -> KeyValue(key, block)
      else -> KeyValue(
        key,
        BlockRecord.newBuilder(block)
          .setBlockTime(block.getHeader().getTimestamp() - prevTimestamp)
          .build()
      )
    }

  }

  override fun close() {
  }
}
