package com.ethvm.processing.processors

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.BlockRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.*
import com.ethvm.processing.cache.BlockCountsCache
import com.ethvm.processing.cache.BlockTimestampCache
import com.ethvm.processing.extensions.toDbRecords
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import org.koin.core.inject
import org.koin.core.qualifier.named
import java.math.BigInteger
import java.time.Duration

class BasicDataProcessor : AbstractProcessor<BlockRecord>("basic-data-processor") {

  override val logger = KotlinLogging.logger {}

  // the name of the blocks topic, it can change based on the chain
  private val topicBlocks: String by inject(named("topicBlocks"))

  // list of kafka topics to consume
  override val topics = listOf(topicBlocks)

  // cache for various counts
  private val blockCountsCache: BlockCountsCache = BlockCountsCache(memoryDb, diskDb, scheduledExecutor, processorId)

  // cache for keeping track of block timestamps for determining block time
  private val blockTimestampCache: BlockTimestampCache = BlockTimestampCache(memoryDb, scheduledExecutor, processorId)

  // increase the max transaction time as this processor is write heavy and we want to benefit a bit more from
  // the economies of scale with transaction writes

  override val maxTransactionTime = Duration.ofMillis(300)

  override fun initialise(txCtx: DSLContext, latestBlockNumber: BigInteger) {

    // initialise our caches

    val futures = listOf(
      executor.submit { blockTimestampCache.initialise(txCtx) },
      executor.submit { blockCountsCache.initialise(txCtx) }
    )

    // block until caches have finished initialising
    futures.forEach { it.get() }
  }

  override fun setLastChangeBlockNumberFromDb(txCtx: DSLContext) {
    blockCountsCache.setLastChangeBlockNumberFromDb(txCtx)
  }

  override fun blockHashFor(value: BlockRecord): String = value.header.hash

  override fun reset(txCtx: DSLContext) {

    txCtx.truncate(BLOCK_HEADER).execute()
    txCtx.truncate(UNCLE).execute()
    txCtx.truncate(TRANSACTION).execute()
    txCtx.truncate(TRANSACTION_RECEIPT).execute()

    blockCountsCache.reset(txCtx)
  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    val blockNumberDecimal = blockNumber.toBigDecimal()

    // rewind counts

    blockCountsCache.rewindUntil(txCtx, blockNumber)

    txCtx
      .deleteFrom(BLOCK_HEADER)
      .where(BLOCK_HEADER.NUMBER.ge(blockNumberDecimal))
      .execute()

    txCtx
      .deleteFrom(UNCLE)
      .where(UNCLE.HEIGHT.ge(blockNumberDecimal))
      .execute()

    txCtx
      .deleteFrom(TRANSACTION)
      .where(TRANSACTION.BLOCK_NUMBER.ge(blockNumberDecimal))
      .execute()

    txCtx
      .deleteFrom(TRANSACTION_RECEIPT)
      .where(TRANSACTION_RECEIPT.BLOCK_NUMBER.ge(blockNumberDecimal))
      .execute()
  }

  override fun process(txCtx: DSLContext, record: ConsumerRecord<CanonicalKeyRecord, BlockRecord>) {

    // insert basic data

    var block = record.value()

    // increment counts along the way
    blockCountsCache.count(block)

    val blockNumber = block.header.number.bigInteger()
    val prevBlockNumber = blockNumber.minus(BigInteger.ONE)

    if (blockNumber == BigInteger.ZERO) {
      // we override the 0 timestamp

      var timestampMs = netConfig.genesis.timestamp
      if (timestampMs == 0L) {
        // we are probably using a private network
        timestampMs = System.currentTimeMillis()
      }

      block = BlockRecord.newBuilder(block)
        .setHeader(
          BlockHeaderRecord.newBuilder(block.header)
            .setTimestamp(timestampMs)
            .build()
        ).build()
    }

    blockTimestampCache[blockNumber] = block.header.timestamp
    val prevBlockTimestamp = blockTimestampCache[prevBlockNumber]

    // calculate difference between this block and previous block in seconds

    val blockTime =
      if (blockNumber == BigInteger.ZERO) 0 else (block.header.timestamp - (prevBlockTimestamp ?: 0)) / 1000

    // convert to db records
    val dbRecords = block.toDbRecords(blockTime.toInt())

    txCtx
      .batchInsert(dbRecords)
      .execute()

    // let the cache flush to db
    blockCountsCache.writeToDb(txCtx)
  }
}
