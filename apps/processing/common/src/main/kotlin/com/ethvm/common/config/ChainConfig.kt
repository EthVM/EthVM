package com.ethvm.common.config

import com.ethvm.avro.processing.BalanceDeltaType
import com.ethvm.avro.processing.TokenType
import com.ethvm.common.extensions.ether
import com.ethvm.db.tables.records.BalanceDeltaRecord
import java.math.BigInteger
import java.sql.Timestamp
import java.util.Collections.emptyList

interface ChainConfig {

  val constants: ChainConstants

  fun hardForkBalanceDeltas(number: BigInteger, blockhash: String, timestamp: Timestamp): List<BalanceDeltaRecord> = emptyList()

  /**
   * EIP161: https://github.com/ethereum/EIPs/issues/161
   */
  fun eip161(): Boolean = false

  /**
   * EIP155: https://github.com/ethereum/EIPs/issues/155
   */
  fun chainId(): Int? = null

  /**
   * EIP198: https://github.com/ethereum/EIPs/issues/198
   */
  fun eip198(): Boolean = false

  /**
   * EIP206: https://github.com/ethereum/EIPs/issues/206
   */
  fun eip206(): Boolean = false

  /**
   * EIP211: https://github.com/ethereum/EIPs/issues/211
   */
  fun eip211(): Boolean = false

  /**
   * EIP212: https://github.com/ethereum/EIPs/issues/212
   */
  fun eip212(): Boolean = false

  /**
   * EIP213: https://github.com/ethereum/EIPs/issues/213
   */
  fun eip213(): Boolean = false

  /**
   * EIP214: https://github.com/ethereum/EIPs/issues/214
   */
  fun eip214(): Boolean = false

  /**
   * EIP658: https://github.com/ethereum/EIPs/issues/658
   */
  fun eip658(): Boolean = false

  /**
   * EIP1052: https://github.com/ethereum/EIPs/issues/1052
   */
  fun eip1052(): Boolean = false

  /**
   * EIP145: https://github.com/ethereum/EIPs/issues/145
   */
  fun eip145(): Boolean = false

  /**
   * EIP1283: https://github.com/ethereum/EIPs/issues/1283
   */
  fun eip1283(): Boolean = false

  /**
   * EIP1014: https://github.com/ethereum/EIPs/issues/1014
   */
  fun eip1014(): Boolean = false
}

open class OlympicConfig(override val constants: ChainConstants = ChainConstants.olympic) : ChainConfig

open class FrontierConfig(override val constants: ChainConstants = ChainConstants.frontier) : OlympicConfig(constants)

open class HomesteadConfig(override val constants: ChainConstants = ChainConstants.homestead) : FrontierConfig(constants)

open class DaoHardForkConfig(override val constants: ChainConstants = ChainConstants.daoHardFork) : HomesteadConfig(constants) {

  private val forkBlockNumber = 1_920_000.toBigInteger()

  private val withdrawAccount = DaoHardFork.withdrawAccount
  private val daoBalances = DaoHardFork.balances

  override fun hardForkBalanceDeltas(number: BigInteger, blockHash: String, timestamp: Timestamp): List<BalanceDeltaRecord> =
    if (number != forkBlockNumber) {
      emptyList()
    } else {

      val blockNumberDecimal = number.toBigDecimal()

      daoBalances.map { (address, balance) ->
        listOf(

          // deduct from address

          BalanceDeltaRecord()
            .apply {
              this.tokenType = TokenType.ETHER.toString()
              this.deltaType = BalanceDeltaType.HARD_FORK.toString()
              this.isReceiving = false
              this.blockNumber = blockNumberDecimal
              this.blockHash = blockHash
              this.address = address
              this.amount = balance.toBigDecimal().negate()
              this.timestamp = timestamp
            },

          // add to withdraw account
          BalanceDeltaRecord()
            .apply {
              this.tokenType = TokenType.ETHER.toString()
              this.deltaType = BalanceDeltaType.HARD_FORK.toString()
              this.isReceiving = false
              this.blockNumber = blockNumberDecimal
              this.address = withdrawAccount
              this.amount = balance.toBigDecimal()
              this.timestamp = timestamp
            }
        )
      }.flatten()
    }
}

open class Eip150HardForkConfig(val parent: ChainConfig) : DaoHardForkConfig() {
  override val constants = parent.constants
  override fun eip161(): Boolean = parent.eip161()
  override fun eip198(): Boolean = parent.eip161()
  override fun eip212(): Boolean = parent.eip161()
  override fun eip213(): Boolean = parent.eip161()
}

open class Eip160HardForkConfig(parent: ChainConfig) : Eip150HardForkConfig(parent) {
  override fun eip161() = true
  override fun chainId(): Int = ChainId.Mainnet.number
}

open class RopstenConfig(parent: ChainConfig) : Eip160HardForkConfig(parent) {
  override fun chainId(): Int = ChainId.Ropsten.number
}

open class DevConfig(parent: ChainConfig) : Eip160HardForkConfig(parent) {

  override fun chainId(): Int = ChainId.Dev.number

  override val constants = parent.constants.copy(
    blockReward = 0.ether()
  )
}

open class ByzantiumConfig(parent: ChainConfig) : Eip160HardForkConfig(parent) {

  override val constants = parent.constants.copy(
    blockReward = 3.ether()
  )

  override fun eip198(): Boolean = true
  override fun eip206(): Boolean = true
  override fun eip211(): Boolean = true
  override fun eip212(): Boolean = true
  override fun eip213(): Boolean = true
  override fun eip214(): Boolean = true
  override fun eip658(): Boolean = true
}

open class ConstantinopleConfig(parent: ChainConfig) : ByzantiumConfig(parent) {

  override val constants = parent.constants.copy(
    blockReward = 2.ether()
  )

  override fun eip1052() = true
  override fun eip145() = true
  override fun eip1283() = true
  override fun eip1014() = true
}

open class PetersburgConfig(parent: ChainConfig) : ConstantinopleConfig(parent) {
  override fun eip1283() = false
}

interface NetConfig {

  val chainId: ChainId

  val genesis: GenesisFile

  fun chainConfigForBlock(number: BigInteger): ChainConfig

  companion object {

    val mainnet by lazy {
      BaseNetConfig(
        ChainId.Mainnet,
        Genesis.Frontier,
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

class BaseNetConfig(override val chainId: ChainId, genesis: Genesis, vararg configs: Pair<Long, ChainConfig>) :
  NetConfig {

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
