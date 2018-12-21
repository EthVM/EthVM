package io.enkrypt.util

import io.enkrypt.common.extensions.gwei
import mu.KotlinLogging
import org.ethereum.config.net.BaseNetConfig
import org.ethereum.core.Genesis
import org.ethereum.core.Repository
import org.ethereum.core.Transaction
import org.ethereum.core.genesis.GenesisLoader
import org.ethereum.crypto.ECKey
import org.ethereum.listener.EthereumListener
import org.ethereum.util.ByteUtil
import org.ethereum.util.blockchain.StandaloneBlockchain
import org.ethereum.vm.OpCode
import org.ethereum.vm.hook.VMHook
import org.ethereum.vm.program.Program

object Blockchains {

  val Coinbase = ECKey()
  val Genesis = GenesisLoader.loadGenesis(javaClass.getResourceAsStream("/genesis/genesis-light-sb.json"))

  object Users {

    val Bob = ECKey()
    val Alice = ECKey()
    val Terence = ECKey()
  }

  object Factory {

    fun createStandalone(
      genesisBlock: Genesis,
      listener: EthereumListener
    ): StandaloneBlockchain {
      return StandaloneBlockchain().apply {
        withGenesis(genesisBlock)
        withNetConfig(BaseNetConfig().apply {
          add(0, StandaloneBlockchain.getEasyMiningConfig())
        })
        withMinerCoinbase(Coinbase.address)
        withGasLimit(21000)
        withGasPrice(1.gwei().toLong())
        withVmHook(LoggingVMHook())
        addEthereumListener(listener)
      }
    }
  }

  object Utils {

    fun createTx(
      r: Repository,
      sender: ECKey,
      receiveAddress: ByteArray,
      data: ByteArray,
      value: Long = 0
    ): Transaction {
      val nonce = r.getNonce(sender.address)
      val tx = Transaction(
        ByteUtil.bigIntegerToBytes(nonce),
        ByteUtil.longToBytesNoLeadZeroes(0),
        ByteUtil.longToBytesNoLeadZeroes(3000000),
        receiveAddress,
        ByteUtil.longToBytesNoLeadZeroes(value),
        data
      )
      tx.sign(sender)
      return tx
    }
  }

  class LoggingVMHook : VMHook {

    private val logger = KotlinLogging.logger {}

    override fun step(program: Program, opcode: OpCode) {
      logger.info { "Step: origin = ${program.originAddress.shortHex()} owner = ${program.ownerAddress.shortHex()}, opcode = $opcode" }
    }
  }
}
