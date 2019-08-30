package com.ethvm.processing.cache

import com.ethvm.db.Tables.BLOCK_HEADER
import mu.KotlinLogging
import org.jooq.DSLContext
import org.mapdb.DB
import org.mapdb.Serializer
import java.math.BigInteger
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

class BlockTimestampCache(memoryDb: DB,
                          scheduledExecutor: ScheduledExecutorService,
                          private val processorId: String) {

  val logger = KotlinLogging.logger {}

  private val map = memoryDb
    .hashMap("block_times")
    .keySerializer(Serializer.BIG_INTEGER)
    .valueSerializer(Serializer.LONG)
    .expireAfterGet(5, TimeUnit.MINUTES)
    .expireExecutor(scheduledExecutor)
    .create()

  fun initialise(txCtx: DSLContext, latestBlockNumber: BigInteger) {

    val cursor = txCtx
      .select(BLOCK_HEADER.NUMBER, BLOCK_HEADER.TIMESTAMP)
      .from(BLOCK_HEADER)
      .where(BLOCK_HEADER.NUMBER.le(latestBlockNumber.toBigDecimal()))
      .orderBy(BLOCK_HEADER.NUMBER.desc())
      .limit(256)
      .fetchLazy()

    while(cursor.hasNext()) {
      val next = cursor.fetchNext()
      val blockNumber = next.value1().toBigInteger()
      map[blockNumber] = next.value2().time
      logger.info { "[$processorId] Reloaded block number = $blockNumber"}
    }

  }

  operator fun set(number: BigInteger, timestamp: Long) {
    map[number] = timestamp
  }

  operator fun get(number: BigInteger): Long? = map[number]

}
