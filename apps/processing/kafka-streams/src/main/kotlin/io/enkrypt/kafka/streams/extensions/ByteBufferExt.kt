package io.enkrypt.kafka.streams.extensions

import io.enkrypt.avro.common.*
import org.ethereum.util.ByteUtil
import java.math.BigDecimal
import java.math.BigInteger
import java.nio.ByteBuffer

fun ByteBuffer?.data1(): Data1? = if(this == null) null else Data1(this.byteArray())
fun ByteBuffer?.data8(): Data8? = if(this == null) null else Data8(this.byteArray())
fun ByteBuffer?.data20(): Data20? = if(this == null) null else Data20(this.byteArray())
fun ByteBuffer?.data32(): Data32? = if(this == null) null else Data32(this.byteArray())
fun ByteBuffer?.data256(): Data256? = if(this == null) null else Data256(this.byteArray())

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
