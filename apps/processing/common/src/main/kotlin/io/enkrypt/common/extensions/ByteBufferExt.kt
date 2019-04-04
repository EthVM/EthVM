package io.enkrypt.common.extensions

import java.math.BigDecimal
import java.math.BigInteger
import java.nio.ByteBuffer

fun ByteBuffer?.fixed(capacity: Int): ByteBuffer? {
  return if (this == null) {
    this
  } else {
    require(this.capacity() == capacity) { "Must have capacity $capacity" }
    return this
  }
}

fun ByteBuffer?.fixed1(): ByteBuffer? = if (this == null) null else this.fixed(1)
fun ByteBuffer?.fixed8(): ByteBuffer? = if (this == null) null else this.fixed(8)
fun ByteBuffer?.fixed20(): ByteBuffer? = if (this == null) null else this.fixed(20)
fun ByteBuffer?.fixed32(): ByteBuffer? = if (this == null) null else this.fixed(32)
fun ByteBuffer?.fixed256(): ByteBuffer? = if (this == null) null else this.fixed(256)

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

fun ByteBuffer?.decompress(): ByteBuffer? {
  return if (this == null) {
    this
  } else {
    ByteBuffer.wrap(this.byteArray().decompress())
  }
}
