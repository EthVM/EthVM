package com.ethvm.common.extensions

import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.util.zip.GZIPOutputStream
import org.apache.commons.codec.binary.Hex as ApacheHex

fun ByteArray?.hex(): String? = if (this != null) ApacheHex.encodeHexString(this) else this

fun ByteArray?.byteBuffer(): ByteBuffer? = if (this != null) ByteBuffer.wrap(this) else this

/**
 * Search the fixed for the first occurrence of the byte array pattern.
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

fun ByteArray?.compress(threshold: Int): ByteArray? {

  if (this == null || this.size < threshold) {
    return this
  }

  val bytesOut = ByteArrayOutputStream()
  val gzipOut = GZIPOutputStream(bytesOut)
  gzipOut.write(this)
  gzipOut.flush()
  gzipOut.close()

  return bytesOut.toByteArray()
}
