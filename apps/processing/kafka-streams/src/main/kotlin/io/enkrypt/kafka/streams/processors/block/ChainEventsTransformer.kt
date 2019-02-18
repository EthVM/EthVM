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
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores
import java.math.BigInteger
import java.nio.ByteBuffer

class ChainEventsTransformer(
  private val netConfig: NetConfig,
  private val unitTesting: Boolean = false
) : Transformer<BlockKeyRecord?, BlockRecord?, KeyValue<BlockKeyRecord, ChainEventRecord>> {

  companion object {

    private const val STORE_NAME_CHAIN_EVENTS = "chain-events"
    private const val STORE_NAME_INDICES = "chain-events-indices"

    const val META_HIGH = "high"

    val STORE_NAMES = arrayOf(STORE_NAME_CHAIN_EVENTS, STORE_NAME_INDICES)

    fun chainEventsStore(unitTesting: Boolean = false): StoreBuilder<KeyValueStore<ReorgKeyRecord, BlockChainEventsRecord>> =
      store(STORE_NAME_CHAIN_EVENTS, Serdes.ReorgKey(), Serdes.BlockChainEvents(), unitTesting)

    fun indexStore(unitTesting: Boolean = false): StoreBuilder<KeyValueStore<ReorgKeyRecord, ReorgKeyRecord>> =
      store(STORE_NAME_INDICES, Serdes.ReorgKey(), Serdes.ReorgKeyValue(), unitTesting)

    private fun <K, V> store(name: String, keySerde: Serde<K>, valueSerde: Serde<V>, unitTesting: Boolean = false): StoreBuilder<KeyValueStore<K, V>> {
      val supplier = if (unitTesting)
        Stores.inMemoryKeyValueStore(name)
      else
        Stores.persistentKeyValueStore(name)

      val store = Stores.keyValueStoreBuilder(supplier, keySerde, valueSerde)
      return if (unitTesting) store.withLoggingDisabled() else store
    }
  }

  private val forkLength = 256 // roughly 1 hour of blocks

  private lateinit var context: ProcessorContext

  private lateinit var chainEventsStore: KeyValueStore<ReorgKeyRecord, BlockChainEventsRecord?>
  private lateinit var indexStore: KeyValueStore<ReorgKeyRecord, ReorgKeyRecord?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!

    this.chainEventsStore = context.getStateStore(STORE_NAME_CHAIN_EVENTS) as KeyValueStore<ReorgKeyRecord, BlockChainEventsRecord?>
    this.indexStore = context.getStateStore(STORE_NAME_INDICES) as KeyValueStore<ReorgKeyRecord, ReorgKeyRecord?>
  }

  override fun transform(key: BlockKeyRecord?, block: BlockRecord?): KeyValue<BlockKeyRecord, ChainEventRecord>? {

    if (key == null) {
      logger.warn("Null key received, ignoring")
      return null
    }

    if (block == null) {
      logger.warn("Null block received, ignoring")
      return null
    }

    when (reorgDetected(block)) {
      true -> onReorg(key, block)
      false -> {
        ensureSequentialProcessing(block)
        storeAndForward(key, block)
      }
    }

    return null
  }

  private fun ensureSequentialProcessing(block: BlockRecord) {

    val highest = getHighestBlockNumber()
    val received = block.getHeader().getNumber().unsignedBigInteger()!!

    if (received > highest) {
      val nextNumber = highest + BigInteger.ONE
      check(received == nextNumber) {
        "Block out of sequence. Expected = $nextNumber, received = $received"
      }
    }
  }

  private fun reorgDetected(block: BlockRecord): Boolean {

    val blockHash = block.getHeader().getHash()

    val key = ReorgKeyRecord.newBuilder()
      .setBlockNumber(block.getHeader().getNumber())
      .build()

    val value = indexStore.get(key)

    return value != null && value.getBlockHash() != blockHash
  }

  private fun storeAndForward(key: BlockKeyRecord, block: BlockRecord) {

    val blockHeader = block.getHeader()
    val blockNumber = blockHeader.getNumber()
    val blockHash = blockHeader.getHash()

    val blockHashKey = ReorgKeyRecord.newBuilder().setBlockHash(blockHash).build()

    if (chainEventsStore.get(blockHashKey) != null) {
      // we have already processed this block, do nothing
      logger.warn { "Ignoring block ${blockNumber.unsignedBigInteger()}, already processed" }
      putHighestBlockNumber(blockNumber)
      return
    }

    val chainEvents = ChainEvents.forBlock(block, netConfig)

    val chainEventsRecord = BlockChainEventsRecord
      .newBuilder()
      .setEvents(chainEvents)
      .build()

    val blockNumberKey = ReorgKeyRecord.newBuilder().setBlockNumber(blockNumber).build()

    // blockHash => chain events
    chainEventsStore.put(blockHashKey, chainEventsRecord)

    // blockNumber => blockHash index
    indexStore.put(blockNumberKey, blockHashKey)

    // index each transaction so we can detect drop/replace
    block.getTransactions().forEach { tx ->

      val accountNonceKey = ReorgKeyRecord.newBuilder()
        .setAddress(tx.getFrom())
        .setNonce(tx.getNonce())
        .build()

      val txHash = tx.getHash()

      val blockAndTxKey = ReorgKeyRecord.newBuilder()
        .setBlockHash(blockHash)
        .setTxHash(txHash)
        .build()

      // check if we already have an entry for this (account,nonce) pair

      val existingBlockAndTxKey = indexStore.get(accountNonceKey)

      if (existingBlockAndTxKey != null) {
        // drop and replace is occurring
        reverseTransaction(key, blockHash, txHash)
      }

      // (account, nonce) => (blockHash, txHash)
      indexStore.put(accountNonceKey, blockAndTxKey)
    }

    // forward the events onward
    chainEvents.forEach { context.forward(key, it) }

    // store the highest received block number
    putHighestBlockNumber(blockNumber)

    // cleanup state
    cleanupState(blockNumber.unsignedBigInteger()!!)
  }

  /**
   * This operation should be in-frequent which is why we currently don't index the tx events
   */
  private fun reverseTransaction(blockKey: BlockKeyRecord, blockHash: Data32, txHash: Data32) {

    val key = ReorgKeyRecord.newBuilder().setBlockHash(blockHash).build()
    val record = chainEventsStore.get(key)
      ?: throw IllegalStateException("No entry found for transaction. Likely the tx is outside the fork length")

    val chainEvents = record.getEvents()

    chainEvents
      .filter { it.getTxHash() == txHash }
      .map { ChainEventRecord.newBuilder(it).setReverse(true).build() }
      .asReversed()
      .forEach { context.forward(blockKey, it) }
  }

  private fun putHighestBlockNumber(blockNumber: ByteBuffer) {
    val key = ReorgKeyRecord.newBuilder().setName(META_HIGH).build()
    val value = ReorgKeyRecord.newBuilder().setBlockNumber(blockNumber).build()
    indexStore.put(key, value)
  }

  private fun getHighestBlockNumber(): BigInteger {
    val key = ReorgKeyRecord.newBuilder().setName(META_HIGH).build()
    val value = indexStore.get(key)
    return when (value) {
      null -> if (unitTesting) BigInteger.ZERO else BigInteger.ONE.negate() // hack for now since we can't get a block summary for the genesis block when unit testing
      else -> value.getBlockNumber().unsignedBigInteger()!!
    }
  }

  private fun deleteChainEvents(blockNumber: BigInteger): BlockChainEventsRecord? {
    val blockNumberKey = ReorgKeyRecord.newBuilder().setBlockNumber(blockNumber.unsignedByteBuffer()).build()
    val blockHashKey = indexStore.delete(blockNumberKey)
    return when (blockHashKey) {
      null -> null
      else -> chainEventsStore.delete(blockHashKey)
    }
  }

  private fun onReorg(key: BlockKeyRecord, block: BlockRecord) {

    logger.info { "Re-org triggered by block key = ${key.getNumber().bigInteger()}" }

    // first we reverse all the events from highest key back to this key in preparation for the new summaries to come
    // as part of the new chain

    val forkNumber = key.getNumber().unsignedBigInteger()!!

    var numberToReverse = getHighestBlockNumber()
    var recordToReverse: BlockChainEventsRecord?

    while (numberToReverse >= forkNumber) {
      recordToReverse = deleteChainEvents(numberToReverse)

      if (recordToReverse == null) break

      val events = recordToReverse.getEvents()

      events.map { ChainEventRecord.newBuilder(it).setReverse(true).build() }
        .asReversed()
        .forEach { context.forward(key, it) }

      logger.info { "Reversed block number = $numberToReverse" }

      numberToReverse -= BigInteger.ONE
    }

    if (numberToReverse > forkNumber) throw IllegalStateException("Failed to reverse blocks all the way back to the current one")

    // commit and publish the new version of the summary for this block key
    storeAndForward(key, block)

    logger.info { "Published events for block = $forkNumber" }

    logger.info { "Re-org complete" }
  }

  /**
   *
   */
  private fun cleanupState(highestBlockNumber: BigInteger) {

    var blockNumber = highestBlockNumber - forkLength.toBigInteger()

    var stop: Boolean

    do {
      stop = deleteChainEvents(blockNumber) == null
      if (!stop) logger.debug { "Removed state for block number = $blockNumber" }
      blockNumber -= BigInteger.ONE
    } while (!stop)
  }

  override fun close() {
  }
}
