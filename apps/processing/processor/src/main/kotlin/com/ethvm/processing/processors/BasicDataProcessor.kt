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

class BasicDataProcessor : AbstractProcessor<BlockRecord>() {

  override val logger = KotlinLogging.logger {}

  override val processorId = "basic-data-processor"

  private val topicBlocks: String by inject(named("topicBlocks"))

  override val topics = listOf(topicBlocks)

  private lateinit var blockCountsCache: BlockCountsCache

  private lateinit var blockTimestampCache: BlockTimestampCache

  override val maxTransactionTime = Duration.ofMillis(300)

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {

    blockTimestampCache = BlockTimestampCache(memoryDb, scheduledExecutor, processorId)
      .apply { initialise(txCtx, latestSyncBlock ?: BigInteger.ZERO) }

    blockCountsCache = BlockCountsCache(memoryDb, diskDb, scheduledExecutor)
      .apply { initialise(txCtx) }
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

    // rewind counts

    blockCountsCache.rewindUntil(txCtx, blockNumber)
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

    val blockTime =
      if (blockNumber <= BigInteger.ONE) 0 else (block.header.timestamp - (prevBlockTimestamp ?: 0)) / 1000

    // convert to db records
    val dbRecords = block.toDbRecords(blockTime.toInt())

    txCtx
      .batchInsert(dbRecords)
      .execute()

    blockCountsCache.writeToDb(txCtx)
  }
}
