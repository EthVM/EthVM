package com.ethvm.processing.cache

import arrow.core.Tuple3
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

class FungibleBalanceCache(
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
    "fungible_balances",
    Serializer.STRING,
    Serializer.BIG_INTEGER
  )

  private val metadataMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "fungible_balances_metadata",
    Serializer.STRING,
    Serializer.BIG_INTEGER
  )

  private val cacheStores = listOf(balanceMap, metadataMap)

  private var balanceRecords = emptyList<BalanceRecord>()

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
      set(cursor.fetchNext())
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

  fun add(delta: BalanceDeltaRecord) {

    val cache = this
    val currentBalance = get(delta.address, delta.contractAddress) ?: BigInteger.ZERO

    val balance = BalanceRecord()
      .apply {
        this.blockNumber = delta.blockNumber
        this.blockHash = delta.blockHash
        this.timestamp = delta.timestamp
        this.address = delta.address
        this.contractAddress = delta.contractAddress
        this.tokenType = cache.tokenType.toString()
        this.balance = (currentBalance + delta.amount.toBigInteger()).toBigDecimal()
      }

    set(balance)
  }

  private fun set(balance: BalanceRecord) {

    val keyStr = "${balance.address}:${balance.contractAddress}"
    balanceMap[keyStr] = balance.balance.toBigInteger()

    if (writeHistoryToDb) {
      balanceRecords = balanceRecords + balance
    }
  }

  fun writeToDb(ctx: DSLContext) {

    // conflate so we only have one update per block. At a later date we could break it
    // down by tx

    val conflatedPerBlock = balanceRecords
      .map { r -> Tuple3(r.address, r.contractAddress, r.blockNumber) to r }
      .toMap()
      .values

    if (conflatedPerBlock.isNotEmpty()) {

      ctx
        .batchInsert(conflatedPerBlock)
        .execute()

      metadataMap["latestBlockNumber"] = conflatedPerBlock.last().blockNumber.toBigInteger()
    }

    cacheStores.forEach { it.flushToDisk() }

    balanceRecords = emptyList()
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

    logger.info { "[$tokenType] Rewinding until block = $blockNumber" }

    val blockNumberDecimal = blockNumber.toBigDecimal()

    if (blockNumber > BigInteger.ZERO) {

      val cursor = txCtx
        .selectFrom(BALANCE_DELTA)
        .where(BALANCE_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .and(BALANCE_DELTA.TOKEN_TYPE.eq(tokenType.toString()))
        .orderBy(BALANCE_DELTA.BLOCK_NUMBER.desc())
        .fetchLazy()

      // disable generation of history records temporarily

      writeHistoryToDb = false

      while (cursor.hasNext()) {

        val delta = cursor.fetchNext()

        when (val deltaTokenType = delta.tokenType) {

          tokenType.toString() -> {
            delta.amount = delta.amount.negate()
            add(delta)
          }

          else -> throw UnsupportedOperationException("Unhandled token type: $deltaTokenType. Expected $tokenType")
        }
      }

      txCtx
        .deleteFrom(BALANCE)
        .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()).and(BALANCE.BLOCK_NUMBER.ge(blockNumberDecimal)))
        .execute()

      txCtx
        .deleteFrom(BALANCE_DELTA)
        .where(BALANCE_DELTA.TOKEN_TYPE.eq(tokenType.toString()).and(BALANCE_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal)))
        .execute()

      // re-enable generation of history records
      writeHistoryToDb = true
    } else {

      balanceMap.clear()
    }

    cacheStores.forEach { it.flushToDisk() }

    logger.info { "[$tokenType] Rewind complete" }
  }
}
