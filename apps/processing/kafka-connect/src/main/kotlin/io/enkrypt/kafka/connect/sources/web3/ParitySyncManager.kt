package io.enkrypt.kafka.connect.sources.web3

import arrow.core.Tuple3
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.hexUBigInteger
import io.enkrypt.kafka.connect.extensions.JsonRpc2_0ParityExtended
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import mu.KotlinLogging
import org.web3j.protocol.core.DefaultBlockParameter
import java.math.BigInteger
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class ParitySyncManager(val parity: JsonRpc2_0ParityExtended, synced: BigInteger) {

  private val logger = KotlinLogging.logger {}

  private val executor = Executors.newSingleThreadExecutor()

  private val fetchRanges = ArrayBlockingQueue<ClosedRange<BigInteger>>(20)

  private var historicFetchComplete = false
  private var subscription: Disposable

  // used to identify any gaps when syncing
  private var blockNumber = if (synced == BigInteger.ZERO) BigInteger.ONE.negate() else synced

  init {

    subscription = parity
      .newHeadsNotifications()
      .observeOn(Schedulers.single())
      .map { it.params.result }
      .map { it.number.hexUBigInteger()!! to it.hash }
      .buffer(1000, TimeUnit.MILLISECONDS, 128)
      .onBackpressureBuffer()
      .subscribe { heads ->

        if (heads.isNotEmpty()) {

          // possible during a fork where older block numbers are re-published so we find the max and min within the batch

          var start = heads.minBy { it.first }!!.first
          val end = heads.maxBy { it.first }!!.first

          if (!historicFetchComplete) {

            // if we have yet to do a historic load we do that first
            // Ranges are inclusive so we add one to the start when we are finished

            rangesFor(synced, start)
              .forEach { range -> fetchRanges.put(range) }

            historicFetchComplete = true
            start += BigInteger.ONE

          }

          executor.submit { fetchRanges.put(start.rangeTo(end)) }
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

    val ranges = mutableListOf<ClosedRange<BigInteger>>()

    val timeoutMs = unit.toMillis(timeout)
    val startedMs = System.currentTimeMillis()
    var elapsedMs = 0L

    while (elapsedMs < timeoutMs && fetchRanges.drainTo(ranges) == 0) {
      Thread.sleep(1000)
      elapsedMs = System.currentTimeMillis() - startedMs
    }

    return ranges
      .map{ executor.submit<List<BlockData>> { fetchRange(it) } }
      .map{ it.get(timeout, unit) }
      .map{ blocks ->

        blocks.map { blockData ->

          // we track the sequence of block numbers to identify any gap in retrieval
          val number = blockData.block.number
          val expectedNumber = blockNumber + BigInteger.ONE

          require(number == expectedNumber) { "Sequence gap detected. Expected $expectedNumber, received $number" }

          blockNumber = number

          // convert to block record
          blockData.toBlockRecord()

        }

      }.flatten()

  }

  fun stop(timeout: Long = 60, unit: TimeUnit = TimeUnit.SECONDS) {
    subscription.dispose()
    executor.shutdownNow()
    executor.awaitTermination(timeout, unit)
  }

}


