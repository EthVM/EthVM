package io.enkrypt.common.extensions

import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.PushbackInputStream
import java.math.BigInteger
import java.nio.ByteBuffer
import java.util.zip.GZIPInputStream
import java.util.zip.GZIPOutputStream
import org.apache.commons.codec.binary.Hex as ApacheHex

fun ByteArray?.fixed(size: Int): ByteArray? {
  return if(this == null) {
    this
  } else {
    require(this.size == size) { "Must be of size $size"}
    this
  }
}

fun ByteArray?.fixed1(): ByteArray? = if (this == null) null else this.fixed(1)
fun ByteArray?.fixed8(): ByteArray? = if (this == null) null else this.fixed(8)
fun ByteArray?.data20(): ByteArray? = if (this == null) null else this.fixed(20)
fun ByteArray?.data32(): ByteArray? = if (this == null) null else this.fixed(32)
fun ByteArray?.data256(): ByteArray? = if (this == null) null else this.fixed(256)

fun ByteArray?.hex(): String? = if(this != null ) ApacheHex.encodeHexString(this) else this

fun ByteArray?.bigInteger(): BigInteger? = BigInteger(this)

fun ByteArray?.unsignedBigInteger(): BigInteger = if (this == null || this.isEmpty()) BigInteger.ZERO else BigInteger(1, this)

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

  if(this == null || this.size < threshold) {
    return this
  }

  val bytesOut = ByteArrayOutputStream()
  val gzipOut = GZIPOutputStream(bytesOut)
  gzipOut.write(this)
  gzipOut.flush()
  gzipOut.close()

  return bytesOut.toByteArray()
}

fun ByteArray?.decompress(): ByteArray? {

  if(this == null || this.size < 2) {
    return this
  }

  val input = ByteArrayInputStream(this)

  val pb = PushbackInputStream(input, 2) //we need a pushbackstream to look ahead
  val signature = ByteArray(2)

  val len = pb.read(signature) //read the signature
  pb.unread(signature, 0, len) //push back the signature to the stream

  //check if matches standard gzip magic number
  return if (signature[0] == 0x1f.toByte() && signature[1] == 0x8b.toByte()) {
    GZIPInputStream(pb).readBytes()
  } else {
    this
  }

}
