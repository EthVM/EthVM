package com.ethvm.kafka.connect.sources.web3.tracker

import arrow.core.Option
import arrow.core.toOption
import com.ethvm.common.extensions.hexToBI
import io.reactivex.disposables.Disposable
import mu.KotlinLogging
import org.web3j.protocol.parity.Parity
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicLong

class CanonicalChainTracker(
  parity: Parity,
  startFrom: Long = 0L
) {

  private val logger = KotlinLogging.logger {}

  // multiple readers on tail so we use AtomicLong
  private val tail = AtomicLong(startFrom)

  // single write multiple readers so we can use volatile
  @Volatile
  private var head: Long = parity.ethBlockNumber().send().blockNumber.longValueExact()

  private var exception: Throwable? = null

  private var subscription: Disposable

  private var reOrgs: ArrayBlockingQueue<LongRange> = ArrayBlockingQueue(10)

  init {
    assert(startFrom >= 0L) { "StartFrom needs to be >= 0" }

    logger.debug { "Starting subscription to new heads!" }

    subscription =
      parity
        .newHeadsNotifications()
        .map { it.params.result }
        .map { it.number.hexToBI().longValueExact() }
        .buffer(1, TimeUnit.SECONDS, 256)
        .onBackpressureBuffer()
        .filter { it.isNotEmpty() }
        .subscribe(
          { heads ->

            val newHead = heads.max()!!
            if(newHead > head) {
              head = newHead
            }

            val tail = heads.min()!!

            logger.debug { "New head notification! - Tail: $tail - Head: $head" }

            val reOrg: List<Long> = heads.groupingBy { it }.eachCount().filter { it.value > 1 }.map { it.key }
            if (reOrg.isNotEmpty()) {
              val minReOrg = reOrg.min()
              val maxReOrg = reOrg.max()
              val range = LongRange(minReOrg!!, maxReOrg!!)
              reOrgs.add(range)

              logger.debug { "Chain reorganization detected! Affecting range: $range" }
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

  fun nextRange(maxSize: Int = 128): Pair<Option<LongRange>, List<LongRange>> {

    // Throw exception if any
    val ex = exception
    if (ex != null) {
      throw ex
    }

    val currentHead = head
    val currentTail = tail.get()
    val reOrg = ArrayList<LongRange>().apply { if (reOrgs.isNotEmpty()) reOrgs.drainTo(this) }

    if (currentTail == currentHead + 1) {
      logger.debug { "Tail: $currentTail == Head: $currentHead. Skipping!" }
      return Pair(Option.empty(), reOrg)
    }

    val range = currentTail.until(currentTail + maxSize) // range is not inclusive at the end
      .let { range ->
        when {
          range.endInclusive > currentHead -> currentTail.until(currentHead)
          else -> range
        }
      }

    logger.debug { "Next range: $range" }

    tail.compareAndSet(currentTail, range.endInclusive + 1)

    return Pair(range.toOption(), reOrg)
  }
}
