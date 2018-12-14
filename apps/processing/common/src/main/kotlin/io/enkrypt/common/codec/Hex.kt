package io.enkrypt.common.codec

import org.apache.commons.codec.binary.Hex as ApacheHex

object Hex {

  fun decodeHex(s: String) = ApacheHex.decodeHex(s)
}
