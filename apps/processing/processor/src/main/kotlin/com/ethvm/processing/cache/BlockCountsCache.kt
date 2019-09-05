package com.ethvm.processing.cache

import com.ethvm.avro.capture.BlockRecord
import com.ethvm.avro.processing.TransactionCountRecord
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.ADDRESS_TRANSACTION_COUNT
import com.ethvm.db.Tables.ADDRESS_TRANSACTION_COUNT_DELTA
import com.ethvm.db.Tables.BLOCK_HEADER
import com.ethvm.db.Tables.CANONICAL_COUNT
import com.ethvm.db.Tables.MINER_BLOCK_COUNT
import com.ethvm.db.tables.records.AddressTransactionCountDeltaRecord
import com.ethvm.db.tables.records.AddressTransactionCountRecord
import com.ethvm.db.tables.records.CanonicalCountRecord
import com.ethvm.db.tables.records.MinerBlockCountRecord
import mu.KotlinLogging
import org.jooq.DSLContext
import org.jooq.TableRecord
import org.mapdb.DB
import org.mapdb.Serializer
import java.math.BigInteger
import java.util.concurrent.ScheduledExecutorService

class BlockCountsCache(memoryDb: DB, diskDb: DB, scheduledExector: ScheduledExecutorService) {

  val logger = KotlinLogging.logger {}

  private val canonicalCountMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExector,
    "canonical_count",
    Serializer.STRING,
    Serializer.LONG
  )

  private val txCountByAddress =
    CacheStore(
      memoryDb,
      diskDb,
      scheduledExector,
      "tx_count_by_address",
      Serializer.STRING,
      MapDbSerializers.forAvro<TransactionCountRecord>(TransactionCountRecord.`SCHEMA$`)
    )

  private val minedCountByAddress =
    CacheStore(
      memoryDb,
      diskDb,
      scheduledExector,
      "mined_count_by_address",
      Serializer.STRING,
      Serializer.LONG
    )

  private val metadataMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExector,
    "counts_metadata",
    Serializer.STRING,
    Serializer.BIG_INTEGER
  )

  private val cacheStores = listOf(canonicalCountMap, txCountByAddress, minedCountByAddress, metadataMap)

  private var historyRecords = emptyList<TableRecord<*>>()

  private var writeHistoryToDb = true

  fun initialise(txCtx: DSLContext) {

    logger.info { "Initialising state from db" }

    var latestBlockNumber = metadataMap["latestBlockNumber"] ?: BigInteger.ONE.negate()

    // disable histroy generation until we have initialised
    writeHistoryToDb = false

    val latestDbBlockNumber = txCtx
      .select(CANONICAL_COUNT.BLOCK_NUMBER)
      .from(CANONICAL_COUNT)
      .orderBy(CANONICAL_COUNT.BLOCK_NUMBER.desc())
      .limit(1)
      .fetchOne()
      ?.value1()?.toBigInteger() ?: BigInteger.ONE.negate()

    if (latestBlockNumber > latestDbBlockNumber) {
      logger.info { "local state is ahead of the database. Resetting all local state." }
      // reset all state from the beginning as the database is behind us
      cacheStores.forEach { it.clear() }
      latestBlockNumber = BigInteger.ONE.negate()
      logger.info { "Local state cleared" }
    }

    txCtx
      .selectFrom(CANONICAL_COUNT)
      .where(CANONICAL_COUNT.BLOCK_NUMBER.eq(latestDbBlockNumber.toBigDecimal()))
      .fetch()
      .forEach { record ->
        set(record)
        canonicalCountMap[record.entity] = record.count
      }

    logger.info { "Reloaded canonical count state" }

    val addressTxCountCursor = txCtx
      .selectFrom(ADDRESS_TRANSACTION_COUNT)
      .where(ADDRESS_TRANSACTION_COUNT.BLOCK_NUMBER.gt(latestBlockNumber.toBigDecimal()))
      .fetchSize(1000)
      .fetchLazy()

    var count = 0

    logger.info { "Beginning reload of transaction counts" }

    while (addressTxCountCursor.hasNext()) {
      set(addressTxCountCursor.fetchNext())
      count += 1
      if (count % 1000 == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "$count entries processed" }
      }
    }

    addressTxCountCursor.close()

    count = 0

    val minerCountCursor = txCtx
      .selectFrom(MINER_BLOCK_COUNT)
      .where(MINER_BLOCK_COUNT.BLOCK_NUMBER.gt(latestBlockNumber.toBigDecimal()))
      .fetchSize(1000)
      .fetchLazy()

    logger.info { "Beginning reload of miner counts" }

    while (minerCountCursor.hasNext()) {
      set(minerCountCursor.fetchNext())
      count += 1
      if (count % 1000 == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "$count entries processed" }
      }
    }

    minerCountCursor.close()

    logger.info { "Miner counts reloaded" }

    cacheStores.forEach { it.flushToDisk(true) }

    writeHistoryToDb = true

    logger.info { "Initialised" }
  }

  fun count(block: BlockRecord) {

    incrementMinedCounts(block)
    incrementCanonicalCounts(block)
    incrementTxCounts(block)

    metadataMap["latestBlockNumber"] = block.header.number.bigInteger()
  }

  private fun incrementMinedCounts(block: BlockRecord) {
    val author = block.header.author
    incrementMinedCounts(author, block.header.number.bigInteger(), 1)
  }

  private fun incrementMinedCounts(author: String, blockNumber: BigInteger, delta: Int) {
    val current = minedCountByAddress[author] ?: 0L
    minedCountByAddress[author] = current + delta

    if (writeHistoryToDb) {
      historyRecords = historyRecords +
        MinerBlockCountRecord()
          .apply {
            this.author = author
            this.count = minedCountByAddress[author]
            this.blockNumber = blockNumber.toBigDecimal()
          }
    }
  }

  private fun incrementCanonicalCounts(block: BlockRecord) {

    val uncleDelta = block.uncles.size
    val currentUncles = canonicalCountMap["uncles"] ?: 0
    canonicalCountMap["uncles"] = currentUncles + uncleDelta

    val txDelta = block.transactions.size
    val currentTxs = canonicalCountMap["transactions"] ?: 0
    canonicalCountMap["transactions"] = currentTxs + txDelta

    if (writeHistoryToDb) {

      historyRecords = historyRecords +
        CanonicalCountRecord()
          .apply {
            this.blockNumber = block.header.number.bigInteger().toBigDecimal()
            this.entity = "uncles"
            this.count = canonicalCountMap["uncles"]
          } +
        CanonicalCountRecord()
          .apply {
            this.blockNumber = block.header.number.bigInteger().toBigDecimal()
            this.entity = "transactions"
            this.count = canonicalCountMap["transactions"]
          }
    }
  }

  private fun set(count: CanonicalCountRecord) {
    canonicalCountMap[count.entity] = count.count
  }

  private fun incrementTxCounts(block: BlockRecord) {

    val blockNumber = block.header.number.bigInteger().toBigDecimal()

    val txOutMap = block
      .transactions
      .map { it.from to 1 }
      .fold(emptyMap<String, Int>()) { map, next ->

        val address = next.first
        val delta = next.second

        map + (address to map.getOrDefault(address, 0) + delta)
      }

    val txInMap = block
      .transactions
      .filter { it.to != null }
      .map { it.to to 1 }
      .fold(emptyMap<String, Int>()) { map, next ->

        val address = next.first
        val delta = next.second

        map + (address to map.getOrDefault(address, 0) + delta)
      }

    val addresses = txInMap.keys + txOutMap.keys

    val txTotalMap = addresses
      .map { address -> Pair(address, txInMap.getOrDefault(address, 0) + txOutMap.getOrDefault(address, 0)) }
      .toMap()

    addresses
      .forEach { address ->

        val delta = AddressTransactionCountDeltaRecord()
          .apply {
            this.address = address
            this.blockNumber = blockNumber
            this.totalDelta = txTotalMap[address] ?: error("no total found for address")
            this.totalInDelta = txInMap.getOrDefault(address, 0)
            this.totalOutDelta = txOutMap.getOrDefault(address, 0)
          }

        incrementTxCounts(delta)
      }
  }

  private fun incrementTxCounts(delta: AddressTransactionCountDeltaRecord) {

    val address = delta.address
    val blockNumberDecimal = delta.blockNumber

    val current = txCountByAddress[address] ?: TransactionCountRecord.newBuilder().build()

    val balance = AddressTransactionCountRecord()
      .apply {
        this.address = address
        this.blockNumber = blockNumberDecimal
        this.total = current.total + delta.totalDelta
        this.totalIn = current.totalIn + delta.totalInDelta
        this.totalOut = current.totalOut + delta.totalOutDelta
      }

    set(balance)

    if (writeHistoryToDb) {
      historyRecords = historyRecords + balance + delta
    }
  }

  private fun set(balance: AddressTransactionCountRecord) {
    txCountByAddress[balance.address] = TransactionCountRecord
      .newBuilder()
      .setTotal(balance.total)
      .setTotalIn(balance.totalIn)
      .setTotalOut(balance.totalOut)
      .build()
  }

  private fun set(count: MinerBlockCountRecord) {
    minedCountByAddress[count.author] = count.count
  }

  fun writeToDb(ctx: DSLContext) {

    if (writeHistoryToDb) {

      ctx
        .batchInsert(historyRecords)
        .execute()
    }

    cacheStores.forEach { it.flushToDisk() }

    historyRecords = emptyList()
  }

  fun reset(txCtx: DSLContext) {

    cacheStores.forEach { it.clear() }

    txCtx.truncate(CANONICAL_COUNT).execute()
    txCtx.truncate(MINER_BLOCK_COUNT).execute()
    txCtx.truncate(ADDRESS_TRANSACTION_COUNT).execute()
    txCtx.truncate(ADDRESS_TRANSACTION_COUNT_DELTA).execute()
  }

  fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    logger.info { "Rewinding until block = $blockNumber" }

    val blockNumberDecimal = blockNumber.toBigDecimal()

    if (blockNumber > BigInteger.ZERO) {

      writeHistoryToDb = false

      txCtx
        .delete(CANONICAL_COUNT)
        .where(CANONICAL_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      val txCountCursor = txCtx
        .selectFrom(ADDRESS_TRANSACTION_COUNT_DELTA)
        .where(ADDRESS_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .orderBy(ADDRESS_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.desc())
        .fetchSize(1000)
        .fetchLazy()

      while (txCountCursor.hasNext()) {

        val delta = txCountCursor.fetchNext()

        delta.totalDelta = delta.totalOutDelta * -1
        delta.totalInDelta = delta.totalInDelta * -1
        delta.totalOutDelta = delta.totalOutDelta * -1

        incrementTxCounts(delta)
      }

      txCountCursor.close()

      val authorCursor = txCtx
        .select(BLOCK_HEADER.AUTHOR, BLOCK_HEADER.NUMBER)
        .from(BLOCK_HEADER)
        .where(BLOCK_HEADER.NUMBER.ge(blockNumberDecimal))
        .orderBy(BLOCK_HEADER.NUMBER.desc())
        .fetchSize(1000)
        .fetchLazy()

      while (authorCursor.hasNext()) {
        val next = authorCursor.fetchNext()
        incrementMinedCounts(next.value1(), next.value2().toBigInteger(), -1)
      }

      authorCursor.close()

      txCtx
        .deleteFrom(CANONICAL_COUNT)
        .where(CANONICAL_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      txCtx
        .deleteFrom(MINER_BLOCK_COUNT)
        .where(MINER_BLOCK_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      txCtx
        .deleteFrom(ADDRESS_TRANSACTION_COUNT)
        .where(ADDRESS_TRANSACTION_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      txCtx
        .deleteFrom(ADDRESS_TRANSACTION_COUNT_DELTA)
        .where(ADDRESS_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      writeHistoryToDb = true
    } else {

      cacheStores.forEach { it.clear() }
    }

    cacheStores.forEach { it.flushToDisk() }

    logger.info { "Rewind complete" }
  }
}
