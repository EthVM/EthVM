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
  private val tokenType: TokenType
) {

  val logger = KotlinLogging.logger {}

  private val balanceMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "non_fungible_balances",
    Serializer.STRING,
    Serializer.BIG_INTEGER
  )

  private val metadataMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "non_fungible_balances_metadata",
    Serializer.STRING,
    Serializer.BIG_INTEGER
  )

  private val cacheStores = listOf(balanceMap, metadataMap)

  private var balanceHistoryRecords = emptyList<BalanceRecord>()

  private var writeHistoryToDb = true

  fun initialise(txCtx: DSLContext) {

    logger.info { "[$tokenType] Initialising state from diskDb" }

    var latestBlockNumber = metadataMap["latestBlockNumber"] ?: BigInteger.ONE.negate()

    val latestDbBlockNumber = txCtx
      .select(BALANCE.BLOCK_NUMBER)
      .from(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .orderBy(BALANCE.BLOCK_NUMBER.desc())
      .limit(1)
      .fetchOne()
      ?.value1()?.toBigInteger() ?: BigInteger.ONE.negate()

    if (latestBlockNumber > latestDbBlockNumber) {
      logger.info { "[$tokenType] local state is ahead of the database. Resetting all local state." }
      // reset all state from the beginning as the database is behind us
      balanceMap.clear()
      metadataMap.clear()
      latestBlockNumber = BigInteger.ONE.negate()
    }

    val cursor = txCtx
      .selectFrom(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .and(BALANCE.BLOCK_NUMBER.gt(latestBlockNumber.toBigDecimal()))
      .fetchLazy()

    writeHistoryToDb = false

    var count = 0

    while (cursor.hasNext()) {
      assign(cursor.fetchNext())
      count += 1
      if (count % 1000 == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "[$tokenType] $count deltas processed" }
      }
    }

    cacheStores.forEach { it.flushToDisk(true) }

    writeHistoryToDb = true

    logger.info { "[$tokenType] Initialised. $count deltas processed" }
  }

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
        this.tokenType = this.tokenType.toString()
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

  fun writeToDb(ctx: DSLContext) {

    if (balanceHistoryRecords.isNotEmpty()) {

      balanceHistoryRecords
        .forEach { record ->

          // remove from current owner

          ctx
            .deleteFrom(BALANCE)
            .where(BALANCE.CONTRACT_ADDRESS.eq(record.contractAddress))
            .and(BALANCE.TOKEN_ID.eq(record.tokenId))
            .execute()

          // assign to new owner

          ctx
            .insertInto(BALANCE)
            .set(record)
            .execute()
        }

      metadataMap["latestBlockNumber"] = balanceHistoryRecords.last().blockNumber.toBigInteger()

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
      .and(BALANCE_DELTA.TOKEN_TYPE.eq(this.tokenType.toString()))
      .orderBy(BALANCE_DELTA.BLOCK_NUMBER.desc())
      .fetchLazy()

    // temporarily disable
    writeHistoryToDb = false

    while (cursor.hasNext()) {

      val delta = cursor.fetchNext()

      when (val tokenType = delta.tokenType) {

        this.tokenType.toString() -> assign(delta)

        else -> throw UnsupportedOperationException("Unhandled token type: $tokenType")
      }
    }

    cacheStores.forEach { it.flushToDisk() }

    // re-enable history
    writeHistoryToDb = true
  }
}
