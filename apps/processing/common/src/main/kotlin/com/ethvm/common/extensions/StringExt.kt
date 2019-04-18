package com.ethvm.common.extensions

import java.math.BigInteger
import java.nio.ByteBuffer

fun String.hexBytes(): ByteArray =
  run {

    var str = when {
      this.startsWith("0x") -> this.replace("0x", "")
      else -> this
    }

    if (str.length % 2 == 1) {
      str = "0$str"
    }

    decodeHex(str.toCharArray())
  }

fun String.hexBuffer() = this.hexBytes().byteBuffer()

fun String.hexToBI() =
  if (this.startsWith("0x")) {
    BigInteger(this.substring(2), 16)
  } else
    BigInteger(this)

fun String.byteBuffer(): ByteBuffer = ByteBuffer.wrap(this.toByteArray())

@Throws(IllegalStateException::class)
private fun decodeHex(data: CharArray): ByteArray {

  val len = data.size

  if (len and 0x01 != 0) {
    throw IllegalStateException("Odd number of characters.")
  }

  val out = ByteArray(len shr 1)

  // two characters form the hex value.
  var i = 0
  var j = 0
  while (j < len) {
    var f = toDigit(data[j], j) shl 4
    j++
    f = f or toDigit(data[j], j)
    j++
    out[i] = (f and 0xFF).toByte()
    i++
  }

  return out
}

@Throws(IllegalStateException::class)
private fun toDigit(ch: Char, index: Int): Int {
  val digit = Character.digit(ch, 16)
  if (digit == -1) {
    throw IllegalStateException("Illegal hexadecimal character $ch at index $index")
  }
  return digit
}
