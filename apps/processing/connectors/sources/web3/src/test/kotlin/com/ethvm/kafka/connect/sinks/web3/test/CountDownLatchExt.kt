package com.ethvm.kafka.connect.sinks.web3.test

import java.util.concurrent.CountDownLatch

inline fun <R> latch(count: Int = 1, block: CountDownLatch.() -> R): R {
  val latch = CountDownLatch(count)
  val r = latch.block()
  latch.await()
  return r
}
