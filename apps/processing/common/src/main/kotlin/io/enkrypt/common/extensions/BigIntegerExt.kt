package io.enkrypt.common.extensions

import org.spongycastle.util.BigIntegers
import java.math.BigInteger
import java.nio.ByteBuffer

fun BigInteger.unsignedByteArray() = BigIntegers.asUnsignedByteArray(this)

fun BigInteger.unsignedByteBuffer() = ByteBuffer.wrap(unsignedByteArray())

fun BigInteger?.byteBuffer() = if (this != null) ByteBuffer.wrap(this.toByteArray()) else null

fun Int?.bigIntBuffer() = if (this != null) BigInteger.valueOf(this.toLong()).byteBuffer() else null

fun Long?.bigIntBuffer() = if (this != null) BigInteger.valueOf(this).byteBuffer() else null
