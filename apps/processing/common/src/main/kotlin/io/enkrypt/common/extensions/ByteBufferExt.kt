package io.enkrypt.common.extensions

import io.enkrypt.avro.common.Data1
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data256
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.common.Data8
import org.ethereum.util.ByteUtil
import java.io.ByteArrayOutputStream
import java.math.BigDecimal
import java.math.BigInteger
import java.nio.ByteBuffer
import java.util.zip.GZIPOutputStream

fun ByteBuffer?.data1(): Data1? = if (this == null) null else Data1(this.byteArray())
fun ByteBuffer?.data8(): Data8? = if (this == null) null else Data8(this.byteArray())
fun ByteBuffer?.data20(): Data20? = if (this == null) null else Data20(this.byteArray())
fun ByteBuffer?.data32(): Data32? = if (this == null) null else Data32(this.byteArray())
fun ByteBuffer?.data256(): Data256? = if (this == null) null else Data256(this.byteArray())

fun ByteBuffer?.byteArray(): ByteArray? {
  if (this == null) {
    return null
  }

  val result = ByteArray(remaining()).also { get(it) }
  position(0)
  return result
}

fun ByteBuffer?.bigInteger(): BigInteger? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining()).also { get(it) }
  position(0)
  return if (arr.isNotEmpty()) BigInteger(arr) else BigInteger.ZERO
}

fun ByteBuffer?.unsignedBigInteger(): BigInteger? {
  if (this == null) {
    return null
  }
  val arr = ByteArray(remaining()).also { get(it) }
  position(0)
  return if (arr.isNotEmpty()) arr.unsignedBigInteger() else BigInteger.ZERO
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
  position(0)
  return ByteUtil.toHexString(arr)
}


fun ByteBuffer?.gzip(threshold: Int): ByteBuffer? {
  if(this == null || this.capacity() < threshold) {
    return null
  }
  return ByteBuffer.wrap(this.byteArray().gzip(threshold))
}
