package io.enkrypt.common.codec

import org.apache.commons.codec.binary.Hex as ApacheHex

object Hex {

  fun decode(s: String): ByteArray = ApacheHex.decodeHex(s)
}
