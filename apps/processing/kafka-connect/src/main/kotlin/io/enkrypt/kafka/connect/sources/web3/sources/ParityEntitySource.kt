package io.enkrypt.kafka.connect.sources.web3.sources

import arrow.core.None
import arrow.core.Option
import io.enkrypt.kafka.connect.sources.web3.CanonicalChainTracker
import io.enkrypt.kafka.connect.sources.web3.JsonRpc2_0ParityExtended
import mu.KotlinLogging
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext

abstract class ParityEntitySource(
  protected val sourceContext: SourceTaskContext,
  protected val parity: JsonRpc2_0ParityExtended
) {

  protected val logger = KotlinLogging.logger {}

  abstract val partitionKey: Map<String, Any>

  protected open val batchSize = 128

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

    val range = chainTracker.nextRange(batchSize).first

    return when (range) {
      is None -> emptyList()
      else -> fetchRange(range.orNull()!!)
    }
  }

  abstract fun fetchRange(range: LongRange): List<SourceRecord>
}
