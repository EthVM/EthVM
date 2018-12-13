package io.enkrypt.kafka.connect.extensions

import org.apache.commons.codec.binary.Hex
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import java.math.BigInteger

private val HEX_CHARS = "0123456789abcdef".toCharArray()

/**
 * Taken from https://gist.github.com/fabiomsr/845664a9c7e92bafb6fb0ca70d4e44fd
 */
fun ByteArray.toHex(): String {
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

fun ByteArray.toBigInteger(): BigInteger = BigInteger(this)

fun Long.toBigInteger(): BigInteger = BigInteger.valueOf(this)

fun String.hexToBytes(): ByteArray = Hex.decodeHex(this.replace("0x", ""))

