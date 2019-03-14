package io.enkrypt.kafka.connect.sources.web3.sources

import io.enkrypt.kafka.connect.sources.web3.CanonicalChainTracker
import io.enkrypt.kafka.connect.sources.web3.JsonRpc2_0ParityExtended
import mu.KotlinLogging
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext

abstract class ParityEntitySource (
  protected val sourceContext: SourceTaskContext,
  protected val parity: JsonRpc2_0ParityExtended
) {

  private val logger = KotlinLogging.logger {}

  abstract val partitionKey: Map<String, Any>

  private val chainTracker by lazy {

    val sourcePartition = sourceContext
      .offsetStorageReader()
      .offset(partitionKey) ?: emptyMap()

    var startBlockNumber = sourcePartition.getOrDefault("blockNumber", 0L) as Long - 200L
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

    val range = chainTracker.nextRange(128)

    return when(range) {
      null -> emptyList()
      else -> fetchRange(range)
    }

  }

  abstract fun fetchRange(range: ClosedRange<Long>): List<SourceRecord>

}
