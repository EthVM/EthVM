package io.enkrypt.bolt.extensions

import org.ethereum.util.ByteUtil

fun String?.hexBuffer() = if(this != null) ByteUtil.hexStringToBytes(this).toByteBuffer() else null
