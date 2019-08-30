package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.common.config.NetConfig
import com.ethvm.processing.cache.BlockHashCache
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.SYNC_STATUS
import com.ethvm.db.Tables.SYNC_STATUS_HISTORY
import mu.KLogger
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.joda.time.DateTime
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.mapdb.DB
import org.mapdb.DBMaker
import java.math.BigInteger
import java.sql.Timestamp
import java.time.Duration
import java.util.Properties
import java.util.concurrent.ScheduledExecutorService

interface Processor : Runnable {

  fun initialise()

  fun stop()

}

enum class BlockType {
  NEW, DUPLICATE, FORK
}

abstract class AbstractProcessor<V>(
  protected val netConfig: NetConfig,
  private val baseKafkaProps: Properties,
  private val dbContext: DSLContext,
  private val storageDir: String,
  protected val scheduledExecutor: ScheduledExecutorService
) : Processor {

  protected abstract val logger: KLogger

  protected abstract val processorId: String

  protected abstract val topics: List<String>

  open protected val kafkaProps: Properties = Properties()

  protected val pollTimeout = Duration.ofSeconds(10)

  private val mergedKafkaProps by lazy {
    val merged = Properties()

    // base settings
    merged.putAll(baseKafkaProps)

    // convenience setting of group id
    merged.put(ConsumerConfig.GROUP_ID_CONFIG, "${netConfig.chainId.name.toLowerCase()}-$processorId")

    // some common processor related settings
    merged.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false)

    // processor specific settings and overrides
    merged.putAll(kafkaProps)

    merged
  }

  protected lateinit var diskDb: DB

  protected lateinit var memoryDb: DB

  private lateinit var consumer: KafkaConsumer<CanonicalKeyRecord, V>

  private lateinit var hashCache: BlockHashCache

  private lateinit var latestSyncBlock: BigInteger
  private var latestSyncTimeMs: Long = 0

  @Volatile
  private var stop = false

  override fun stop() {
    logger.info { "stop requested" }
    this.stop = true
  }

  private fun close() {

    diskDb.close()
    memoryDb.close()

    consumer.close(Duration.ofSeconds(30))
    logger.info { "clean up complete" }
  }

  override fun initialise() {

    // initialise local storage db

    diskDb = DBMaker
      .fileDB("$storageDir/${this.processorId}")
      .fileMmapEnable()
      .fileMmapEnableIfSupported()
      .fileMmapPreclearDisable()
      .cleanerHackEnable()
      .transactionEnable()
      .make()

    memoryDb = DBMaker
      .memoryDirectDB()
      .make()

    latestSyncBlock = getLastSyncBlock(dbContext) ?: BigInteger.ONE.negate()
    latestSyncTimeMs = getLastBlockTimestampMs(dbContext) ?: 0L

    hashCache = BlockHashCache(memoryDb, scheduledExecutor, processorId)
    hashCache.initialise(dbContext)

    //

    logger.info { "latest synced block from db: $latestSyncBlock" }

    //
    dbContext.transaction { txConfig ->

      val txCtx = DSL.using(txConfig)

      logger.info { "Initialising..." }

      // initialise kafka consumer

      initialise(txCtx, latestSyncBlock)

      // we add one as the block number parameter is inclusive

      val rewindBlockNumber = latestSyncBlock.plus(BigInteger.ONE)
      logger.info { "Rewinding to block = $rewindBlockNumber"}
      rewindUntil(txCtx, rewindBlockNumber)

      logger.info { "initialised" }

    }

  }

  protected abstract fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?)

  protected abstract fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger)

  protected fun beforeFork(txCtx: DSLContext, value: V) {}

  protected abstract fun process(txCtx: DSLContext, records: List<ConsumerRecord<CanonicalKeyRecord, V>>)

  protected abstract fun blockHashFor(value: V): String


  private fun processBatch(txCtx: DSLContext, records: List<ConsumerRecord<CanonicalKeyRecord, V>>) {

    val tail = records.first().key().number.bigInteger()
    val head = records.last().key().number.bigInteger()

    logger.info { "Processing batch. Tail = $tail, head = $head" }

    process(txCtx, records)

    // update latest block number
    val last = records.last()
    val lastBlockNumber = last.key().number.bigInteger()
    setLatestSyncBlock(txCtx, lastBlockNumber, last.timestamp())

    // flush hash cache
    hashCache.writeToDb(txCtx)
  }

  override fun run() {

    try {

      var restartTimeMs = latestSyncTimeMs - Duration.ofHours(3).toMillis()
      if (restartTimeMs < 0) restartTimeMs = 0

      latestSyncBlock = getLastSyncBlock(dbContext) ?: BigInteger.ONE.negate()
      latestSyncTimeMs = getLastBlockTimestampMs(dbContext) ?: 0L

      consumer = KafkaConsumer(mergedKafkaProps)
      consumer.subscribe(this.topics)

      logger.info { "Last sync time = ${DateTime(latestSyncTimeMs)}. Re-setting consumer to time = ${DateTime(restartTimeMs)}" }

      // we poll so we are assigned topics then we will re-seek before consuming again
      consumer.poll(pollTimeout)

      val offsetsQuery = consumer
        .assignment()
        .map { it to restartTimeMs }
        .toMap()

      consumer
        .offsetsForTimes(offsetsQuery)
        .forEach { (topicPartition, offsetAndTimestamp) -> consumer.seek(topicPartition, offsetAndTimestamp.offset()) }

      // main processing loop
      while (!stop) {

        val records = consumer.poll(pollTimeout)
        val recordCount = records.count()

        if (records.isEmpty) continue

        logger.debug { "$recordCount records received" }

        // look for duplicates and forks

        val classifiedRecords = records
          .map { record ->

            val blockNumber = record.key().number.bigInteger()
            val blockHash = blockHashFor(record.value())

            // lookup to see if we have encountered this block before

            val blockType = when (hashCache[blockNumber]) {

              null -> {
                hashCache[blockNumber] = blockHash
                BlockType.NEW
              }

              blockHash -> {
                logger.warn { "Ignoring duplicate block. Number = ${record.key().number.bigInteger()}, hash = $blockHash" }
                BlockType.DUPLICATE
              }

              else -> {
                hashCache[blockNumber] = blockHash
                BlockType.FORK
              }

            }

            Pair(record, blockType)
          }

        val iterator = classifiedRecords.iterator()

        // TODO guarantee ordering and no skips in the sequence

        var recordBatch = emptyList<ConsumerRecord<CanonicalKeyRecord, V>>()

        while (iterator.hasNext()) {

          val (record, type) = iterator.next()

          when (type) {
            BlockType.DUPLICATE -> {
            } // ignore
            BlockType.NEW -> recordBatch = recordBatch + record
            BlockType.FORK -> {

              dbContext.transaction { txConfig ->

                val txCtx = DSL.using(txConfig)

                // process current batch
                processBatch(txCtx, recordBatch)
                recordBatch = emptyList()

                // rewind

                val blockNumber = record.key().number.bigInteger()

                rewindUntil(txCtx, blockNumber)
                hashCache.removeKeysFrom(blockNumber)

                // process the fork block
                processBatch(txCtx, listOf(record))

                // commit local storage
                diskDb.commit()

              }

            }
          }

        }

        // process any remaining

        if (recordBatch.isNotEmpty()) {

          dbContext.transaction { txConfig ->

            val txCtx = DSL.using(txConfig)
            processBatch(txCtx, recordBatch)
            recordBatch = emptyList()

            // commit local storage
            diskDb.commit()
          }

        }

        // commit to kafka
        consumer.commitSync()

        logger.info { "$recordCount records processed. Block time = ${DateTime(records.last().timestamp())}" }

      }

    } catch (e: Exception) {

      logger.error(e) { "Fatal exception, stopping" }
      close()

    } finally {

      close()

    }

  }

  protected fun getLastSyncBlock(txCtx: DSLContext): BigInteger? {

    val record = txCtx
      .select(SYNC_STATUS.BLOCK_NUMBER)
      .from(SYNC_STATUS)
      .where(SYNC_STATUS.COMPONENT.eq(processorId))
      .fetchOne()

    return record?.value1()?.toBigInteger()
  }

  protected fun getLastBlockTimestampMs(txCtx: DSLContext): Long? {

    val record = txCtx
      .select(SYNC_STATUS.BLOCK_TIMESTAMP)
      .from(SYNC_STATUS)
      .where(SYNC_STATUS.COMPONENT.eq(processorId))
      .fetchOne()

    return record?.value1()?.time
  }

  protected fun setLatestSyncBlock(txCtx: DSLContext, blockNumber: BigInteger, blockTimestamp: Long) {

    val blockNumberDecimal = blockNumber.toBigDecimal()
    val timestampNowMs = Timestamp(System.currentTimeMillis())
    val blockTimestampMs = Timestamp(blockTimestamp)

    // latest

    txCtx
      .insertInto(
        SYNC_STATUS,
        SYNC_STATUS.COMPONENT,
        SYNC_STATUS.BLOCK_NUMBER,
        SYNC_STATUS.TIMESTAMP,
        SYNC_STATUS.BLOCK_TIMESTAMP
      )
      .values(processorId, blockNumberDecimal, timestampNowMs, blockTimestampMs)
      .onDuplicateKeyUpdate()
      .set(SYNC_STATUS.BLOCK_NUMBER, blockNumberDecimal)
      .set(SYNC_STATUS.TIMESTAMP, timestampNowMs)
      .set(SYNC_STATUS.BLOCK_TIMESTAMP, blockTimestampMs)
      .execute()

    // history

    txCtx
      .insertInto(
        SYNC_STATUS_HISTORY,
        SYNC_STATUS_HISTORY.COMPONENT,
        SYNC_STATUS_HISTORY.BLOCK_NUMBER,
        SYNC_STATUS_HISTORY.TIMESTAMP,
        SYNC_STATUS_HISTORY.BLOCK_TIMESTAMP
      )
      .values(processorId, blockNumberDecimal, timestampNowMs, blockTimestampMs)
      .execute()

  }


}
