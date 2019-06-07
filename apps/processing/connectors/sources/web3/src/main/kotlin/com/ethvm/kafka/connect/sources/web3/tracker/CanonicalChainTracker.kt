package com.ethvm.kafka.connect.sources.web3.tracker

import mu.KotlinLogging
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.atomic.AtomicLong

class CanonicalChainTracker(
  initialTail: Long = 0L,
  initialHead: Long = -1L
) {

  private val logger = KotlinLogging.logger {}

  @Volatile
  public var head: Long = initialHead

  // multiple readers on tail so we use AtomicLong
  private val tail = AtomicLong(initialTail)

  private var reOrgs: ArrayBlockingQueue<LongRange> = ArrayBlockingQueue(10)

  fun newHeads(heads: List<Long>) {

    // we don't process an empty list
    if (heads.isEmpty()) {
      return
    }

    // read once against the volatile
    val currentHead = this.head

    // determine the range the new heads span
    val max = heads.max()!!
    val min = heads.min()!!

    // update head
    if (max > currentHead) {
      this.head = max
    }

    // determine duplicates indicating a chain re-org, sorting them into their natural order

    val reOrg = heads
      .groupingBy { it }
      .eachCount()
      .filter { it.value > 1 }
      .map { it.key }
      .sorted()

    if (reOrg.isNotEmpty()) {

      LongRange(reOrg.min()!!, reOrg.max()!!)
        .apply {
          reOrgs.add(this)
          logger.debug { "Chain re-organization detected! Re-org: $this" }
        }
    }

    // update tail
    tryResetTail(min)
  }

  private fun tryResetTail(value: Long) {

    logger.debug { "Trying to reset tail to $value" }

    // it's possible the tail gets updated after we read it so we loop whilst our value is less than the current tail and
    // keep attempting to write

    do {
      val currentTail = tail.get()
      logger.debug { "Current tail = $currentTail" }
    } while (value < currentTail && !tail.compareAndSet(currentTail, value))

    logger.debug { "After reset attempt tail = ${tail.get()}" }
  }

  fun nextRange(maxSize: Int = 4): Pair<LongRange?, List<LongRange>> {

    val currentHead = head
    val currentTail = tail.get()

    val reOrgRanges = ArrayList<LongRange>()
      .apply {
        if (reOrgs.isNotEmpty()) reOrgs.drainTo(this)
      }

    logger.debug { "Next range. Current tail = $currentTail, current head = $currentHead" }

    if (currentTail == currentHead + 1) {
      // we have caught up to the head and there is nothing new
      return Pair(null, reOrgRanges)
    }

    val targetHead = currentTail + maxSize - 1

    val range = when {
      targetHead > currentHead -> LongRange(currentTail, currentHead)
      else -> LongRange(currentTail, targetHead)
    }

    logger.debug { "Next range from chain tracker: $range" }

    // update tail for next fetch
    tail.compareAndSet(currentTail, range.last + 1)

    return Pair(range, reOrgRanges)
  }
}
