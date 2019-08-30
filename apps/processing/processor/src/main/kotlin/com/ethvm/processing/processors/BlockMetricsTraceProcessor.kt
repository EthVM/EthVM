package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.common.config.NetConfig
import com.ethvm.db.Tables.BLOCK_METRICS_TRACE
import com.ethvm.processing.extensions.toMetricsRecord
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import java.math.BigInteger
import java.util.Properties
import java.util.concurrent.ScheduledExecutorService

class BlockMetricsTraceProcessor(netConfig: NetConfig,
                                 baseKafkaProps: Properties,
                                 dbContext: DSLContext,
                                 storageDir: String,
                                 scheduledExecutor: ScheduledExecutorService,
                                 topicTraces: String) : AbstractProcessor<TraceListRecord>(netConfig, baseKafkaProps, dbContext, storageDir, scheduledExecutor) {

  override val logger  = KotlinLogging.logger {}

  override val processorId = "block-metrics-trace-processor"

  override val kafkaProps = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 4)
    }

  override val topics = listOf(topicTraces)

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {}

  override fun blockHashFor(value: TraceListRecord): String = value.blockHash

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    val blockNumberDecimal = blockNumber.toBigDecimal()

    txCtx
      .deleteFrom(BLOCK_METRICS_TRACE)
      .where(BLOCK_METRICS_TRACE.NUMBER.ge(blockNumberDecimal))
      .execute()

  }

  override fun process(txCtx: DSLContext, records: List<ConsumerRecord<CanonicalKeyRecord, TraceListRecord>>) {

    txCtx
      .batchInsert(
        records
          .map { it.value().toMetricsRecord() }
      ).execute()

  }

}
