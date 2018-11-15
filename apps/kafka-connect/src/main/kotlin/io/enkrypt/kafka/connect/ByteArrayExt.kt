package io.enkrypt.kafka.connect

private val HEX_CHARS = "0123456789abcdef".toCharArray()

/**
 * Taken from https://gist.github.com/fabiomsr/845664a9c7e92bafb6fb0ca70d4e44fd
 */
fun ByteArray.toHex() : String {
  val result = StringBuffer()

  forEach {
    val octet = it.toInt()
    val firstIndex = (octet and 0xF0).ushr(4)
    val secondIndex = octet and 0x0F
    result.append(HEX_CHARS[firstIndex])
    result.append(HEX_CHARS[secondIndex])
  }

  return result.toString()
}
