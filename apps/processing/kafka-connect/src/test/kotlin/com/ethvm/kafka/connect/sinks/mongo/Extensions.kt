package com.ethvm.kafka.connect.sinks.mongo

import org.bson.types.Decimal128
import java.math.BigInteger

fun BigInteger.toDecimal128(): Decimal128 =
  Decimal128(this.toBigDecimal())
