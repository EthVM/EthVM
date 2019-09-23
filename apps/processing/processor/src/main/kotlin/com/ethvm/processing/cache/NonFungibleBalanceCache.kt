package com.ethvm.processing.cache

import com.ethvm.avro.processing.TokenType
import com.ethvm.db.Tables.BALANCE
import com.ethvm.db.Tables.BALANCE_DELTA
import com.ethvm.db.tables.records.BalanceDeltaRecord
import com.ethvm.db.tables.records.BalanceRecord
import mu.KotlinLogging
import org.jooq.DSLContext
import org.mapdb.DB
import org.mapdb.Serializer
import java.math.BigInteger
import java.util.concurrent.ScheduledExecutorService

class NonFungibleBalanceCache(
  memoryDb: DB,
  diskDb: DB,
  scheduledExecutor: ScheduledExecutorService,
  private val tokenType: TokenType,
  processorId: String,
  private val dbFetchSize: Int = 512
) {

  val logger = KotlinLogging.logger {}

  private val balanceMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_non_fungible_balances",
    Serializer.STRING,
    Serializer.BIG_INTEGER,
    BigInteger.ZERO,
    1024 * 1024 * 128 // 128 mb
  )

  private val metadataMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_non_fungible_balances_metadata",
    Serializer.STRING,
    Serializer.BIG_INTEGER,
    BigInteger.ZERO,
    1024
  )

  // convenience lists
  private val cacheStores = listOf(balanceMap, metadataMap)

  // pending db records
  private var balanceHistoryRecords = emptyList<BalanceRecord>()

  // controls whether db records are generated
  private var writeHistoryToDb = true

  fun initialise(txCtx: DSLContext) {

    logger.info { "[$tokenType] Initialising state from diskDb" }

    var lastChangeBlockNumber = metadataMap["lastChangeBlockNumber"] ?: BigInteger.ONE.negate()
    val lastChangeBlockNumberDb = lastChangeBlockNumberDb(txCtx)

    logger.info { "[$tokenType] Last change block number (local): $lastChangeBlockNumber, last change block number from db: $lastChangeBlockNumberDb" }

    when {

      lastChangeBlockNumber == lastChangeBlockNumberDb -> {
        logger.info { "[$tokenType] Nothing to synchronise. Initialisation complete" }
        return
      }

      lastChangeBlockNumber > lastChangeBlockNumberDb -> {
        logger.info { "[$tokenType] local state is ahead of the database. Resetting all local state." }
        // reset all state from the beginning as the database is behind us
        cacheStores.forEach { it.clear() }
        lastChangeBlockNumber = BigInteger.ONE.negate()
      }
    }

    val cursor = txCtx
      .selectFrom(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .and(BALANCE.BLOCK_NUMBER.gt(lastChangeBlockNumber.toBigDecimal()))
      .fetchSize(dbFetchSize)
      .fetchLazy()

    writeHistoryToDb = false

    var count = 0

    while (cursor.hasNext()) {
      assign(cursor.fetchNext())
      count += 1
      if (count % dbFetchSize == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "[$tokenType] $count deltas processed" }
      }
    }

    cursor.close()

    // update last change block locally

    metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)
    logger.info { "Updated last change block number: ${metadataMap["lastChangeBlockNumber"]}" }

    cacheStores.forEach { it.flushToDisk(true) }

    writeHistoryToDb = true

    logger.info { "[$tokenType] Initialised. $count deltas processed" }
  }

  fun logLastChangeBlockNumber() {
    logger.info { "Last change block number: ${metadataMap["lastChangeBlockNumber"]}" }
  }

  fun setLastChangeBlockNumberFromDb(txCtx: DSLContext) {
    val lastChangeBlockNumber = lastChangeBlockNumberDb(txCtx)
    metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumber
    cacheStores.forEach { it.flushToDisk(true) }
    logger.info { "Last change block number override from db: $lastChangeBlockNumber" }
  }

  private fun lastChangeBlockNumberDb(txCtx: DSLContext) =
    txCtx
      .select(BALANCE.BLOCK_NUMBER)
      .from(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .orderBy(BALANCE.BLOCK_NUMBER.desc())
      .limit(1)
      .fetchOne()
      ?.value1()?.toBigInteger() ?: BigInteger.ONE.negate()

  fun get(address: String, contractAddress: String?): BigInteger? {
    // TODO optimize serialization
    val keyStr = "$address:$contractAddress"
    return balanceMap[keyStr]
  }

  fun assign(delta: BalanceDeltaRecord) {
    require(delta.tokenType == TokenType.ERC721.toString())

    val cache = this

    val newBalance = BalanceRecord()
      .apply {
        this.address = delta.address
        this.contractAddress = delta.contractAddress ?: "" // columns in the primary key cannot be null
        this.blockNumber = delta.blockNumber
        this.blockHash = delta.blockHash
        this.timestamp = delta.timestamp
        this.tokenType = cache.tokenType.toString()
        this.tokenId = delta.tokenId
      }

    assign(newBalance)
  }

  private fun assign(balance: BalanceRecord) {

    val keyStr = "${balance.address}:${balance.contractAddress}"
    balanceMap[keyStr] = balance.tokenId.toBigInteger()

    if (writeHistoryToDb) {
      balanceHistoryRecords = balanceHistoryRecords + balance
    }
  }

  fun writeToDb(txCtx: DSLContext) {

    if (balanceHistoryRecords.isNotEmpty()) {

      balanceHistoryRecords
        .forEach { record ->

          // remove from current owner

          txCtx
            .deleteFrom(BALANCE)
            .where(BALANCE.CONTRACT_ADDRESS.eq(record.contractAddress))
            .and(BALANCE.TOKEN_ID.eq(record.tokenId))
            .execute()

          // assign to new owner

          txCtx
            .insertInto(BALANCE)
            .set(record)
            .execute()
        }

      // update our local last change block block number
      metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)

      balanceHistoryRecords = emptyList()
    }

    cacheStores.forEach { it.flushToDisk() }
  }

  fun reset(txCtx: DSLContext) {

    cacheStores.forEach { it.clear() }

    txCtx
      .deleteFrom(BALANCE_DELTA)
      .where(BALANCE_DELTA.TOKEN_TYPE.eq(tokenType.toString()))
      .execute()

    txCtx
      .deleteFrom(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .execute()
  }

  fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    val cursor = txCtx
      .selectFrom(BALANCE_DELTA)
      .where(BALANCE_DELTA.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .and(BALANCE_DELTA.TOKEN_TYPE.eq(tokenType.toString()))
      .orderBy(BALANCE_DELTA.BLOCK_NUMBER.desc())
      .fetchSize(dbFetchSize)
      .fetchLazy()

    // temporarily disable
    writeHistoryToDb = false

    while (cursor.hasNext()) {

      val delta = cursor.fetchNext()

      when (val tokenType = delta.tokenType) {

        tokenType.toString() -> assign(delta)

        else -> throw UnsupportedOperationException("Unhandled token type: $tokenType")
      }
    }

    cursor.close()

    // update our local last change block block number
    metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)

    cacheStores.forEach { it.flushToDisk() }

    // re-enable history
    writeHistoryToDb = true
  }
}
