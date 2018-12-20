package io.enkrypt.util

import io.enkrypt.common.extensions.gwei
import io.enkrypt.processors.block.LoggingVMHook
import org.ethereum.config.CommonConfig
import org.ethereum.config.net.BaseNetConfig
import org.ethereum.core.BlockchainImpl
import org.ethereum.core.Genesis
import org.ethereum.core.PendingStateImpl
import org.ethereum.core.Transaction
import org.ethereum.core.TransactionExecutor
import org.ethereum.core.genesis.GenesisLoader
import org.ethereum.crypto.ECKey
import org.ethereum.datasource.NoDeleteSource
import org.ethereum.datasource.inmem.HashMapDB
import org.ethereum.db.IndexedBlockStore
import org.ethereum.db.RepositoryRoot
import org.ethereum.listener.EthereumListener
import org.ethereum.listener.EthereumListenerAdapter
import org.ethereum.util.ByteUtil
import org.ethereum.util.blockchain.StandaloneBlockchain
import org.ethereum.validator.DependentBlockHeaderRuleAdapter
import org.ethereum.vm.program.invoke.ProgramInvokeFactoryImpl

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

    fun createContractFocused(
      genesis: Genesis,
      listener: EthereumListener = EthereumListenerAdapter()
    ): BlockchainImpl {
      val blockStore = IndexedBlockStore().apply {
        init(HashMapDB(), HashMapDB())
      }

      val repository = RepositoryRoot(NoDeleteSource(HashMapDB()))

      val programInvokeFactory = ProgramInvokeFactoryImpl()

      val bc =
        BlockchainImpl(blockStore, repository).withParentBlockHeaderValidator(CommonConfig().parentHeaderValidator())
      bc.setParentHeaderValidator(DependentBlockHeaderRuleAdapter())
      bc.programInvokeFactory = programInvokeFactory
      bc.byTest = true

      val pendingState = PendingStateImpl(listener).apply { setBlockchain(bc) }
      bc.pendingState = pendingState

      val track = repository.startTracking()
      org.ethereum.core.Genesis.populateRepository(track, genesis)

      track.commit()
      repository.commit()

      blockStore.saveBlock(genesis, genesis.difficultyBI, true)

      bc.bestBlock = genesis
      bc.totalDifficulty = genesis.difficultyBI

      return bc
    }

  }

  object Utils {

    fun createTx(
      b: BlockchainImpl,
      sender: ECKey,
      receiveAddress: ByteArray,
      data: ByteArray,
      value: Long = 0
    ): Transaction {
      val nonce = b.repository.getNonce(sender.address)
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

    fun executeTransaction(b: BlockchainImpl, tx: Transaction): TransactionExecutor {
      val track = b.repository.startTracking()
      val executor = TransactionExecutor(
        tx,
        ByteArray(32),
        b.repository,
        b.blockStore,
        b.programInvokeFactory,
        b.bestBlock
      )

      executor.init()
      executor.execute()
      executor.go()
      executor.finalization()

      track.commit()
      return executor
    }

  }
}
