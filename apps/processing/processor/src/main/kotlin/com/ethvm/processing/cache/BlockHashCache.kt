package com.ethvm.processing.cache

import com.ethvm.db.Tables.PROCESSOR_HASH_LOG
import com.ethvm.db.tables.records.ProcessorHashLogRecord
import mu.KotlinLogging
import org.jooq.DSLContext
import org.mapdb.DB
import org.mapdb.Serializer
import java.math.BigInteger
import java.util.concurrent.ScheduledExecutorService

/**
 * This cache is responsible for tracking the blockNumber => blockHash pairs that this processor has seen.
 * Its primary purpose is for ensuring we do not re-process blocks we have already seen and for identifying
 * fork blocks.
 *
 * This cache is in memory only
 */
class BlockHashCache(
  memoryDb: DB,
  scheduledExecutor: ScheduledExecutorService,
  private val processorId: String
) {

  val logger = KotlinLogging.logger {}

  // the n last blocks we reload from the database on initialisation
  private val historySize = 1000000

  private val memoryMap = memoryDb
    .hashMap("block_hashes_$processorId")
    .keySerializer(Serializer.BIG_INTEGER)
    .valueSerializer(Serializer.STRING)
    .expireMaxSize(historySize.toLong())
    .expireAfterGet()
    .expireExecutor(scheduledExecutor)
    .createOrOpen()

  // list of pending db records to be committed
  private var historyRecords = emptyList<ProcessorHashLogRecord>()

  fun initialise(txCtx: DSLContext) {

    logger.info { "[$processorId] Initialising block hash cache" }

    // clear all local state
    memoryMap.clear()

    // replay the last n entries in the processor hash log

    val cursor =
      txCtx
        .selectFrom(PROCESSOR_HASH_LOG)
        .where(PROCESSOR_HASH_LOG.PROCESSOR_ID.eq(processorId))
        .orderBy(PROCESSOR_HASH_LOG.BLOCK_NUMBER.desc())
        .limit(historySize)
        .fetchSize(1000)
        .fetchLazy()

    var count = 0

    while (cursor.hasNext()) {

      val next = cursor.fetchNext()

      val blockNumber = next.blockNumber.toBigInteger()
      memoryMap[blockNumber] = next.blockHash

      count += 1
      logger.trace { "[$processorId] Reloaded block = $blockNumber" }
    }

    cursor.close()

    logger.info { "[$processorId] Initialisation complete. $count records loaded" }
  }

  fun reset(txCtx: DSLContext) {

    // remove all state for this processor from the db

    txCtx
      .deleteFrom(PROCESSOR_HASH_LOG)
      .where(PROCESSOR_HASH_LOG.PROCESSOR_ID.eq(processorId))
      .execute()

  }

  operator fun get(number: BigInteger): String? = memoryMap[number]

  operator fun set(number: BigInteger, hash: String) {

    // update in memory map
    memoryMap[number] = hash

    // generate a db record to be written later

    val cache = this

    historyRecords = historyRecords +
      ProcessorHashLogRecord().apply {
        this.processorId = cache.processorId
        this.blockNumber = number.toBigDecimal()
        this.blockHash = hash
      }
  }

  fun removeKeysFrom(txCtx: DSLContext, from: BigInteger) {

    logger.info { "[$processorId] Removing keys starting with $from" }

    var key = from

    // remove from local store

    while (memoryMap.containsKey(key)) {
      memoryMap.remove(key)
      key = key.plus(BigInteger.ONE)
    }

    // remove from db

    txCtx
      .deleteFrom(PROCESSOR_HASH_LOG)
      .where(PROCESSOR_HASH_LOG.BLOCK_NUMBER.ge(from.toBigDecimal()))
      .and(PROCESSOR_HASH_LOG.PROCESSOR_ID.eq(processorId))
      .execute()

  }

  fun writeToDb(txCtx: DSLContext) {

    // flush any pending db records

    if (historyRecords.isNotEmpty()) {

      txCtx
        .batchInsert(historyRecords)
        .execute()

    }

    // reset for next transaction
    historyRecords = emptyList()
  }
}
