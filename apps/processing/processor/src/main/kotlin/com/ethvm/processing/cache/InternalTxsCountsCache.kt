package com.ethvm.processing.cache

import com.ethvm.avro.processing.BalanceDeltaType
import com.ethvm.avro.processing.TransactionCountRecord
import com.ethvm.db.Tables.*
import com.ethvm.db.tables.records.*
import mu.KotlinLogging
import org.jooq.DSLContext
import org.jooq.TableRecord
import org.mapdb.DB
import org.mapdb.Serializer
import java.math.BigInteger
import java.util.concurrent.ScheduledExecutorService

class InternalTxsCountsCache(memoryDb: DB, diskDb: DB, scheduledExecutor: ScheduledExecutorService) {

  val logger = KotlinLogging.logger {}

  private val internalTxCountByAddress = CacheStore(
      memoryDb,
      diskDb,
      scheduledExecutor,
      "internal_tx_count_by_address",
      Serializer.STRING,
      MapDbSerializers.forAvro<TransactionCountRecord>(TransactionCountRecord.`SCHEMA$`)
    )

  private val contractsCreatedByAddress = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "contracts_created_by_address",
    Serializer.STRING,
    Serializer.LONG
  )

  private val metadataMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "counts_metadata",
    Serializer.STRING,
    Serializer.BIG_INTEGER
  )

  private val cacheStores = listOf(internalTxCountByAddress, contractsCreatedByAddress, metadataMap)

  private var historyRecords = emptyList<TableRecord<*>>()

  private var writeHistoryToDb = true

  fun initialise(txCtx: DSLContext) {

    logger.info { "Initialising state from db" }

    var latestBlockNumber = metadataMap["latestBlockNumber"] ?: BigInteger.ONE.negate()

    val latestDbBlockNumber = txCtx
      .select(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER)
      .from(ADDRESS_INTERNAL_TRANSACTION_COUNT)
      .orderBy(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER.desc())
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

    logger.info { "Reloaded canonical count state" }

    val cursor = txCtx
      .selectFrom(ADDRESS_INTERNAL_TRANSACTION_COUNT)
      .where(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER.gt(latestBlockNumber.toBigDecimal()))
      .fetchSize(1000)
      .fetchLazy()

    cursor.close()

    writeHistoryToDb = false

    var count = 0

    logger.info { "Beginning reload of transaction counts" }

    while (cursor.hasNext()) {
      set(cursor.fetchNext())
      count += 1
      if (count % 1000 == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "$count entries processed" }
      }
    }

    cacheStores.forEach { it.flushToDisk(true) }

    writeHistoryToDb = true

    logger.info { "Initialised" }
  }

  fun count(balanceDeltas: List<BalanceDeltaRecord>, blockNumber: BigInteger) {

    incrementInternalTxCounts(balanceDeltas, blockNumber)
    incrementContractsCount(balanceDeltas, blockNumber)

    metadataMap["latestBlockNumber"] = blockNumber
  }

  private fun incrementContractsCount(balanceDeltas: List<BalanceDeltaRecord>, blockNumber: BigInteger) {
    val contractCreationTraces = balanceDeltas
      .filterNot { it.isReceiving }
      .filter { it.deltaType === BalanceDeltaType.CONTRACT_CREATION.toString() }

    val contractsByAddressMap = contractCreationTraces
      .map { it.address to 1 }
      .fold(emptyMap<String, Int>()) { map, next ->
        val address = next.first
        val delta = next.second
        map + (address to map.getOrDefault(address, 0) + delta)
      }

    contractsByAddressMap
      .keys
      .forEach { address ->
        val delta = AddressContractsCreatedCountDeltaRecord()
          .apply {
            this.address = address
            this.blockNumber = blockNumber.toBigDecimal()
            this.delta = contractsByAddressMap[address]
          }

        incrementContractsCount(delta)
      }
  }

  private fun incrementContractsCount(delta: AddressContractsCreatedCountDeltaRecord) {

    val address = delta.address
    val blockNumberDecimal = delta.blockNumber

    val current = contractsCreatedByAddress[address] ?: 0L

    val balance = AddressContractsCreatedCountRecord()
      .apply {
        this.address = address
        this.blockNumber = blockNumberDecimal
        this.count = current + delta.delta
      }

    contractsCreatedByAddress[address] = balance.count

    if (writeHistoryToDb) {
      historyRecords = historyRecords + balance + delta
    }
  }

  private fun incrementInternalTxCounts(balanceDeltas: List<BalanceDeltaRecord>, blockNumber: BigInteger) {

    val internalDeltaTypes =
      setOf(BalanceDeltaType.INTERNAL_TX, BalanceDeltaType.CONTRACT_CREATION, BalanceDeltaType.CONTRACT_DESTRUCTION)
        .map { it.toString() }

    val internalTxTraces = balanceDeltas
      .filter { internalDeltaTypes.contains(it.deltaType) }

    val txOutMap = internalTxTraces
      .filterNot { it.isReceiving }
      .map { it.address to 1 }
      .fold(emptyMap<String, Int>()) { map, next ->

        val address = next.first
        val delta = next.second

        map + (address to map.getOrDefault(address, 0) + delta)
      }

    val txInMap = internalTxTraces
      .filter { it.isReceiving }
      .map { it.address to 1 }
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

        val delta = AddressInternalTransactionCountDeltaRecord()
          .apply {
            this.address = address
            this.blockNumber = blockNumber.toBigDecimal()
            this.totalDelta = txTotalMap[address]!!
            this.totalInDelta = txInMap.getOrDefault(address, 0)
            this.totalOutDelta = txOutMap.getOrDefault(address, 0)
          }

        incrementInternalTxCounts(delta)
      }
  }

  private fun incrementInternalTxCounts(delta: AddressInternalTransactionCountDeltaRecord) {

    val address = delta.address
    val blockNumberDecimal = delta.blockNumber

    val current = internalTxCountByAddress[address] ?: TransactionCountRecord.newBuilder().build()

    val balance = AddressInternalTransactionCountRecord()
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

  private fun set(balance: AddressInternalTransactionCountRecord) {
    internalTxCountByAddress[balance.address] = TransactionCountRecord
      .newBuilder()
      .setTotal(balance.total)
      .setTotalIn(balance.totalIn)
      .setTotalOut(balance.totalOut)
      .build()
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

    txCtx.truncate(ADDRESS_CONTRACTS_CREATED_COUNT).execute()
    txCtx.truncate(ADDRESS_CONTRACTS_CREATED_COUNT_DELTA).execute()
    txCtx.truncate(ADDRESS_INTERNAL_TRANSACTION_COUNT).execute()
    txCtx.truncate(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA).execute()

    cacheStores.forEach { it.clear() }
  }

  fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    logger.info { "Rewinding until block = $blockNumber" }

    val blockNumberDecimal = blockNumber.toBigDecimal()

    if (blockNumber > BigInteger.ZERO) {

      writeHistoryToDb = false

      txCtx
        .delete(ADDRESS_INTERNAL_TRANSACTION_COUNT)
        .where(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      txCtx.delete(ADDRESS_CONTRACTS_CREATED_COUNT)
        .where(ADDRESS_CONTRACTS_CREATED_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      val txCountCursor = txCtx
        .selectFrom(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA)
        .where(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .orderBy(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.desc())
        .fetchSize(1000)
        .fetchLazy()

      while (txCountCursor.hasNext()) {

        val delta = txCountCursor.fetchNext()

        delta.totalDelta = delta.totalOutDelta * -1
        delta.totalInDelta = delta.totalInDelta * -1
        delta.totalOutDelta = delta.totalOutDelta * -1

        incrementInternalTxCounts(delta)
      }

      txCountCursor.close()

      val contractsCountCursor = txCtx
        .selectFrom(ADDRESS_CONTRACTS_CREATED_COUNT_DELTA)
        .where(ADDRESS_CONTRACTS_CREATED_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .orderBy(ADDRESS_CONTRACTS_CREATED_COUNT_DELTA.BLOCK_NUMBER.desc())
        .fetchSize(1000)
        .fetchLazy()

      while (contractsCountCursor.hasNext()) {

        // reverse the delta
        val delta = contractsCountCursor.fetchNext()
        delta.delta = delta.delta * -1

        incrementContractsCount(delta)
      }

      contractsCountCursor.close()

      txCtx
        .deleteFrom(ADDRESS_INTERNAL_TRANSACTION_COUNT)
        .where(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      txCtx
        .deleteFrom(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA)
        .where(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      txCtx
        .deleteFrom(ADDRESS_CONTRACTS_CREATED_COUNT)
        .where(ADDRESS_CONTRACTS_CREATED_COUNT.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      txCtx
        .deleteFrom(ADDRESS_CONTRACTS_CREATED_COUNT_DELTA)
        .where(ADDRESS_CONTRACTS_CREATED_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .execute()

      writeHistoryToDb = true
    } else {

      cacheStores.forEach { it.clear() }
    }

    cacheStores.forEach { it.flushToDisk() }

    logger.info { "Rewind complete" }
  }
}
