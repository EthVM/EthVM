package com.ethvm.common.extensions

import java.math.BigInteger

fun Number.milliEther() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000_000_000_000_000)

fun Number.ether() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000_000_000_000_000_000)
