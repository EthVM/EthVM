package io.enkrypt.kafka.connect.sources.web3

import arrow.core.Tuple3
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.hexUBigInteger
import io.enkrypt.kafka.connect.extensions.JsonRpc2_0ParityExtended
import io.reactivex.disposables.Disposable
import mu.KotlinLogging
import org.web3j.protocol.core.DefaultBlockParameter
import java.math.BigInteger
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class ParitySyncManager(val parity: JsonRpc2_0ParityExtended, synced: BigInteger) {

  private val logger = KotlinLogging.logger {}

  private val executor = Executors.newSingleThreadExecutor()
  private val fetchQueue = ArrayBlockingQueue<List<BlockData>>(30)

  private var historicFetchComplete = false

  private var subscription: Disposable

  init {
    subscription = parity
      .newHeadsNotifications()
      .map { it.params.result }
      .map { it.number.hexUBigInteger()!! to it.hash }
      .buffer(1000, TimeUnit.MILLISECONDS, 128)
      .subscribe { heads ->

        if(heads.isNotEmpty()) {

          if(!historicFetchComplete) {

            rangesFor(synced, heads.first().first)
              .forEach{ range -> executor.submit { fetchQueue.add(fetchRange(range)) } }

            historicFetchComplete = true

          } else {

            val start = heads.first().first
            val end = heads.last().first

            executor.submit{ fetchQueue.add(fetchRange(start.rangeTo(end))) }
          }

        }

      }
  }

  private fun rangesFor(syncedUntil: BigInteger, end: BigInteger, batchSize: Int = 128): List<ClosedRange<BigInteger>> {

    val start =
      if (syncedUntil > BigInteger.ZERO)
        syncedUntil + BigInteger.ONE
      else
        syncedUntil

    var ranges = emptyList<ClosedRange<BigInteger>>()

    val batchSizeBigInt = batchSize.toBigInteger()
    var batchStart = start

    while (batchStart < end) {

      var batchEnd = batchStart + batchSizeBigInt
      if (batchEnd > end) batchEnd = end

      ranges = ranges + batchStart.rangeTo(batchEnd)
      batchStart += (batchSizeBigInt + BigInteger.ONE)
    }

    return ranges
  }

  private fun fetchOlderBlocks(syncedUntil: BigInteger, end: BigInteger, batchSize: Int = 128) {

    val start =
      if (syncedUntil > BigInteger.ZERO)
        syncedUntil + BigInteger.ONE
      else
        syncedUntil

    var ranges = emptyList<ClosedRange<BigInteger>>()

    val batchSizeBigInt = batchSize.toBigInteger()
    var batchStart = start

    while (batchStart < end) {

      var batchEnd = batchStart + batchSizeBigInt
      if (batchEnd > end) batchEnd = end

      ranges = ranges + batchStart.rangeTo(batchEnd)
      batchStart += (batchSizeBigInt + BigInteger.ONE)
    }

    ranges.forEach{ range -> fetchQueue.add(fetchRange(range)) }

  }

  private fun fetchRange(range: ClosedRange<BigInteger>): List<BlockData> {

    logger.info { "Fetching block fixed. Start = ${range.start}, end = ${range.endInclusive}" }

    // force into long for iteration

    val longRange = LongRange(range.start.longValueExact(), range.endInclusive.longValueExact())

    val futures = longRange.map { blockNumber ->

      val blockParam = DefaultBlockParameter.valueOf(blockNumber.toBigInteger())

      val blockFuture = parity.ethGetBlockByNumber(blockParam, true).sendAsync()
      val receiptsFuture = parity.parityGetBlockReceipts(blockParam).sendAsync()
      val tracesFuture = parity.traceBlock(blockParam).sendAsync()

      Tuple3(blockFuture, receiptsFuture, tracesFuture)
    }

    val result = futures.map { (blockFuture, receiptsFuture, tracesFuture) ->

      val block = blockFuture.get().block

      val uncleFutures = block.uncles.mapIndexed { idx, _ ->
        parity.ethGetUncleByBlockHashAndIndex(block.hash, idx.toBigInteger()).sendAsync()
      }

      val receipts = receiptsFuture.get().receipts
      val traces = tracesFuture.get().traces

      val uncles = uncleFutures.map { it.get().block }

      BlockData(block, uncles, receipts, traces)
    }

    logger.info { "Finished syncing block fixed. Start = ${range.start}, end = ${range.endInclusive}" }

    return result

  }

  fun poll(timeout: Long, unit: TimeUnit): List<BlockRecord.Builder> {

    val lists = mutableListOf<List<BlockData>>()

    val timeoutMs = unit.toMillis(timeout)
    val startedMs = System.currentTimeMillis()
    var elapsedMs = 0L

    while (elapsedMs < timeoutMs && fetchQueue.drainTo(lists) == 0) {
      Thread.sleep(1000)
      elapsedMs = System.currentTimeMillis() - startedMs
    }

    return lists.map { list -> list.map { blockData -> blockData.toBlockRecord() } }.flatten()

  }

  fun stop() {
    subscription.dispose()
  }


}


