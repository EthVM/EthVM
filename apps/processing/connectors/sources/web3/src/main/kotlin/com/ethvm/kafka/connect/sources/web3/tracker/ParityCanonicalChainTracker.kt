package com.ethvm.kafka.connect.sources.web3.tracker

import com.ethvm.common.extensions.hexToBI
import io.reactivex.disposables.Disposable
import mu.KotlinLogging
import org.web3j.protocol.parity.Parity
import java.util.concurrent.TimeUnit

class ParityCanonicalChainTracker(
  parity: Parity,
  startFrom: Long = 0L
) {

  private val logger = KotlinLogging.logger {}

  private val chainTracker by lazy {
    val currentHead = parity.ethBlockNumber().send().blockNumber.longValueExact()
    CanonicalChainTracker(startFrom, currentHead)
  }

  private var exception: Throwable? = null

  private var subscription: Disposable

  val head
    get() = this.chainTracker.head

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
          { heads -> chainTracker.newHeads(heads) },
          { ex -> exception = ex }
        )
  }

  fun stop() {
    subscription.dispose()
  }

  fun nextRange(maxSize: Int = 128): Pair<LongRange?, List<LongRange>> {

    // Throw exception if any
    val ex = exception
    if (ex != null) {
      throw ex
    }

    return chainTracker.nextRange(maxSize)
  }
}
