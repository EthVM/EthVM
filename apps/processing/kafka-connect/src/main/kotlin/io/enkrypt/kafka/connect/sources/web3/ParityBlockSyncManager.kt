package io.enkrypt.kafka.connect.sources.web3

import arrow.core.Tuple3
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.hexUBigInteger
import io.reactivex.Observable
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import mu.KotlinLogging
import org.web3j.protocol.core.DefaultBlockParameter
import java.math.BigInteger
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.TimeUnit

class ParityBlockSyncManager(
  private val parity: JsonRpc2_0ParityExtended,
  blockNumberOffset: BigInteger?
) {

  private val logger = KotlinLogging.logger {}
  private val rangeQueue = ArrayBlockingQueue<ClosedRange<BigInteger>>(20)

  private val subscription: Disposable

  @Volatile
  private var error: Throwable? = null

  init {

    logger.info { "Syncing - block number offset: $blockNumberOffset" }

    val historicBlockStart = blockNumberOffset ?: BigInteger.ZERO

    subscription = Observable.merge(
      Observable.fromArray(listOf(Pair(BigInteger.ONE.negate(), ""))),
      parity.newHeadsNotifications()
        .map { it.params.result }
        .map { it.number.hexUBigInteger()!! to it.hash }
        .buffer(1000, TimeUnit.MILLISECONDS, 128)
        .onBackpressureBuffer()
        .toObservable()
    ).observeOn(Schedulers.single())
      .subscribe(
        { heads ->

          if (heads.isNotEmpty()) {

            // possible during a fork where older block numbers are re-published so we find the max and min within the batch

            var start = heads.minBy { it.first }!!.first
            val end = heads.maxBy { it.first }!!.first

            if (start == BigInteger.ONE.negate()) {

              val latestBlockNumber = parity.ethBlockNumber().send().blockNumber

              logger.info { "loading historic blocks. Start = $historicBlockStart, end = $latestBlockNumber" }

              // first we do a historic load

              rangesFor(historicBlockStart, latestBlockNumber)
                .forEach { range -> rangeQueue.put(range) }

              start += BigInteger.ONE
            }

            rangeQueue.put(start.rangeTo(end))
          }
        },
        { throwable -> error = throwable }
      )
  }

  fun stop() {
    subscription.dispose()
  }

  fun poll(): List<BlockRecord> {

    // re-throw error if one has occurred

    val error = this.error
    if (error != null) {
      throw error
    }

    // drain the fetch ranges and retrieve blocks

    val ranges = mutableListOf<ClosedRange<BigInteger>>()
    rangeQueue.drainTo(ranges)

    return ranges
      .map { range -> fetchRange(range) }
      .flatten()
      .map { it.toBlockRecord().build() }
  }

  private fun fetchRange(range: ClosedRange<BigInteger>): List<BlockData> {

    logger.info { "Fetching blocks. Start = ${range.start}, end = ${range.endInclusive}" }

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

    logger.info { "Finished fetching blocks . Start = ${range.start}, end = ${range.endInclusive}" }

    return result
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
}
