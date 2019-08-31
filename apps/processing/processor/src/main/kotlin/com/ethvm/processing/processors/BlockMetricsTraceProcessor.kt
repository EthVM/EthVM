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
import org.koin.core.inject
import org.koin.core.qualifier.named
import java.math.BigInteger
import java.util.*
import java.util.concurrent.ScheduledExecutorService

class BlockMetricsTraceProcessor : AbstractProcessor<TraceListRecord>() {

  override val logger = KotlinLogging.logger {}

  override val processorId = "block-metrics-trace-processor"

  private val topicTraces: String by inject(named("topicTraces"))

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

  override fun process(txCtx: DSLContext, record: ConsumerRecord<CanonicalKeyRecord, TraceListRecord>) {

    txCtx
      .insertInto(BLOCK_METRICS_TRACE)
      .set(record.value().toMetricsRecord())
      .execute()

  }

}
