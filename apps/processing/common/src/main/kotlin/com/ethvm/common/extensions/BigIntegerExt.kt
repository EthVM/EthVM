package com.ethvm.common.extensions

import java.math.BigInteger
import java.nio.ByteBuffer

fun BigInteger.byteBuffer(): ByteBuffer = ByteBuffer.wrap(this.toByteArray())

fun BigInteger.toHex() = "0x${this.toString(16)}"
