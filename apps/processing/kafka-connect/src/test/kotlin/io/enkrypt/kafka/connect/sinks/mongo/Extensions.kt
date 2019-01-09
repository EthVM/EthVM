package io.enkrypt.kafka.connect.sinks.mongo

import org.bson.types.Decimal128
import java.math.BigInteger

fun Int.toDecimal128(): Decimal128 = this.toLong().toDecimal128()

fun Long.toDecimal128(): Decimal128 = BigInteger.valueOf(this).toDecimal128()

fun BigInteger.toDecimal128(): Decimal128 =
  Decimal128(this.toBigDecimal())
