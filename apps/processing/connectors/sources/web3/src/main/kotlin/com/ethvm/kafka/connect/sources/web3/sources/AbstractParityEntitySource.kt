package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.tracker.CanonicalChainTracker
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext

abstract class AbstractParityEntitySource(
  private val sourceContext: SourceTaskContext,
  protected val parity: JsonRpc2_0ParityExtended
) {

  abstract val partitionKey: Map<String, Any>

  protected open val batchSize = 128

  private val chainTracker by lazy {

    val sourcePartition = sourceContext
      .offsetStorageReader()
      .offset(partitionKey) ?: emptyMap()

    var startBlockNumber = sourcePartition.getOrDefault("blockNumber", 0L) as Long - SAFE_REORG_LENGTH
    if (startBlockNumber < 0) startBlockNumber = 0L

    CanonicalChainTracker(parity, startBlockNumber)
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

    // Returns tomstones + range
    return range.fold({ emptyList() }, { fetchRange(it) })
  }

  abstract fun fetchRange(range: LongRange): List<SourceRecord>

  abstract fun tombstonesForRange(range: LongRange): List<SourceRecord>

  companion object {
    const val SAFE_REORG_LENGTH = 200L
  }
}
