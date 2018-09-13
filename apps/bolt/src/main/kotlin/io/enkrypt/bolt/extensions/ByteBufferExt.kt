package io.enkrypt.bolt.extensions

import java.math.BigDecimal
import java.math.BigInteger
import java.nio.ByteBuffer
import javax.xml.bind.DatatypeConverter

fun ByteBuffer?.toByteArray(): ByteArray? {
  if (this == null) {
    return null
  }
  return ByteArray(remaining()).also { get(it) }
}

fun ByteBuffer?.toBigInteger(): BigInteger? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining()).also { get(it) }
  return BigInteger(arr)
}

fun ByteBuffer?.toBigDecimal(): BigDecimal? {
  if (this == null) {
    return null
  }
  return BigDecimal(toBigInteger())
}

fun ByteBuffer?.toHex(): String? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining()).also { get(it) }
  return "0x" + DatatypeConverter.printHexBinary(arr)
}
