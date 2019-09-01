package com.ethvm.processing.processors

import com.ethvm.avro.capture.BlockRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.BLOCK_METRICS_HEADER
import com.ethvm.processing.cache.BlockTimestampCache
import com.ethvm.processing.extensions.toMetricRecord
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import org.koin.core.inject
import org.koin.core.qualifier.named
import java.math.BigInteger
import java.util.Properties

class BlockMetricsHeaderProcessor : AbstractProcessor<BlockRecord>() {

  override val logger = KotlinLogging.logger {}

  override val processorId = "block-metrics-header-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 256)
    }

  private val topicBlocks: String by inject(named("topicBlocks"))

  override val topics = listOf(topicBlocks)

  private lateinit var blockTimestampCache: BlockTimestampCache

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {

    blockTimestampCache = BlockTimestampCache(memoryDb, scheduledExecutor, processorId)
      .apply { initialise(txCtx, latestSyncBlock ?: BigInteger.ZERO) }
  }

  override fun blockHashFor(value: BlockRecord): String = value.header.hash

  override fun reset(txCtx: DSLContext) {
    txCtx
      .truncate(BLOCK_METRICS_HEADER)
      .execute()
  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    val blockNumberDecimal = blockNumber.toBigDecimal()

    txCtx
      .deleteFrom(BLOCK_METRICS_HEADER)
      .where(BLOCK_METRICS_HEADER.NUMBER.ge(blockNumberDecimal))
      .execute()
  }

  override fun process(txCtx: DSLContext, records: List<ConsumerRecord<CanonicalKeyRecord, BlockRecord>>) {

    val dbRecords = records
      .map { record ->
        val block = record.value()

        val blockNumber = block.header.number.bigInteger()
        val prevBlockNumber = blockNumber.minus(BigInteger.ONE)

        blockTimestampCache[blockNumber] = block.header.timestamp
        val prevBlockTimestamp = blockTimestampCache[prevBlockNumber]

        val blockTime =
          if (blockNumber <= BigInteger.ONE) 0 else (block.header.timestamp - (prevBlockTimestamp ?: 0)) / 1000

        block.toMetricRecord(blockTime.toInt())
      }

    txCtx
      .batchInsert(dbRecords)
      .execute()
  }
}
