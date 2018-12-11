package io.enkrypt.kafka.streams.extensions

import io.enkrypt.avro.common.*
import org.ethereum.util.ByteUtil

fun String?.hexBuffer() = if (this != null) ByteUtil.hexStringToBytes(this).byteBuffer() else null

fun String.hexData1() = Data1(ByteUtil.hexStringToBytes(this))
fun String.hexData8() = Data8(ByteUtil.hexStringToBytes(this))
fun String.hexData20() = Data20(ByteUtil.hexStringToBytes(this))
fun String.hexData32() = Data32(ByteUtil.hexStringToBytes(this))
fun String.hexData256() = Data256(ByteUtil.hexStringToBytes(this))

