package com.ethvm.processing.cache

import arrow.core.Tuple3
import com.ethvm.avro.processing.TokenType
import com.ethvm.db.Tables.ADDRESS_TOKEN_COUNT
import com.ethvm.db.Tables.ADDRESS_TOKEN_COUNT_DELTA
import com.ethvm.db.Tables.BALANCE
import com.ethvm.db.Tables.BALANCE_DELTA
import com.ethvm.db.Tables.CONTRACT_HOLDER_COUNT
import com.ethvm.db.Tables.CONTRACT_HOLDER_COUNT_DELTA
import com.ethvm.db.tables.records.AddressTokenCountDeltaRecord
import com.ethvm.db.tables.records.AddressTokenCountRecord
import com.ethvm.db.tables.records.BalanceDeltaRecord
import com.ethvm.db.tables.records.BalanceRecord
import com.ethvm.db.tables.records.ContractHolderCountDeltaRecord
import com.ethvm.db.tables.records.ContractHolderCountRecord
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

  private val addressErc20BalanceCount = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "address_erc20_balance_count",
    Serializer.STRING,
    Serializer.LONG
  )

  private val erc20ContractBalanceCount = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "erc20_contract_balance_count",
    Serializer.STRING,
    Serializer.LONG
  )

  private val cacheStores = listOf(balanceMap, metadataMap, addressErc20BalanceCount, erc20ContractBalanceCount)

  private var balanceRecords = emptyList<BalanceRecord>()

  private var addressTokenCountRecords = emptyList<AddressTokenCountRecord>()
  private var addressTokenCountDeltaRecords = emptyList<AddressTokenCountDeltaRecord>()
  private var contractHolderCountRecords = emptyList<ContractHolderCountRecord>()
  private var contractHolderCountDeltaRecords = emptyList<ContractHolderCountDeltaRecord>()

  private var writeHistoryToDb = true

  fun initialise(txCtx: DSLContext) {

    logger.info { "[$tokenType] Initialising state from diskDb" }

    var latestBlockNumber = metadataMap["latestBlockNumber"] ?: BigInteger.ONE.negate()

    logger.info { "Latest block number from metadata map: $latestBlockNumber" }

    val latestDbBlockNumber = txCtx
      .select(BALANCE.BLOCK_NUMBER)
      .from(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .orderBy(BALANCE.BLOCK_NUMBER.desc())
      .limit(1)
      .fetchOne()
      ?.value1()?.toBigInteger() ?: BigInteger.ONE.negate()

    logger.info { "Latest block number from db: $latestDbBlockNumber" }

    if (latestBlockNumber > latestDbBlockNumber) {
      logger.info { "[$tokenType] local state is ahead of the database. Resetting all local state." }
      // reset all state from the beginning as the database is behind us
      balanceMap.clear()
      metadataMap.clear()
      latestBlockNumber = BigInteger.ONE.negate()
    }

    logger.info { "Opening cursor for balance history" }

    val cursor = txCtx
      .selectFrom(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .and(BALANCE.BLOCK_NUMBER.gt(latestBlockNumber.toBigDecimal()))
      .fetchSize(1000)
      .fetchLazy()

    writeHistoryToDb = false

    var count = 0

    while (cursor.hasNext()) {
      set(cursor.fetchNext())
      count += 1
      if (count % 10000 == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "[$tokenType] $count deltas processed" }
      }
    }

    cursor.close()

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

    if (balance.contractAddress != null) {
      incrementBalanceCounts(balance) // Increment counts for erc20 tokens
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

  private fun incrementBalanceCounts(balanceRecord: BalanceRecord) {

    val address = balanceRecord.address
    val contractAddress = balanceRecord.contractAddress
    val blockNumber = balanceRecord.blockNumber

    // TODO throw error if no contract address is set?

    val currentBalance = get(address, contractAddress) ?: BigInteger.ZERO
    val newBalance = balanceRecord.balance.toBigInteger()

    val countDelta = when {
      currentBalance == BigInteger.ZERO && newBalance > BigInteger.ZERO -> {
        // add
        1
      }
      currentBalance > BigInteger.ZERO && newBalance == BigInteger.ZERO -> {
        // remove
        -1
      }
      else -> return
    }

    val tokenTypeStr = tokenType.toString()

    val addressCountDelta = AddressTokenCountDeltaRecord()
      .apply {
        this.address = address
        this.blockNumber = blockNumber
        this.tokenType = tokenTypeStr
        this.delta = countDelta
      }

    val contractCountDelta = ContractHolderCountDeltaRecord()
      .apply {
        this.contractAddress = contractAddress
        this.tokenType = tokenTypeStr
        this.blockNumber = blockNumber
        this.delta = countDelta
      }

    val currentAddressCount = addressErc20BalanceCount[address] ?: 0L
    val currentContractCount = erc20ContractBalanceCount[contractAddress] ?: 0L

    val addressCount = AddressTokenCountRecord()
      .apply {
        this.address = address
        this.blockNumber = blockNumber
        this.tokenType = tokenTypeStr
        this.count = currentAddressCount + addressCountDelta.delta
      }

    addressErc20BalanceCount[address] = addressCount.count

    val contractCount = ContractHolderCountRecord()
      .apply {
        this.contractAddress = contractAddress
        this.tokenType = tokenTypeStr
        this.blockNumber = blockNumber
        this.count = currentContractCount + contractCountDelta.delta
      }

    erc20ContractBalanceCount[contractAddress] = contractCount.count

    if (writeHistoryToDb) {
      addressTokenCountRecords = addressTokenCountRecords + addressCount
      addressTokenCountDeltaRecords = addressTokenCountDeltaRecords + addressCountDelta
      contractHolderCountRecords = contractHolderCountRecords + contractCount
      contractHolderCountDeltaRecords = contractHolderCountDeltaRecords + contractCountDelta
    }
  }

  fun writeToDb(ctx: DSLContext) {

    // conflate so we only have one update per block. At a later date we could break it
    // down by tx

    val conflatedBalancesPerBlock = balanceRecords
      .map { r -> Tuple3(r.address, r.contractAddress, r.blockNumber) to r }
      .toMap()
      .values

    if (conflatedBalancesPerBlock.isNotEmpty()) {

      ctx
        .batchInsert(conflatedBalancesPerBlock)
        .execute()

      val conflatedAddressTokenCountsPerBlock = addressTokenCountRecords
        .map { r -> Tuple3(r.address, r.tokenType, r.blockNumber) to r }
        .toMap()
        .values

      ctx
        .batchInsert(addressTokenCountDeltaRecords + conflatedAddressTokenCountsPerBlock)
        .execute()

      val conflatedContractHolderCountsPerBlock = contractHolderCountRecords
        .map { r -> Tuple3(r.contractAddress, r.tokenType, r.blockNumber) to r }
        .toMap()
        .values

      ctx
        .batchInsert(contractHolderCountDeltaRecords + conflatedContractHolderCountsPerBlock)
        .execute()

      metadataMap["latestBlockNumber"] = conflatedBalancesPerBlock.last().blockNumber.toBigInteger()
    }

    cacheStores.forEach { it.flushToDisk() }

    balanceRecords = emptyList()
    addressTokenCountRecords = emptyList()
    addressTokenCountDeltaRecords = emptyList()
    contractHolderCountRecords = emptyList()
    contractHolderCountDeltaRecords = emptyList()
  }

  fun reset(txCtx: DSLContext) {

    cacheStores.forEach { it.clear() }

    val tokenTypeStr = tokenType.toString()

    txCtx
      .deleteFrom(BALANCE_DELTA)
      .where(BALANCE_DELTA.TOKEN_TYPE.eq(tokenTypeStr))
      .execute()

    txCtx
      .deleteFrom(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenTypeStr))
      .execute()

    txCtx
      .deleteFrom(ADDRESS_TOKEN_COUNT)
      .where(ADDRESS_TOKEN_COUNT.TOKEN_TYPE.eq(tokenTypeStr))
      .execute()

    txCtx
      .deleteFrom(ADDRESS_TOKEN_COUNT_DELTA)
      .where(ADDRESS_TOKEN_COUNT_DELTA.TOKEN_TYPE.eq(tokenTypeStr))
      .execute()

    txCtx
      .deleteFrom(CONTRACT_HOLDER_COUNT)
      .where(CONTRACT_HOLDER_COUNT.TOKEN_TYPE.eq(tokenTypeStr))
      .execute()

    txCtx
      .deleteFrom(CONTRACT_HOLDER_COUNT_DELTA)
      .where(CONTRACT_HOLDER_COUNT_DELTA.TOKEN_TYPE.eq(tokenTypeStr))
      .execute()
  }

  fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    logger.info { "[$tokenType] Rewinding until block = $blockNumber" }

    val blockNumberDecimal = blockNumber.toBigDecimal()

    if (blockNumber > BigInteger.ZERO) {

      // disable generation of history records temporarily

      writeHistoryToDb = false

      val tokenTypeStr = tokenType.toString()

      logger.info { "[$tokenType] Replaying balance deltas" }

      val cursor = txCtx
        .selectFrom(BALANCE_DELTA)
        .where(BALANCE_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .and(BALANCE_DELTA.TOKEN_TYPE.eq(tokenTypeStr))
        .orderBy(BALANCE_DELTA.BLOCK_NUMBER.desc())
        .fetchSize(1000)
        .fetchLazy()

      while (cursor.hasNext()) {

        val delta = cursor.fetchNext()

        when (val deltaTokenType = delta.tokenType) {

          tokenTypeStr -> {
            delta.amount = delta.amount.negate()
            // this should not only rewind the balances but also the various counts
            add(delta)
          }

          else -> throw UnsupportedOperationException("Unhandled token type: $deltaTokenType. Expected $tokenType")
        }

        cursor.close()
      }

      logger.info { "[$tokenType] Deleting balance entries" }

      txCtx
        .deleteFrom(BALANCE)
        .where(BALANCE.TOKEN_TYPE.eq(tokenTypeStr))
        .and(BALANCE.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      logger.info { "[$tokenType] Deleting balance delta entries" }

      txCtx
        .deleteFrom(BALANCE_DELTA)
        .where(BALANCE_DELTA.TOKEN_TYPE.eq(tokenTypeStr))
        .and(BALANCE_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      logger.info { "[$tokenType] Deleting address token count entries" }

      txCtx
        .deleteFrom(ADDRESS_TOKEN_COUNT)
        .where(ADDRESS_TOKEN_COUNT.TOKEN_TYPE.eq(tokenTypeStr))
        .and(ADDRESS_TOKEN_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      logger.info { "[$tokenType] Deleting address token count delta entries" }

      txCtx
        .deleteFrom(ADDRESS_TOKEN_COUNT_DELTA)
        .where(ADDRESS_TOKEN_COUNT_DELTA.TOKEN_TYPE.eq(tokenTypeStr).and(ADDRESS_TOKEN_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal)))
        .execute()

      logger.info { "[$tokenType] Deleting contract holder count entries" }

      txCtx
        .deleteFrom(CONTRACT_HOLDER_COUNT)
        .where(CONTRACT_HOLDER_COUNT.TOKEN_TYPE.eq(tokenTypeStr).and(CONTRACT_HOLDER_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal)))
        .execute()

      logger.info { "[$tokenType] Deleting contract holder count delta entries" }

      txCtx
        .deleteFrom(CONTRACT_HOLDER_COUNT_DELTA)
        .where(CONTRACT_HOLDER_COUNT_DELTA.TOKEN_TYPE.eq(tokenTypeStr).and(CONTRACT_HOLDER_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal)))
        .execute()

      // re-enable generation of history records
      writeHistoryToDb = true
    } else {

      logger.info { "[$tokenType] Clearing all cache stores" }
      cacheStores.forEach { it.clear() }
    }

    logger.info { "[$tokenType] Flushing cache stores to disk" }
    cacheStores.forEach { it.flushToDisk() }

    logger.info { "[$tokenType] Rewind complete" }
  }
}
