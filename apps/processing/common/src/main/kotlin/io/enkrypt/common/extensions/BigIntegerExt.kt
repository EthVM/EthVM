package io.enkrypt.common.extensions

import org.ethereum.util.ByteUtil
import java.math.BigInteger
import java.nio.ByteBuffer

/**
 * Omitting sign indication byte.
 * <br><br>
 * Instead of {@link org.spongycastle.util.BigIntegers#asUnsignedByteArray(BigInteger)}
 * <br>we use this custom method to avoid an empty array in case of BigInteger.ZERO
 *
 * @return A byte array without a leading zero byte if present in the signed encoding.
 *      BigInteger.ZERO will return an array with length 1 and byte-value 0.
 */
fun BigInteger?.unsignedBytes(): ByteArray? =
  when (this) {
    null -> null
    else -> {
      var data = this.toByteArray()
      if (data.size != 1 && data[0].toInt() == 0) {
        val tmp = ByteArray(data.size - 1)
        System.arraycopy(data, 1, tmp, 0, tmp.size)
        data = tmp
      }
      data
    }
  }

/**
 * The regular {@link java.math.BigInteger#toByteArray()} method isn't quite what we often need:
 * it appends a leading zero to indicate that the number is positive and may need padding.
 *
 * @param b the integer to format into a byte array
 * @param numBytes the desired size of the resulting byte array
 * @return numBytes byte long array.
 */
fun BigInteger?.unsignedBytes(numBytes: Int): ByteArray? =
  when (this) {
    null -> null
    else -> {
      val bytes = ByteArray(numBytes)
      val biBytes = this.toByteArray()
      val start = if (biBytes.size == numBytes + 1) 1 else 0
      val length = Math.min(biBytes.size, numBytes)
      System.arraycopy(biBytes, start, bytes, numBytes - length, length)
      bytes
    }
  }

fun BigInteger?.byteBuffer(): ByteBuffer = ByteBuffer.wrap((this ?: BigInteger.ZERO).toByteArray())

fun BigInteger?.unsignedByteBuffer() = if (this != null) ByteBuffer.wrap(this.unsignedBytes()) else null

fun BigInteger?.unsignedHex() = if(this != null) ByteUtil.toHexString(this.unsignedBytes()) else null
