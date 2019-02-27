package io.enkrypt.common.extensions

import org.apache.commons.codec.binary.Hex
import java.nio.ByteBuffer

fun String.hexBytes(): ByteArray =
  run {

    var str = if (this.startsWith("0x")) {
      this.replace("0x", "")
    } else {
      this
    }

    if (str.length % 2 == 1) {
      str = "0$str"
    }

    Hex.decodeHex(str)
  }

fun String.hexBuffer() = this.hexBytes().byteBuffer()
fun String.hexFixedBuffer(length: Int): ByteBuffer = this.hexBuffer().fixed(length)!!

fun String.hexBuffer8() = this.hexFixedBuffer(8)
fun String.hexBuffer20() = this.hexFixedBuffer(20)
fun String.hexBuffer32() = this.hexFixedBuffer(32)
fun String.hexBuffer256() = this.hexFixedBuffer(256)

fun String.hexUBigInteger() = this.hexBuffer().unsignedBigInteger()
