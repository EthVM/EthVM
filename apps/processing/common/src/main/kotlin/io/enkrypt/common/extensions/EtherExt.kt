package io.enkrypt.common.extensions

import java.math.BigInteger

fun Number.wei() = BigInteger.valueOf(this.toLong())

fun Number.kwei() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000)
fun Number.babbage() = this.kwei()

fun Number.mwei() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000_000)
fun Number.lovelace() = this.mwei()

fun Number.gwei() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000_000_000)
fun Number.shannon() = this.gwei()

fun Number.microEther() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000_000_000_000)
fun Number.szabo() = this.microEther()

fun Number.milliEther() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000_000_000_000_000)
fun Number.finney() = this.milliEther()

fun Number.ether() = BigInteger.valueOf(this.toLong()) * BigInteger.valueOf(1_000_000_000_000_000_000)
