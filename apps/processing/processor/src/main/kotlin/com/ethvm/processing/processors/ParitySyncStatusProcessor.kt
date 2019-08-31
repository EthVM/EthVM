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
import java.sql.Timestamp
import java.time.Duration
import java.util.*

class ParitySyncStatusProcessor(
  netConfig: NetConfig,
  private val baseKafkaProps: Properties,
  private val dbContext: DSLContext,
  private val topicParitySyncState: String
) : Processor {

  val logger = KotlinLogging.logger {}

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

  override fun initialise() {
  }

  override fun stop() {
    stop = true
  }

  override fun run() {
    try {

      while (!stop) {

        val lastRecord = consumer.poll(pollTimeout)
          .lastOrNull() ?: continue

        val record = lastRecord.value()

        val historyRecord = SyncStatusHistoryRecord()
          .apply {
            this.component = "parity"
            this.blockNumber = record.number.bigInteger().toBigDecimal()
            this.timestamp = Timestamp(record.timestamp)
            this.blockTimestamp = Timestamp(record.timestamp)
          }

        val latestRecord = SyncStatusRecord()
          .apply {
            this.component = historyRecord.component
            this.blockNumber = historyRecord.blockNumber
            this.timestamp = historyRecord.timestamp
            this.blockTimestamp = Timestamp(record.timestamp)
          }

        dbContext
          .transaction { txConfig ->

            val txCtx = DSL.using(txConfig)

            txCtx
              .insertInto(Tables.SYNC_STATUS_HISTORY)
              .set(historyRecord)
              .execute()

            txCtx
              .insertInto(Tables.SYNC_STATUS)
              .set(latestRecord)
              .onDuplicateKeyUpdate()
              .set(Tables.SYNC_STATUS.BLOCK_NUMBER, latestRecord.blockNumber)
              .set(Tables.SYNC_STATUS.TIMESTAMP, latestRecord.timestamp)
              .set(Tables.SYNC_STATUS.BLOCK_TIMESTAMP, latestRecord.blockTimestamp)
              .execute()

          }

        dbContext
          .insertInto(Tables.SYNC_STATUS_HISTORY)

      }

    } catch (e: Exception) {
      logger.error(e) { "Fatal exception" }
    } finally {
      consumer.close()
    }
  }
}
