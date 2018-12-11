package io.enkrypt.processing.extensions

import java.math.BigInteger
import java.nio.ByteBuffer

fun BigInteger?.byteBuffer() = if (this != null) ByteBuffer.wrap(this.toByteArray()) else null

fun Int?.bigIntBuffer() = if (this != null) BigInteger.valueOf(this.toLong()).byteBuffer() else null

fun Long?.bigIntBuffer() = if (this != null) BigInteger.valueOf(this).byteBuffer() else null
