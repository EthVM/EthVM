package com.ethvm.processing.cache

import com.ethvm.db.Tables.BLOCK_HEADER
import mu.KotlinLogging
import org.jooq.DSLContext
import org.mapdb.DB
import org.mapdb.Serializer
import java.math.BigInteger
import java.util.concurrent.ScheduledExecutorService

/**
 * In memory cache for tracking block timestamps. Used when calculating block processing time by comparing
 * current timestamp with previous
 */
class BlockTimestampCache(
  memoryDb: DB,
  scheduledExecutor: ScheduledExecutorService,
  private val processorId: String
) {

  val logger = KotlinLogging.logger {}

  // forks can occur 192 blocks in the past maximum. We add some margin of error
  private val historySize = 256

  private val memoryMap = memoryDb
    .hashMap("${processorId}_block_times")
    .keySerializer(Serializer.BIG_INTEGER)
    .valueSerializer(Serializer.LONG)
    .expireMaxSize(historySize.toLong())
    .expireAfterGet()
    .expireExecutor(scheduledExecutor)
    .create()

  fun initialise(txCtx: DSLContext) {

    logger.info { "Initialising" }
    // load the last n block timestamps from the database

    val cursor = txCtx
      .select(BLOCK_HEADER.NUMBER, BLOCK_HEADER.TIMESTAMP)
      .from(BLOCK_HEADER)
      .orderBy(BLOCK_HEADER.NUMBER.desc())
      .limit(historySize)
      .fetchLazy()

    var count = 0

    while (cursor.hasNext()) {

      val next = cursor.fetchNext()
      val blockNumber = next.value1().toBigInteger()

      memoryMap[blockNumber] = next.value2().time

      logger.debug { "[$processorId] Reloaded block number = $blockNumber" }
      count += 1
    }

    cursor.close()

    logger.info { "Initialisation complete. $count entries processed" }
  }

  operator fun set(number: BigInteger, timestamp: Long) {
    memoryMap[number] = timestamp
  }

  operator fun get(number: BigInteger): Long? = memoryMap[number]
}
