package io.enkrypt.common.extensions

import io.enkrypt.avro.common.Data1
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data256
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.common.Data8
import org.ethereum.util.ByteUtil
import org.spongycastle.util.BigIntegers
import java.math.BigInteger
import java.nio.ByteBuffer

fun ByteArray?.data1(): Data1? = if (this == null) null else Data1(this)
fun ByteArray?.data8(): Data8? = if (this == null) null else Data8(this)
fun ByteArray?.data20(): Data20? = if (this == null) null else Data20(this)
fun ByteArray?.data32(): Data32? = if (this == null) null else Data32(this)
fun ByteArray?.data256(): Data256? = if (this == null) null else Data256(this)

fun ByteArray?.hex(): String? = ByteUtil.toHexString(this)

fun ByteArray?.bigInteger(): BigInteger? = BigInteger(this)
fun ByteArray?.unsignedBI(): BigInteger = BigIntegers.fromUnsignedByteArray(this)

fun ByteArray?.byteBuffer(): ByteBuffer? = if (this != null) ByteBuffer.wrap(this) else null

/**
 * Search the data for the first occurrence of the byte array pattern.
 */
fun ByteArray.indexByteArrayOf(pattern: ByteArray): Int {

  /**
   * Computes the failure function using a boot-strapping process, where the pattern is matched against itself.
   */
  fun computeFailure(pattern: ByteArray): IntArray {
    val failure = IntArray(pattern.size)
    var j = 0

    for (i in 1 until pattern.size) {
      while (j > 0 && pattern[j] != pattern[i]) {
        j = failure[j - 1]
      }
      if (pattern[j] == pattern[i]) {
        j++
      }
      failure[i] = j
    }

    return failure
  }

  val failure = computeFailure(pattern)
  var j = 0

  for (i in this.indices) {
    while (j > 0 && pattern[j] != this[i]) {
      j = failure[j - 1]
    }
    if (pattern[j] == this[i]) {
      j++
    }
    if (j == pattern.size) {
      return i - pattern.size + 1
    }
  }

  return -1
}
