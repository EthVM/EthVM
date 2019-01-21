package io.enkrypt.common.config

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.processing.ChainEventRecord
import io.enkrypt.avro.processing.ChainEventType
import io.enkrypt.avro.processing.DaoHfBalanceTransferRecord
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.hexData20
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import java.math.BigInteger

interface ChainConfig {

  val constants: ChainConstants

  fun hardForkEvents(block: BlockRecord): List<ChainEventRecord> = emptyList()

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

  override fun hardForkEvents(block: BlockRecord): List<ChainEventRecord> =
    if(block.getHeader().getNumber().unsignedBigInteger() != forkBlockNumber) {
      emptyList()
    } else {
      daoBalances.map{ (address, balance) -> daoHfBalanceTransfer(address, withdrawAccount, balance, block.getReverse()) }
    }

  private fun daoHfBalanceTransfer(from: Data20, to: Data20, balance: BigInteger, reverse: Boolean) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.DAO_HF_BALANCE_TRANSFER)
      .setValue(
        DaoHfBalanceTransferRecord.newBuilder()
          .setFrom(from)
          .setTo(to)
          .setAmount(balance.unsignedByteBuffer())
          .build()
      ).build()
}

open class Eip150HardForkConfig(private val parent: ChainConfig) : DaoHardForkConfig() {
  override val constants = parent.constants
  override fun eip161(): Boolean = parent.eip161()
  override fun eip198(): Boolean = parent.eip161()
  override fun eip212(): Boolean = parent.eip161()
  override fun eip213(): Boolean = parent.eip161()
}

open class Eip160HardForkConfig(parent: ChainConfig): Eip150HardForkConfig(parent) {
  override fun eip161() = true
  override fun chainId(): Int = ChainId.MainNet.number
}

open class RopstenConfig(parent: ChainConfig): Eip160HardForkConfig(parent) {
  override fun chainId(): Int = ChainId.Ropsten.number
}

open class ByzantiumConfig(parent: ChainConfig): Eip160HardForkConfig(parent) {

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

interface NetConfig {

  fun chainConfigForBlock(block: BlockRecord): ChainConfig

  companion object {

    val mainnet = BaseNetConfig(
      listOf(
        0L to FrontierConfig(),
        1_150_000L to HomesteadConfig(),
        1_920_000L to DaoHardForkConfig(),
        2_463_000L to Eip150HardForkConfig(DaoHardForkConfig()),
        2_675_000L to Eip160HardForkConfig(DaoHardForkConfig()),
        4_370_000L to ByzantiumConfig(DaoHardForkConfig()),
        7_080_000L to ConstantinopleConfig(DaoHardForkConfig())
      )
    )

    val ropsten = BaseNetConfig(
      listOf(
        0L to HomesteadConfig(),
        10L to RopstenConfig(HomesteadConfig()),
        1_700_000L to RopstenConfig(ByzantiumConfig(DaoHardForkConfig())),
        4_230_000L to RopstenConfig(ConstantinopleConfig(DaoHardForkConfig()))
      )
    )

    val testnet = BaseNetConfig(
      listOf(
        0L to FrontierConfig(),
        1_500_000L to HomesteadConfig()
      )
    )

    // TODO add support for other networks

  }
}

class BaseNetConfig(configs: List<Pair<Long, ChainConfig>>) : NetConfig {

  private val blockNumbers = configs.map { it.first.toBigInteger() }
  private val chainConfigs = configs.map { it.second }

  init {
    // TODO enforce that block numbers are increasing
  }

  override fun chainConfigForBlock(block: BlockRecord): ChainConfig {

    val blockNumber = block.getHeader().getNumber().unsignedBigInteger()!!

    var idx = 0
    while (blockNumber >= blockNumbers[idx]) {
      idx += 1
    }
    return chainConfigs[idx]
  }

}
