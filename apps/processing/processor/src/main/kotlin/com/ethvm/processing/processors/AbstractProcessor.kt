package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.common.config.NetConfig
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.SYNC_STATUS
import com.ethvm.db.Tables.SYNC_STATUS_HISTORY
import com.ethvm.processing.cache.BlockHashCache
import mu.KLogger
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.joda.time.DateTime
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.koin.core.KoinComponent
import org.koin.core.inject
import org.koin.core.qualifier.named
import org.mapdb.DB
import org.mapdb.DBMaker
import java.math.BigInteger
import java.sql.Timestamp
import java.time.Duration
import java.util.*
import java.util.concurrent.CountDownLatch
import java.util.concurrent.ScheduledExecutorService

interface Processor : Runnable {

  fun initialise()

  fun rewindUntil(blockNumber: BigInteger)

  fun reset()

  fun stop()
}

enum class BlockType {
  NEW, DUPLICATE, FORK
}

abstract class AbstractProcessor<V> : KoinComponent, Processor {

  protected abstract val logger: KLogger

  protected abstract val processorId: String

  protected abstract val topics: List<String>

  protected open val kafkaProps: Properties = Properties()

  protected val pollTimeout = Duration.ofSeconds(10)

  protected val netConfig: NetConfig by inject()

  private val dbContext: DSLContext by inject()

  private val baseKafkaProps: Properties by inject(named("baseKafkaProps"))

  private val storageDir: String by inject(named("storageDir"))

  protected val scheduledExecutor: ScheduledExecutorService by inject()

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

  private val stopLatch = CountDownLatch(1)

  protected open val maxTransactionTime: Duration = Duration.ofMillis(100)

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
      logger.info { "Rewinding until and including block = $rewindBlockNumber" }
      rewindUntil(txCtx, rewindBlockNumber)

      // clear out hash cache
      hashCache.removeKeysFrom(rewindBlockNumber)
      hashCache.writeToDb(txCtx)

      logger.info { "initialised" }
    }
  }

  protected abstract fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?)

  protected abstract fun reset(txCtx: DSLContext)

  protected abstract fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger)

  /**
   * @return Int an estimate of the number of db operations performed
   */
  protected abstract fun process(txCtx: DSLContext, records: ConsumerRecord<CanonicalKeyRecord, V>)

  protected abstract fun blockHashFor(value: V): String

  override fun reset() {

    dbContext.transaction { txConfig ->

      val txCtx = DSL.using(txConfig)

      hashCache.reset(txCtx)

      reset(txCtx)

      txCtx
        .deleteFrom(SYNC_STATUS_HISTORY)
        .where(SYNC_STATUS_HISTORY.COMPONENT.eq(processorId))
        .execute()
    }
  }

  override fun rewindUntil(blockNumber: BigInteger) {

    dbContext.transaction { txConfig ->

      val txCtx = DSL.using(txConfig)

      rewindUntil(txCtx, blockNumber)

      hashCache.removeKeysFrom(blockNumber)
      hashCache.writeToDb(txCtx)

      txCtx
        .deleteFrom(SYNC_STATUS_HISTORY)
        .where(
          SYNC_STATUS_HISTORY.COMPONENT.eq(processorId)
            .and(SYNC_STATUS_HISTORY.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
        )
        .execute()

      diskDb.commit()
    }
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
        .forEach { (topicPartition, offsetAndTimestamp) ->
          consumer.seek(topicPartition, offsetAndTimestamp?.offset() ?: 0L)
        }

      // main processing loop
      while (!stop) {

        val records = consumer.poll(pollTimeout)
        if (records.isEmpty) continue

        val classifiedRecords =
          records
            .map { record ->

              val blockNumber = record.key().number.bigInteger()
              val blockHash = blockHashFor(record.value())

              // lookup to see if we have encountered this block before

              when (hashCache[blockNumber]) {

                null -> Pair(BlockType.NEW, record)

                blockHash -> {
                  logger.warn { "Ignoring duplicate block. Number = ${record.key().number.bigInteger()}, hash = $blockHash" }
                  Pair(BlockType.DUPLICATE, record)
                }

                else -> Pair(BlockType.FORK, record)
              }

            }

        val recordIterator = classifiedRecords
          .filterNot { it.first == BlockType.DUPLICATE }
          .iterator()

        while (recordIterator.hasNext()) {

          var recordCount = 0
          var lastRecord: ConsumerRecord<CanonicalKeyRecord, V>? = null

          val maxTxTimeMs = maxTransactionTime.toMillis()
          val txStartTimeMs = System.currentTimeMillis()
          var txElapsedTimeMs = 0L

          dbContext
            .transaction { txConfig ->

              val txCtx = DSL.using(txConfig)

              while (txElapsedTimeMs < maxTxTimeMs && recordIterator.hasNext()) {

                val (blockType, record) = recordIterator.next()

                lastRecord = record

                val blockNumber = record.key().number.bigInteger()

                when (blockType) {

                  BlockType.NEW -> {

                    process(txCtx, record)

                    // update hash entry
                    hashCache[blockNumber] = blockHashFor(record.value())
                    hashCache.writeToDb(txCtx)

                  }

                  BlockType.FORK -> {

                    val forkBlockNumber = record.key().number.bigInteger()
                    rewindUntil(forkBlockNumber)

                    // clear out hash cache and update latest block hash
                    hashCache.removeKeysFrom(forkBlockNumber)
                    hashCache[forkBlockNumber] = blockHashFor(record.value())
                    hashCache.writeToDb(txCtx)
                  }

                  else -> {}  // do nothing
                }

                recordCount += 1

                txElapsedTimeMs = System.currentTimeMillis() - txStartTimeMs
              }


              // update latest block number
              val lastBlockNumber = lastRecord!!.key().number.bigInteger()
              setLatestSyncBlock(txCtx, lastBlockNumber, lastRecord!!.timestamp())

              // flush to disk
              diskDb.commit()

              logger.info { "Tx elapsed time = $txElapsedTimeMs ms. Record count = $recordCount. Latest block number = $lastBlockNumber, block time = ${lastRecord!!.timestamp()}" }
            }

        }

        // commit to kafka
        consumer.commitSync()

        val last = records.last()
        logger.info { "Kafka batch complete. Count = ${records.count()}, head = ${last.key().number.bigInteger()}, block timestamp = ${last.timestamp()}" }
      }
    } catch (e: Exception) {

      logger.error(e) { "Fatal exception, stopping" }
    } finally {

      close()
      // wake up the caller of the stop method
      stopLatch.countDown()
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

  override fun stop() {

    logger.info { "stop requested" }
    this.stop = true

    stopLatch.await()
  }

  private fun close() {

    diskDb.close()
    memoryDb.close()

    consumer.close(Duration.ofSeconds(30))
    logger.info { "clean up complete" }
  }
}
