package com.ethvm.common.config

import java.math.BigInteger

interface NetConfig {

  val chainId: ChainId

  val genesis: GenesisFile

  fun chainConfigForBlock(number: BigInteger): ChainConfig

  companion object {

    val mainnet by lazy {
      BaseNetConfig(
        ChainId.Mainnet,
        Genesis.Mainnet,
        0L to FrontierConfig(),
        1_150_000L to HomesteadConfig(),
        1_920_000L to DaoHardForkConfig(),
        2_463_000L to Eip150HardForkConfig(DaoHardForkConfig()),
        2_675_000L to Eip160HardForkConfig(DaoHardForkConfig()),
        4_370_000L to ByzantiumConfig(DaoHardForkConfig()),
        7_280_000L to PetersburgConfig(DaoHardForkConfig())
      )
    }

    val ropsten by lazy {
      BaseNetConfig(
        ChainId.Ropsten,
        Genesis.Ropsten,
        0L to HomesteadConfig(),
        10L to RopstenConfig(HomesteadConfig()),
        1_700_000L to RopstenConfig(ByzantiumConfig(DaoHardForkConfig())),
        4_230_000L to RopstenConfig(ConstantinopleConfig(DaoHardForkConfig())),
        4_939_394L to RopstenConfig(PetersburgConfig(DaoHardForkConfig()))
      )
    }

    val dev by lazy {
      BaseNetConfig(
        ChainId.Dev,
        Genesis.Dev,
        0L to DevConfig(PetersburgConfig(DaoHardForkConfig()))
      )
    }

    private val configByChainId = listOf(mainnet, ropsten, dev)
      .map { it.chainId to it }
      .toMap()

    fun forChainId(chainId: ChainId) = configByChainId[chainId]
  }
}

class BaseNetConfig(
  override val chainId: ChainId,
  genesis: Genesis,
  vararg configs: Pair<Long, ChainConfig>
) : NetConfig {

  override val genesis: GenesisFile = genesis.load()

  private val blockNumbers = configs.map { it.first.toBigInteger() }
  private val chainConfigs = configs.map { it.second }

  override fun chainConfigForBlock(number: BigInteger): ChainConfig {
    var idx = 0
    while ((idx < blockNumbers.size - 1) && number >= blockNumbers[idx]) {
      idx += 1
    }
    return chainConfigs[idx]
  }
}
