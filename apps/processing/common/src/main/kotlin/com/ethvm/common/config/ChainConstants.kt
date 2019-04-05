package com.ethvm.common.config

import com.ethvm.common.extensions.ether
import com.ethvm.common.extensions.finney
import java.math.BigInteger

data class ChainConstants(
  val maxExtraDataSize: Int = 32,
  val minGasLimit: Int = 125_000,
  val gasLimitBoundDivisor: Int = 1024,
  val minDifficutly: BigInteger = BigInteger.valueOf(131_072),
  val difficultyBoundDivisor: BigInteger = BigInteger.valueOf(2048),
  val expDifficultyPeriod: Int = 100_000,
  val uncleGenerationLimit: Int = 7,
  val uncleListLimit: Int = 2,
  val bestNumberDiffLimit: Int = 100,
  val blockReward: BigInteger = 1500.finney(),
  // transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid, introduced in Homestead release
  val secp256k1n: BigInteger = BigInteger("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16),
  val longestChain: Int = 192,
  val durationLimit: Int = 8,
  val initialNonce: BigInteger = BigInteger.ZERO,
  val maxContractSize: Int = Integer.MAX_VALUE,
  // introduced in homestead
  val createEmptyContractOnOutOfGas: Boolean = true,
  // introduced in homestead, before homestead this opcode should generate an exception
  val hasDelegateCallOpCode: Boolean = false
) {

  companion object {

    val olympic = ChainConstants()

    val frontier = ChainConstants(
      durationLimit = 13,
      blockReward = 5.ether(),
      minGasLimit = 5_000
    )

    val homestead = frontier.copy(
      createEmptyContractOnOutOfGas = false,
      hasDelegateCallOpCode = true
    )

    val daoHardFork = homestead
  }
}
