package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.ParitySyncStateKeyRecord
import com.ethvm.avro.capture.ParitySyncStateRecord
import com.ethvm.common.extensions.setHeadBI
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.tracker.ParityCanonicalChainTracker
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import mu.KotlinLogging
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext

abstract class AbstractParityEntitySource(
  private val sourceContext: SourceTaskContext,
  protected val parity: JsonRpc2_0ParityExtended,
  private val syncStateTopic: String
) {

  abstract val partitionKey: Map<String, Any>

  protected val logger = KotlinLogging.logger {}

  protected open val batchSize = 256

  protected val chainTracker by lazy {

    val sourcePartition = sourceContext
      .offsetStorageReader()
      .offset(partitionKey) ?: emptyMap()

    var startBlockNumber = sourcePartition.getOrDefault("blockNumber", 0L) as Long - SAFE_REORG_LENGTH
    if (startBlockNumber < 0) startBlockNumber = 0L

    ParityCanonicalChainTracker(parity, startBlockNumber)
  }

  @Volatile
  private var error: Throwable? = null

  fun stop() {
    chainTracker.stop()
  }

  fun poll(): List<SourceRecord> {

    // re-throw error if one has occurred

    val error = this.error
    if (error != null) {
      throw error
    }

    val (range, reOrgs) = chainTracker.nextRange(batchSize)

    logger.debug { "Range = $range, reOrgs = $reOrgs" }

    // filter re-orgs to only those keys which affect the keys we will publish

    val keysToPublish = range?.toSet() ?: emptySet()

    val reOrgRecords = reOrgs
      .asSequence()
      .map { it.toList() }
      .flatten()
      .filter { keysToPublish.contains(it) }
      .map { tombstone(it) }
      .flatten()
      .toList()

    //

    val records = when {
      range == null -> emptyList()
      range.isEmpty() -> emptyList()
      else -> fetchRange(range) + syncStateRecord(range)
    }

    logger.debug { "Re-org size = ${reOrgRecords.size}, records size = ${records.size}" }

    return reOrgRecords + records
  }

  private fun syncStateRecord(range: LongRange): SourceRecord {

    val source = partitionKey["model"] as String

    val syncStateKey = ParitySyncStateKeyRecord
      .newBuilder()
      .setSource(source)
      .build()

    val syncState = ParitySyncStateRecord
      .newBuilder()
      .setSource(source)
      .setTimestamp(System.currentTimeMillis())
      .setHeadBI(chainTracker.head.toBigInteger())
      .setNumberBI(range.last.toBigInteger())
      .build()

    val syncStateKeySchemaAndValue = AvroToConnect.toConnectData(syncStateKey)
    val syncStateValueSchemaAndValue = AvroToConnect.toConnectData(syncState)

    return SourceRecord(
      partitionKey,
      mapOf("blockNumber" to range.endInclusive),
      syncStateTopic,
      syncStateKeySchemaAndValue.schema(),
      syncStateKeySchemaAndValue.value(),
      syncStateValueSchemaAndValue.schema(),
      syncStateValueSchemaAndValue.value()
    )
  }

  abstract fun fetchRange(range: LongRange): List<SourceRecord>

  abstract fun tombstone(number: Long): List<SourceRecord>

  companion object {
    const val SAFE_REORG_LENGTH = 200L
  }
}
