package com.ethvm.processing.processors

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.BlockRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.common.config.NetConfig
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.*
import com.ethvm.processing.cache.BlockCountsCache
import com.ethvm.processing.cache.BlockTimestampCache
import com.ethvm.processing.extensions.toDbRecords
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import org.jooq.exception.DataAccessException
import org.koin.core.inject
import org.koin.core.qualifier.named
import java.math.BigInteger
import java.util.*
import java.util.concurrent.ScheduledExecutorService

class BasicDataProcessor : AbstractProcessor<BlockRecord>() {

  override val logger = KotlinLogging.logger {}

  override val processorId = "basic-data-processor"

  override val kafkaProps = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 4)
    }

  private val topicBlocks: String by inject(named("topicBlocks"))

  override val topics = listOf(topicBlocks)

  private lateinit var blockCountsCache: BlockCountsCache

  private lateinit var blockTimestampCache: BlockTimestampCache

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {

    blockTimestampCache = BlockTimestampCache(memoryDb, scheduledExecutor, processorId)
      .apply { initialise(txCtx, latestSyncBlock ?: BigInteger.ZERO) }

    blockCountsCache = BlockCountsCache(memoryDb, diskDb, scheduledExecutor)
      .apply { initialise(txCtx) }

  }

  override fun blockHashFor(value: BlockRecord): String = value.header.hash

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

    txCtx
      .deleteFrom(CANONICAL_COUNT)
      .where(CANONICAL_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
      .execute()


    // rewind counts

    blockCountsCache.rewindUntil(txCtx, blockNumber)

  }


  override fun process(txCtx: DSLContext, records: List<ConsumerRecord<CanonicalKeyRecord, BlockRecord>>) {

    // insert basic data

    val dbRecords = records
      .map { record ->

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
        block.toDbRecords(blockTime.toInt())
      }
      .flatten()

    try {

      txCtx
        .batchInsert(
          dbRecords
        ).execute()

      blockCountsCache.writeToDb(txCtx)

    } catch (e: DataAccessException) {
      throw e
    }


  }

}
