package io.enkrypt.bolt.extensions

import java.math.BigDecimal
import java.math.BigInteger
import java.nio.ByteBuffer
import javax.xml.bind.DatatypeConverter
import java.util.BitSet

fun ByteBuffer?.toByteArray(): ByteArray? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining())
  get(arr)
  return arr
}

fun ByteBuffer?.toBigInteger(): BigInteger? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining())
  get(arr)
  return BigInteger(1, arr)
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
  val arr = ByteArray(remaining())
  get(arr)
  return "0x" + DatatypeConverter.printHexBinary(arr)
}
