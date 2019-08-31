package com.ethvm.processing.cache

import com.ethvm.db.Tables.PROCESSOR_HASH_LOG
import com.ethvm.db.tables.records.ProcessorHashLogRecord
import mu.KotlinLogging
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.mapdb.DB
import org.mapdb.Serializer
import java.math.BigDecimal
import java.math.BigInteger
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

class BlockHashCache(memoryDb: DB,
                     scheduledExecutor: ScheduledExecutorService,
                     private val processorId: String) {

  val logger = KotlinLogging.logger {}

  private var historyRecords = emptyList<ProcessorHashLogRecord>()
  private var keysToRemove = emptyList<BigInteger>()

  private val historySize = 100000

  private val store = memoryDb
    .hashMap("block_hashes_$processorId")
    .keySerializer(Serializer.BIG_INTEGER)
    .valueSerializer(Serializer.STRING)
    .expireAfterCreate(3, TimeUnit.HOURS)
    .expireExecutor(scheduledExecutor)
    .createOrOpen()

  operator fun get(number: BigInteger): String? = store[number]

  operator fun set(number: BigInteger, hash: String) {
    store[number] = hash

    val cache = this

    historyRecords = historyRecords +
      ProcessorHashLogRecord().apply {
        this.processorId = cache.processorId
        this.blockNumber = number.toBigDecimal()
        this.blockHash = hash
      }
  }

  fun initialise(ctx: DSLContext) {

    // clear all local state
    store.clear()

    ctx.transaction { txConfig ->

      val txCtx = DSL.using(txConfig)

      logger.info { "[$processorId] Initialising block hash cache" }

      val cursor =
        txCtx
          .selectFrom(PROCESSOR_HASH_LOG)
          .where(PROCESSOR_HASH_LOG.PROCESSOR_ID.eq(processorId))
          .orderBy(PROCESSOR_HASH_LOG.BLOCK_NUMBER.desc())
          .limit(historySize)
          .fetchLazy()

      var firstBlockNumber: BigDecimal? = null

      while (cursor.hasNext()) {
        val next = cursor.fetchNext()
        val blockNumber = next.blockNumber.toBigInteger()
        store[blockNumber] = next.blockHash
        logger.debug { "[$processorId] Reloaded block = $blockNumber" }

        firstBlockNumber = firstBlockNumber ?: next.blockNumber
      }

      logger.info { "[$processorId] Initialisation complete" }
    }

  }

  fun removeKeysFrom(from: BigInteger) {
    var key = from
    while (store.containsKey(key)) {
      store.remove(key)
      key = key.plus(BigInteger.ONE)
      keysToRemove = keysToRemove + key
    }
  }

  fun writeToDb(txCtx: DSLContext) {

    if(historyRecords.isNotEmpty()) {

      txCtx
        .deleteFrom(PROCESSOR_HASH_LOG)
        .where(PROCESSOR_HASH_LOG.BLOCK_NUMBER.`in`(keysToRemove.map { it.toBigDecimal() }))
        .execute()

      txCtx
        .batchInsert(historyRecords)
        .execute()

    }


    keysToRemove = emptyList()
    historyRecords = emptyList()

  }

}
