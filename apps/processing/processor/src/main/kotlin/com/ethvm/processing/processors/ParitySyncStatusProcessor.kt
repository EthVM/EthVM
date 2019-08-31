package com.ethvm.processing.processors

import com.ethvm.avro.capture.ParitySyncStateKeyRecord
import com.ethvm.avro.capture.ParitySyncStateRecord
import com.ethvm.common.config.NetConfig
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables
import com.ethvm.db.tables.records.SyncStatusHistoryRecord
import com.ethvm.db.tables.records.SyncStatusRecord
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.koin.core.KoinComponent
import org.koin.core.inject
import org.koin.core.qualifier.named
import java.math.BigInteger
import java.sql.Timestamp
import java.time.Duration
import java.util.*
import java.util.concurrent.CountDownLatch

class ParitySyncStatusProcessor : KoinComponent, Processor {

  val logger = KotlinLogging.logger {}

  private val netConfig: NetConfig by inject()

  private val dbContext: DSLContext by inject()

  private val baseKafkaProps: Properties by inject(named("baseKafkaProps"))

  private val topicParitySyncState: String by inject(named("topicParitySyncState"))

  private val processorId = "parity"

  private val kafkaProps = Properties().apply {

    putAll(baseKafkaProps)

    put(ConsumerConfig.GROUP_ID_CONFIG, "${netConfig.chainId.name.toLowerCase()}-parity-sync-state-processor")
    put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true)
    put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest")
  }

  private val pollTimeout = Duration.ofSeconds(10)

  private val consumer = KafkaConsumer<ParitySyncStateKeyRecord, ParitySyncStateRecord>(kafkaProps)
    .apply {
      subscribe(listOf(topicParitySyncState))
    }

  @Volatile
  private var stop = false

  private val stopLatch = CountDownLatch(1)

  override fun initialise() {
  }

  override fun rewindUntil(blockNumber: BigInteger) {
  }

  override fun reset() {

    dbContext
      .deleteFrom(Tables.SYNC_STATUS_HISTORY)
      .where(Tables.SYNC_STATUS_HISTORY.COMPONENT.eq(processorId))
      .execute()

  }

  override fun stop() {
    stop = true
    stopLatch.await()
  }

  override fun run() {
    try {

      while (!stop) {

        val lastRecord = consumer.poll(pollTimeout)
          .lastOrNull() ?: continue

        val record = lastRecord.value()

        val historyRecord = SyncStatusHistoryRecord()
          .apply {
            this.component = processorId
            this.blockNumber = record.number.bigInteger().toBigDecimal()
            this.timestamp = Timestamp(record.timestamp)
            this.blockTimestamp = Timestamp(record.timestamp)
          }


        dbContext
          .insertInto(Tables.SYNC_STATUS_HISTORY)
          .set(historyRecord)
          .execute()


      }

    } catch (e: Exception) {
      logger.error(e) { "Fatal exception" }
    } finally {
      consumer.close()
      stopLatch.countDown()
    }
  }
}
