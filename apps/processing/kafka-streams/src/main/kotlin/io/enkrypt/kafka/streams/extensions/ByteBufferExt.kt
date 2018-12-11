package io.enkrypt.kafka.streams.extensions

import org.ethereum.util.ByteUtil
import java.math.BigDecimal
import java.math.BigInteger
import java.nio.ByteBuffer

fun ByteBuffer?.byteArray(): ByteArray? {
  if (this == null) {
    return null
  }
  return ByteArray(remaining()).also { get(it) }
}

fun ByteBuffer?.bigInteger(): BigInteger? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining()).also { get(it) }
  return if (arr.isNotEmpty()) BigInteger(arr) else BigInteger.ZERO
}

fun ByteBuffer?.bigDecimal(): BigDecimal? {
  if (this == null) {
    return null
  }
  return BigDecimal(bigInteger())
}

fun ByteBuffer?.hex(): String? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining()).also { get(it) }
  return ByteUtil.toHexString(arr)
}
