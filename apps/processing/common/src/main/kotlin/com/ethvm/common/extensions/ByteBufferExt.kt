package com.ethvm.common.extensions

import java.math.BigInteger
import java.nio.ByteBuffer

fun ByteBuffer?.byteArray(): ByteArray? {
  if (this == null) {
    return null
  }

  val result = ByteArray(remaining()).also { get(it) }
  position(0)
  return result
}

fun ByteBuffer.bigInteger() = BigInteger(this.byteArray())

fun ByteBuffer?.compress(threshold: Int): ByteBuffer? {
  return if (this == null || this.capacity() < threshold) {
    return this
  } else {
    ByteBuffer.wrap(this.byteArray().compress(threshold))
  }
}
