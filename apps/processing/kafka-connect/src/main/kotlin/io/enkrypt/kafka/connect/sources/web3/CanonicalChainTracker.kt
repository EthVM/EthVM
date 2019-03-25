package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.common.extensions.hexUBigInteger
import io.reactivex.disposables.Disposable
import mu.KotlinLogging
import org.web3j.protocol.websocket.WebSocketService
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicLong

class CanonicalChainTracker(
  parity: JsonRpc2_0ParityExtended,
  startFrom: Long
) {

  private val logger = KotlinLogging.logger {}

  // multiple readers on tail so we use AtomicLong
  private val tail = AtomicLong(startFrom)

  // single write multiple readers so we can use volatile
  @Volatile
  private var head: Long = parity.ethBlockNumber().send().blockNumber.longValueExact()

  private var exception: Throwable? = null

  private var subscription: Disposable

  private var reorgs : ArrayBlockingQueue<ClosedRange<Long>> = ArrayBlockingQueue(10)

  init {

    logger.debug { "Starting subscription to new heads!" }

    subscription =
      parity
        .newHeadsNotifications()
        .map { it.params.result }
        .map { it.number.hexUBigInteger()!!.longValueExact() }
        .buffer(1000, TimeUnit.MILLISECONDS, 128)
        .onBackpressureBuffer()
        .filter { it.isNotEmpty() }
        .subscribe(
          { heads ->

            head = heads.max()!!
            val tail = heads.min()!!

            logger.debug { "New Heads notification! Current range - Tail: $tail - Head: $head" }

            val reorg: List<Long> = heads.groupingBy { it }.eachCount().filter { it.value > 1 }.map { it.key }
            if (reorg.isNotEmpty()) {
              logger.debug { "Re-org detected! Affecting range: $reorg" }
              val minReOrg = reorg.min()
              val maxReOrg = reorg.max()
              val range = LongRange(minReOrg!!, maxReOrg!!)
              reorgs.add(range)
            }

            tryResetTail(tail)
          },
          { ex -> exception = ex }
        )
  }

  fun stop() {
    subscription.dispose()
  }

  private fun tryResetTail(value: Long) {

    // it's possible the tail gets updated after we read it so we loop whilst our value is less than the current tail and
    // keep attempting to write

    do {
      val currentTail = tail.get()
    } while (value < currentTail && !tail.compareAndSet(currentTail, value))
  }

  // 1) Return a Pair<ClosedRange, Optional<ClosedRange (Re-Org)>>
  fun nextRange(maxSize: Int = 32): ClosedRange<Long>? {

    val currentHead = head
    val currentTail = tail.get()

    logger.debug { "Requesting next range - Tail: $currentTail - Head: $currentHead" }

    if (currentTail == currentHead) {
      logger.debug { "Tail: $currentTail == Head: $currentHead. Skipping!" }
      return null
    }

    val range = currentTail.until(currentTail + maxSize) // range is not inclusive at the end
      .let {
        if (it.endInclusive > currentHead) {
          currentTail.until(currentHead)
        } else {
          it
        }
      }

    logger.debug { "Range: $range" }

    tail.compareAndSet(currentTail, range.endInclusive + 1)

    return range
  }
}

fun main() {
  val wsService = WebSocketService("ws://localhost:8546", false)
  wsService.connect()

  val tracker = CanonicalChainTracker(
    JsonRpc2_0ParityExtended(wsService),
    0
  )

  val executor = Executors.newSingleThreadScheduledExecutor()
  executor.scheduleAtFixedRate(
    { tracker.nextRange(32) },
    0,
    1,
    TimeUnit.SECONDS
  )
}
