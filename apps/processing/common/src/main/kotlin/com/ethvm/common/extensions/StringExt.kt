package com.ethvm.common.extensions

import com.google.common.base.CaseFormat
import org.apache.commons.codec.binary.Hex
import java.math.BigInteger

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

fun String.hexToBI() =
  if (this.startsWith("0x")) {
    BigInteger(this.substring(2), 16)
  } else
    BigInteger(this)

fun String.camelToSnakeCase(): String =
  CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, this)

fun String.snakeToCamelCase(): String =
  CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, this)
