package com.ethvm.processing.cache

import arrow.core.Tuple3
import com.ethvm.avro.processing.TokenType
import com.ethvm.db.Tables.ADDRESS_TOKEN_COUNT
import com.ethvm.db.Tables.ADDRESS_TOKEN_COUNT_DELTA
import com.ethvm.db.Tables.BALANCE
import com.ethvm.db.Tables.BALANCE_DELTA
import com.ethvm.db.Tables.CONTRACT_HOLDER_COUNT
import com.ethvm.db.Tables.CONTRACT_HOLDER_COUNT_DELTA
import com.ethvm.db.tables.records.AddressTokenCountRecord
import com.ethvm.db.tables.records.BalanceDeltaRecord
import com.ethvm.db.tables.records.BalanceRecord
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
  private val tokenType: TokenType,
  processorId: String,
  private val dbFetchSize: Int = 512
) {

  val logger = KotlinLogging.logger {}

  // for tracking latest processed block number
  private val metadataMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_fungible_balances_metadata",
    Serializer.STRING,
    Serializer.BIG_INTEGER,
    BigInteger.ZERO,
    1024 // 1kb
  )

  // for tracking fungible balances such as ether or erc20
  private val balanceMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_fungible_balances",
    Serializer.STRING,
    Serializer.BIG_INTEGER,
    BigInteger.ZERO,
    1024 * 1024 * 128 // 128 mb
  )

  // for tracking the total number of fungible tokens an address has
  private val addressTokenCountMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_address_fungible_token_balance_count",
    Serializer.STRING,
    Serializer.LONG,
    0L,
    1024 * 1024 * 32 // 32 mb
  )

  // for tracking the total number of non zero balance holders of a fungible token
  private val contractHolderCountMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_fungible_token_holder_count",
    Serializer.STRING,
    Serializer.LONG,
    0L,
    1024 * 1024 * 16 // 16 mb
  )

  // convenience list of all cache stores
  private val cacheStores = listOf(balanceMap, metadataMap, addressTokenCountMap, contractHolderCountMap)

  // various lists of pending db records
  private var balanceRecords = emptyList<BalanceRecord>()
  private var addressTokenCountRecords = emptyList<AddressTokenCountRecord>()
  private var contractHolderCountRecords = emptyList<ContractHolderCountRecord>()

  // controls whether or not db records are generated during modifications
  private var writeHistoryToDb = true

  fun initialise(txCtx: DSLContext) {

    logger.info { "[$tokenType] Initialising" }

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

    // disable db record generation until initialisation is complete
    writeHistoryToDb = false

    logger.info { "[$tokenType] Opening cursor for balance history" }

    val balanceCursor = txCtx
      .selectFrom(BALANCE)
      .where(BALANCE.TOKEN_TYPE.eq(tokenType.toString()))
      .and(BALANCE.BLOCK_NUMBER.gt(lastChangeBlockNumber.toBigDecimal()))
      .fetchSize(dbFetchSize)
      .fetchLazy()

    var count = 0

    while (balanceCursor.hasNext()) {
      set(balanceCursor.fetchNext())
      count += 1
      if (count % dbFetchSize == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "[$tokenType] $count deltas processed" }
      }
    }

    balanceCursor.close()

    logger.info { "[$tokenType] Balance history reloaded. $count deltas processed" }

    count = 0

    logger.info { "[$tokenType] Opening cursor for address token count" }

    val addressTokenCountCursor = txCtx
      .selectFrom(ADDRESS_TOKEN_COUNT)
      .where(ADDRESS_TOKEN_COUNT.BLOCK_NUMBER.gt(lastChangeBlockNumber.toBigDecimal()))
      .and(ADDRESS_TOKEN_COUNT.TOKEN_TYPE.eq(tokenType.toString()))
      .fetchSize(dbFetchSize)
      .fetchLazy()

    while (addressTokenCountCursor.hasNext()) {
      set(addressTokenCountCursor.fetchNext())
      count += 1
      if (count % dbFetchSize == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "[$tokenType] $count address token counts processed" }
      }
    }

    addressTokenCountCursor.close()

    logger.info { "[$tokenType] Address token count reloaded. $count address token counts processed" }

    count = 0

    logger.info { "[$tokenType] Opening cursor for contract holder count" }

    val contractHolderCountCursor = txCtx
      .selectFrom(CONTRACT_HOLDER_COUNT)
      .where(CONTRACT_HOLDER_COUNT.BLOCK_NUMBER.gt(lastChangeBlockNumber.toBigDecimal()))
      .and(CONTRACT_HOLDER_COUNT.TOKEN_TYPE.eq(tokenType.toString()))
      .fetchSize(dbFetchSize)
      .fetchLazy()

    while (contractHolderCountCursor.hasNext()) {
      set(contractHolderCountCursor.fetchNext())
      count += 1
      if (count % dbFetchSize == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "[$tokenType] $count contract holder counts processed" }
      }
    }

    contractHolderCountCursor.close()

    logger.info { "[$tokenType] Contract holder count reloaded. $count contract holder counts processed" }

    // update last change block locally

    metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)
    logger.info { "Updated last change block number: ${metadataMap["lastChangeBlockNumber"]}"}

    // final flush for any lingering pending writes
    cacheStores.forEach { it.flushToDisk(true) }

    // re-enable db record generation
    writeHistoryToDb = true

    logger.info { "[$tokenType] Initialisation complete" }
  }

  fun setLastChangeBlockNumberFromDb(txCtx: DSLContext) {
    val lastChangeBlockNumber = lastChangeBlockNumberDb(txCtx)
    metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumber
    logger.info { "Last change block number override from db: $lastChangeBlockNumber" }
  }

  fun logLastChangeBlockNumber() {
    logger.info { "Last change block number: ${metadataMap["lastChangeBlockNumber"]}" }
  }

  private fun lastChangeBlockNumberDb(txCtx: DSLContext): BigInteger =
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

  fun add(delta: BalanceDeltaRecord) {

    require(delta.tokenType == tokenType.toString()) {
      "Token type mismatch: expect $tokenType, received delta with token type ${delta.tokenType}"
    }

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

    // if we ever handle more than one fungible token type this check will need updated

    if (delta.tokenType == TokenType.ERC20.toString()) {
      incrementBalanceCounts(balance) // Increment counts for fungible tokens
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

  private fun set(count: AddressTokenCountRecord) {
    addressTokenCountMap[count.address] = count.count
  }

  private fun set(count: ContractHolderCountRecord) {
    contractHolderCountMap[count.contractAddress] = count.count
  }

  private fun incrementBalanceCounts(balanceRecord: BalanceRecord) {

    val tokenTypeStr = tokenType.toString()

    require(balanceRecord.tokenType == tokenTypeStr) {
      "Token type mismatch: expect $tokenTypeStr, received delta with token type ${balanceRecord.tokenType}"
    }

    val address = balanceRecord.address
    val contractAddress = balanceRecord.contractAddress
    val blockNumber = balanceRecord.blockNumber

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

    val currentAddressCount = addressTokenCountMap[address] ?: 0L
    val currentContractCount = contractHolderCountMap[contractAddress] ?: 0L

    val addressCount = AddressTokenCountRecord()
      .apply {
        this.address = address
        this.blockNumber = blockNumber
        this.tokenType = tokenTypeStr
        this.count = currentAddressCount + countDelta
      }

    addressTokenCountMap[address] = addressCount.count

    val contractCount = ContractHolderCountRecord()
      .apply {
        this.contractAddress = contractAddress
        this.tokenType = tokenTypeStr
        this.blockNumber = blockNumber
        this.count = currentContractCount + countDelta
      }

    contractHolderCountMap[contractAddress] = contractCount.count

    if (writeHistoryToDb) {
      addressTokenCountRecords = addressTokenCountRecords + addressCount
      contractHolderCountRecords = contractHolderCountRecords + contractCount
    }
  }

  fun writeToDb(txCtx: DSLContext) {

    // conflate so we only have one update per block. At a later date we could break it
    // down by tx

    val conflatedBalancesPerBlock = balanceRecords
      .map { r -> Tuple3(r.address, r.contractAddress, r.blockNumber) to r }
      .toMap()
      .values

    if (conflatedBalancesPerBlock.isNotEmpty()) {

      txCtx
        .batchInsert(conflatedBalancesPerBlock)
        .execute()

      // update last block number where changes occurred locally
      metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)
    }

    cacheStores.forEach { it.flushToDisk() }

    balanceRecords = emptyList()
    addressTokenCountRecords = emptyList()
    contractHolderCountRecords = emptyList()
  }

  fun reset(txCtx: DSLContext) {

    // reset all the cache stores
    cacheStores.forEach { it.clear() }

    val tokenTypeStr = tokenType.toString()

    // delete all history

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
        .fetchSize(dbFetchSize)
        .fetchLazy()

      while (cursor.hasNext()) {

        val delta = cursor.fetchNext()

        require(delta.tokenType == tokenTypeStr) {
          "Token type mismatch: expect $tokenTypeStr, received delta with token type ${delta.tokenType}"
        }

        delta.amount = delta.amount.negate()

        // this should not only rewind the balances but also the various counts
        add(delta)
      }

      cursor.close()

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
        .where(ADDRESS_TOKEN_COUNT_DELTA.TOKEN_TYPE.eq(tokenTypeStr))
        .and(ADDRESS_TOKEN_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      logger.info { "[$tokenType] Deleting contract holder count entries" }

      txCtx
        .deleteFrom(CONTRACT_HOLDER_COUNT)
        .where(CONTRACT_HOLDER_COUNT.TOKEN_TYPE.eq(tokenTypeStr))
        .and(CONTRACT_HOLDER_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      logger.info { "[$tokenType] Deleting contract holder count delta entries" }

      txCtx
        .deleteFrom(CONTRACT_HOLDER_COUNT_DELTA)
        .where(CONTRACT_HOLDER_COUNT_DELTA.TOKEN_TYPE.eq(tokenTypeStr))
        .and(CONTRACT_HOLDER_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      // update last block number where changes occurred locally
      metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)

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
