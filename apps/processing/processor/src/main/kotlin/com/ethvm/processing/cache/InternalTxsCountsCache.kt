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

class InternalTxsCountsCache(
  memoryDb: DB,
  diskDb: DB,
  scheduledExecutor: ScheduledExecutorService,
  processorId: String
) {

  val logger = KotlinLogging.logger {}

  private val internalTxCountByAddress = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_internal_tx_count_by_address",
    Serializer.STRING,
    MapDbSerializers.forAvro<TransactionCountRecord>(TransactionCountRecord.`SCHEMA$`),
    TransactionCountRecord
      .newBuilder()
      .build()
  )

  private val contractsCreatedByAddress = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_contracts_created_by_address",
    Serializer.STRING,
    Serializer.LONG,
    0L
  )

  private val metadataMap = CacheStore(
    memoryDb,
    diskDb,
    scheduledExecutor,
    "${processorId}_counts_metadata",
    Serializer.STRING,
    Serializer.BIG_INTEGER,
    BigInteger.ZERO
  )

  private val cacheStores = listOf(internalTxCountByAddress, contractsCreatedByAddress, metadataMap)

  private var historyRecords = emptyList<TableRecord<*>>()

  private var writeHistoryToDb = true

  fun initialise(txCtx: DSLContext) {

    logger.info { "Initialising" }

    var lastChangeBlockNumber = metadataMap["lastChangeBlockNumber"] ?: BigInteger.ONE.negate()
    val lastChangeBlockNumberDb = lastChangeBlockNumberDb(txCtx)

    logger.info { "Last change block number (local): $lastChangeBlockNumber, last change block number from db: $lastChangeBlockNumberDb" }

    when {

      lastChangeBlockNumber == lastChangeBlockNumberDb -> {
        logger.info { "Nothing to synchronise. Initialisation complete" }
        return
      }

      lastChangeBlockNumber > lastChangeBlockNumberDb -> {
        logger.info { "Local state is ahead of the database. Resetting all local state." }
        // reset all state from the beginning as the database is behind us
        cacheStores.forEach { it.clear() }
        lastChangeBlockNumber = BigInteger.ONE.negate()
      }

    }

    // replay any missed state
    val addressCountCursor = txCtx
      .selectFrom(ADDRESS_INTERNAL_TRANSACTION_COUNT)
      .where(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER.gt(lastChangeBlockNumber.toBigDecimal()))
      .fetchSize(1000)
      .fetchLazy()

    // disable db record generation
    writeHistoryToDb = false

    var count = 0

    logger.info { "Beginning reload of internal transaction counts" }

    while (addressCountCursor.hasNext()) {
      set(addressCountCursor.fetchNext())
      count += 1
      if (count % 1000 == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "$count entries processed" }
      }
    }

    addressCountCursor.close()

    logger.info { "Internal transaction counts reloaded. $count entries processed" }

    count = 0

    val contractCountCursor = txCtx
      .selectFrom(ADDRESS_CONTRACTS_CREATED_COUNT)
      .where(ADDRESS_CONTRACTS_CREATED_COUNT.BLOCK_NUMBER.gt(lastChangeBlockNumber.toBigDecimal()))
      .fetchSize(1000)
      .fetchLazy()

    logger.info { "Beginning reload of contract counts" }

    while (contractCountCursor.hasNext()) {
      set(contractCountCursor.fetchNext())
      count += 1
      if (count % 1000 == 0) {
        cacheStores.forEach { it.flushToDisk(true) }
        logger.info { "$count entries processed" }
      }
    }

    contractCountCursor.close()

    logger.info { "Contract counts reloaded. $count entries processed" }

    // final flush of any pending writes
    cacheStores.forEach { it.flushToDisk(true) }

    // re-enable db record generation
    writeHistoryToDb = true

    logger.info { "Initialisation complete" }
  }

  fun lastChangeBlockNumberDb(txCtx: DSLContext) =
    txCtx
      .select(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER)
      .from(ADDRESS_INTERNAL_TRANSACTION_COUNT)
      .orderBy(ADDRESS_INTERNAL_TRANSACTION_COUNT.BLOCK_NUMBER.desc())
      .limit(1)
      .fetchOne()
      ?.value1()?.toBigInteger() ?: BigInteger.ONE.negate()

  fun count(balanceDeltas: List<BalanceDeltaRecord>, blockNumber: BigInteger) {
    incrementInternalTxCounts(balanceDeltas, blockNumber)
    incrementContractsCount(balanceDeltas, blockNumber)
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

    // list of delta types which constitute an internal tx
    val internalDeltaTypes =
      setOf(
        BalanceDeltaType.INTERNAL_TX,
        BalanceDeltaType.CONTRACT_CREATION,
        BalanceDeltaType.CONTRACT_DESTRUCTION
      ).map { it.toString() }

    // filter for only internal txs
    val internalTxTraces = balanceDeltas
      .filter { internalDeltaTypes.contains(it.deltaType) }

    // at some point refactor this to work with filtering by isReceiving
    val txOutMap = internalTxTraces
      .filterNot { it.isReceiving }
      // this is the sending account
      .map { it.address to 1 }
      .fold(emptyMap<String, Int>()) { map, next ->

        val fromAddress = next.first
        val delta = next.second

        map + (fromAddress to map.getOrDefault(fromAddress, 0) + delta)
      }

    val txInMap = internalTxTraces
      .filter { it.isReceiving }
      // this is the receiving address
      .map { it.address to 1 }
      .fold(emptyMap<String, Int>()) { map, next ->

        val toAddress = next.first
        val delta = next.second

        map + (toAddress to map.getOrDefault(toAddress, 0) + delta)
      }

    // get the superset of addresses for in and out
    val addresses = txInMap.keys + txOutMap.keys

    // we add up the in and out for each address to get a total tx change
    val txTotalMap = addresses
      .map { address -> Pair(address, txInMap.getOrDefault(address, 0) + txOutMap.getOrDefault(address, 0)) }
      .toMap()

    // for each address we generate a delta record representing the in, out and total tx count change
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

  private fun set(count: AddressInternalTransactionCountRecord) {
    internalTxCountByAddress[count.address] = TransactionCountRecord
      .newBuilder()
      .setTotal(count.total)
      .setTotalIn(count.totalIn)
      .setTotalOut(count.totalOut)
      .build()
  }

  private fun set(count: AddressContractsCreatedCountRecord) {
    contractsCreatedByAddress[count.address] = count.count
  }

  fun writeToDb(txCtx: DSLContext) {

    if (writeHistoryToDb) {

      txCtx
        .batchInsert(historyRecords)
        .execute()

      if(historyRecords.isNotEmpty()) {
        // update latest block number where changes occurred
        metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)
      }

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

      // disable db record generation
      writeHistoryToDb = false

      val txCountCursor = txCtx
        .selectFrom(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA)
        .where(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.ge(blockNumberDecimal))
        .orderBy(ADDRESS_INTERNAL_TRANSACTION_COUNT_DELTA.BLOCK_NUMBER.desc())
        .fetchSize(1000)
        .fetchLazy()

      while (txCountCursor.hasNext()) {

        val delta = txCountCursor.fetchNext()

        // invert the delta amounts
        delta.totalDelta = delta.totalDelta * -1
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

      // update latest block number where changes occurred
      metadataMap["lastChangeBlockNumber"] = lastChangeBlockNumberDb(txCtx)

      // re-enable db record generation
      writeHistoryToDb = true

    } else {

      // just clear everything
      cacheStores.forEach { it.clear() }
    }

    // flush cache store state to disk
    cacheStores.forEach { it.flushToDisk() }

    logger.info { "Rewind complete" }
  }
}
