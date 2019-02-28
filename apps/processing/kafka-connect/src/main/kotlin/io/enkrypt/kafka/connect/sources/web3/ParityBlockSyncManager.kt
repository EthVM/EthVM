package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.hexUBigInteger
import io.reactivex.Observable
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import mu.KotlinLogging
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.methods.response.EthBlock
import java.math.BigInteger
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class ParityBlockSyncManager(
  private val parity: JsonRpc2_0ParityExtended,
  blockNumberOffset: BigInteger?
) {

  private val logger = KotlinLogging.logger {}

  private val rangeQueue = ArrayBlockingQueue<BlockRecord>(1024 * 5)
  private val executor = Executors.newSingleThreadExecutor()

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
                .forEach { range ->
                  executor.submit { fetchRange(range) }
                }

              start += BigInteger.ONE
            }

            executor.submit { fetchRange(start.rangeTo(end)) }
          }
        },
        { throwable -> error = throwable }
      )
  }

  fun stop() {
    subscription.dispose()
    executor.shutdownNow()
  }

  fun poll(timeout: Long, unit: TimeUnit): List<BlockRecord> {

    // re-throw error if one has occurred

    val error = this.error
    if (error != null) {
      throw error
    }

    val batch = mutableListOf<BlockRecord>()

    val startMs = System.currentTimeMillis()
    val timeoutMs = unit.toMillis(timeout)

    while (rangeQueue.drainTo(batch, 32) == 0 && (System.currentTimeMillis() - startMs) < timeoutMs) {
      Thread.sleep(100)
    }

    return batch
  }

  fun messageSize(blocks: List<BlockRecord>) {
    blocks.map { it.getHeader().getSize() }.sum()
  }

  private fun fetchRange(range: ClosedRange<BigInteger>) {

    logger.info { "Fetching blocks. Start = ${range.start}, end = ${range.endInclusive}" }

    // force into long for iteration

    val longRange = LongRange(range.start.longValueExact(), range.endInclusive.longValueExact())

    longRange
      .map { blockNumber ->

        val blockParam = DefaultBlockParameter.valueOf(blockNumber.toBigInteger())

        val blockFuture = parity.ethGetBlockByNumber(blockParam, true).sendAsync()
        val receiptsFuture = parity.parityGetBlockReceipts(blockParam).sendAsync()
        val tracesFuture = parity.traceBlock(blockParam).sendAsync()

        val unclesFuture: CompletableFuture<List<EthBlock.Block>> = parity
          .ethGetUncleCountByBlockNumber(blockParam)
          .sendAsync()
          .thenCompose { resp ->

            val futures = (0 until resp.uncleCount.intValueExact())
              .map { idx ->
                parity.ethGetUncleByBlockNumberAndIndex(blockParam, idx.toBigInteger())
                  .sendAsync()
              }

            CompletableFuture.allOf(*futures.toTypedArray())
              .thenApply { futures.map { it.join().block } }
          }

        CompletableFuture.allOf(blockFuture, receiptsFuture, tracesFuture, unclesFuture)
          .thenApply {

            val block = blockFuture.join().block
            val receipts = receiptsFuture.join().receipts
            val traces = tracesFuture.join().traces

            val uncles = unclesFuture.join()

            BlockData(block, uncles, receipts, traces)
              .toBlockRecord()
              .build()
          }
      }.forEach { future -> rangeQueue.put(future.join()) }
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
