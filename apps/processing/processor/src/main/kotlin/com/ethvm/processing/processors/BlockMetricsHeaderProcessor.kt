package com.ethvm.processing.processors

import com.ethvm.avro.capture.BlockHeaderRecord
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

class BlockMetricsHeaderProcessor : AbstractProcessor<BlockRecord>("block-metrics-header-processor") {

  override val logger = KotlinLogging.logger {}

  override val kafkaProps: Properties = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 16)
    }

  private val topicBlocks: String by inject(named("topicBlocks"))

  override val topics = listOf(topicBlocks)

  private val blockTimestampCache = BlockTimestampCache(memoryDb, scheduledExecutor, processorId)

  override fun initialise(txCtx: DSLContext, latestBlockNumber: BigInteger) {
    blockTimestampCache.initialise(txCtx)
  }

  override fun setLastChangeBlockNumberFromDb(txCtx: DSLContext) {
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

  override fun process(txCtx: DSLContext, record: ConsumerRecord<CanonicalKeyRecord, BlockRecord>) {

    var block = record.value()

    val blockNumber = block.header.number.bigInteger()
    val prevBlockNumber = blockNumber.minus(BigInteger.ONE)

    if (blockNumber == BigInteger.ZERO) {

      // override the timestamp of the genesis block

      val genesisBlock = netConfig.genesis

      var timestampMs = genesisBlock.timestamp
      if (timestampMs == 0L) {
        timestampMs = System.currentTimeMillis()
      }

      block = BlockRecord.newBuilder(block)
        .setHeader(
          BlockHeaderRecord.newBuilder(block.header)
            .setTimestamp(timestampMs)
            .build()
        )
        .build()
    }

    blockTimestampCache[blockNumber] = block.header.timestamp
    val prevBlockTimestamp = blockTimestampCache[prevBlockNumber]

    val blockTime =
      if (blockNumber == BigInteger.ZERO) 0
      else (block.header.timestamp - (prevBlockTimestamp ?: 0)) / 1000

    val dbRecord = block.toMetricRecord(blockTime.toInt())

    txCtx
      .insertInto(BLOCK_METRICS_HEADER)
      .set(dbRecord)
      .execute()
  }
}
