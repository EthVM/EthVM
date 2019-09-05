package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.BLOCK_METRICS_TRACE
import com.ethvm.processing.extensions.toMetricsRecord
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import org.koin.core.inject
import org.koin.core.qualifier.named
import java.math.BigInteger
import java.sql.Timestamp
import java.util.Properties

class BlockMetricsTraceProcessor : AbstractProcessor<TraceListRecord>("block-metrics-trace-processor") {

  override val logger = KotlinLogging.logger {}

  override val kafkaProps: Properties = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 16)
    }

  private val topicTraces: String by inject(named("topicTraces"))

  override val topics = listOf(topicTraces)

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {}

  override fun blockHashFor(value: TraceListRecord): String = value.blockHash

  override fun reset(txCtx: DSLContext) {
    txCtx
      .truncate(BLOCK_METRICS_TRACE)
      .execute()
  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    val blockNumberDecimal = blockNumber.toBigDecimal()

    txCtx
      .deleteFrom(BLOCK_METRICS_TRACE)
      .where(BLOCK_METRICS_TRACE.NUMBER.ge(blockNumberDecimal))
      .execute()
  }

  override fun process(txCtx: DSLContext, record: ConsumerRecord<CanonicalKeyRecord, TraceListRecord>) {

    val dbRecord = record.value().toMetricsRecord()

    if(record.key().number.bigInteger() == BigInteger.ZERO) {

      // override the timestamp of the genesis block

      val genesisBlock = netConfig.genesis

      var timestampMs = genesisBlock.timestamp
      if (timestampMs == 0L) {
        timestampMs = System.currentTimeMillis()
      }

      dbRecord.timestamp = Timestamp(timestampMs)
    }

    txCtx
      .insertInto(BLOCK_METRICS_TRACE)
      .set(dbRecord)
      .execute()
  }
}
