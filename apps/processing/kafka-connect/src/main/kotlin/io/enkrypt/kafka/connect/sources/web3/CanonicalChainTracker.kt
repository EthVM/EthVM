package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.common.extensions.hexUBigInteger
import io.reactivex.disposables.Disposable
import mu.KotlinLogging
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicLong

class CanonicalChainTracker(
  parity: JsonRpc2_0ParityExtended,
  startFrom: Long
) {

  private val logger = KotlinLogging.logger {}

  // multiple readers on tail so we use AtomicLong
  val tail = AtomicLong(startFrom)

  // single write multiple readers so we can use volatile
  @Volatile
  var head: Long = parity.ethBlockNumber().send().blockNumber.longValueExact()

  var exception: Throwable? = null

  var subscription: Disposable

  init {

    subscription =
      parity.newHeadsNotifications()
      .map { it.params.result }
      .map { it.number.hexUBigInteger()!!.longValueExact() }
      .buffer(1000, TimeUnit.MILLISECONDS, 128)
      .onBackpressureBuffer()
      .toObservable()
      .filter { it.isNotEmpty() }
      .subscribe(
        { heads ->

          this.head = heads.max()!!
          tryResetTail(heads.min()!!)
        },
        { ex -> this.exception = ex }
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

  fun nextRange(maxSize: Int = 32): ClosedRange<Long>? {

    val currentHead = this.head
    val currentTail = this.tail.get()

    if (currentHead == currentTail) return null

    var range = currentTail.until(currentTail + maxSize + 1) // range is not inclusive at the end

    if (range.endInclusive > currentHead) {
      range = currentTail.until(currentHead + 1)
    }

    tail.compareAndSet(currentTail, range.endInclusive)

    return range
  }
}
