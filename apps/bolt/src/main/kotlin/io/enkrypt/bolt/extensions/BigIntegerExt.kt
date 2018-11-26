package io.enkrypt.bolt.extensions

import java.math.BigInteger
import java.nio.ByteBuffer

fun BigInteger?.toByteBuffer() = if(this != null) ByteBuffer.wrap(this.toByteArray()) else null

fun Int?.bigIntBuffer() = if(this != null) BigInteger.valueOf(this.toLong()).toByteBuffer() else null

fun Long?.bigIntBuffer() = if(this != null) BigInteger.valueOf(this).toByteBuffer() else null
