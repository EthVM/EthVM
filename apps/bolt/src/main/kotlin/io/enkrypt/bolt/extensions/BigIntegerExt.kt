package io.enkrypt.bolt.extensions

import java.math.BigInteger
import java.nio.ByteBuffer

fun BigInteger?.toByteBuffer() = if(this != null) ByteBuffer.wrap(this.toByteArray()) else null
