package io.enkrypt.util

import arrow.core.Tuple3
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.Data20
import io.enkrypt.kafka.mapping.ObjectMapper
import io.enkrypt.kafka.streams.models.StaticAddresses
import org.ethereum.config.BlockchainNetConfig
import org.ethereum.config.SystemProperties
import org.ethereum.config.blockchain.ByzantiumConfig
import org.ethereum.config.blockchain.DaoNoHFConfig
import org.ethereum.config.blockchain.HomesteadConfig
import org.ethereum.config.net.BaseNetConfig
import org.ethereum.core.*
import org.ethereum.core.genesis.GenesisLoader
import org.ethereum.crypto.ECKey
import org.ethereum.datasource.JournalSource
import org.ethereum.datasource.inmem.HashMapDB
import org.ethereum.db.IndexedBlockStore
import org.ethereum.db.PruneManager
import org.ethereum.db.RepositoryRoot
import org.ethereum.mine.Ethash
import org.ethereum.sync.SyncManager
import org.ethereum.util.ByteUtil
import org.ethereum.util.ByteUtil.*
import org.ethereum.validator.DependentBlockHeaderRuleAdapter
import org.ethereum.vm.program.invoke.ProgramInvokeFactoryImpl
import java.math.BigInteger
import java.util.*
import java.util.concurrent.TimeUnit

typealias TransactionResult = Tuple3<Transaction, TransactionReceipt, TransactionExecutionSummary>
typealias BlockResult = Pair<BlockRecord, List<TransactionResult>>

class StandaloneBlockchain(config: Config) {

  companion object {
      val easyNetConfig = BaseNetConfig().apply {
        add(0, ByzantiumConfig(
          DaoNoHFConfig(HomesteadConfig(object : HomesteadConfig.HomesteadConstants() {
            override fun getMINIMUM_DIFFICULTY(): BigInteger = BigInteger.ONE
          }), 0))
        )
      }
  }

  data class Config(val chainId: Int = 1,
                    val blockGasIncreasePercent: Int = 0,
                    val gasPrice: Long = 50_000_000_000L,
                    val gasLimit: Long = 5_000_000L,
                    val coinbase: Data20 = StaticAddresses.EtherMax,
                    val autoblock: Boolean = false,
                    val timeIncrement: Long = 60,
                    val netConfig: BlockchainNetConfig = easyNetConfig,
                    val genesis: Genesis? = null,
                    val premineBalances: Map<Data20?, BigInteger> = emptyMap(),
                    val time: Date? = null)

  var listener = TestEthereumListener()
  val chainId = config.chainId

  val genesis = (
    config.genesis
      ?: GenesisLoader.loadGenesis(javaClass.getResourceAsStream("/genesis/genesis-light-sb.json"))).apply {

    config.premineBalances.forEach { (address, balance) ->
      val state = AccountState(BigInteger.ZERO, balance)
      addPremine(wrap(address!!.bytes()), state)
    }

    stateRoot = GenesisLoader.generateRootHash(premine)
  }

  val gasPrice = config.gasPrice
  val gasLimit = config.gasLimit
  val blockGasIncreasePercent = config.blockGasIncreasePercent

  val coinbase = config.coinbase

  val timeIncrement = config.timeIncrement

  val netConfig = config.netConfig
  val blockchain = createBlockchain()
  val objectMapper = ObjectMapper()

  var time = (config.time ?: Date()).time / 1000
  var repoSnapshot = blockchain.repository.getSnapshotTo(genesis.stateRoot)

  private var pendingTxs = listOf<Transaction>()
  private var noncesMap = emptyMap<ECKey, Long>()

  private fun createBlockchain(): BlockchainImpl {

    SystemProperties.getDefault().blockchainConfig = netConfig

    val blockStore = IndexedBlockStore()
    blockStore.init(HashMapDB(), HashMapDB())

    val stateDS = HashMapDB<ByteArray>()
    val pruningStateDS = JournalSource<ByteArray>(stateDS)
    val pruneManager = PruneManager(blockStore, pruningStateDS,
      stateDS, SystemProperties.getDefault().databasePruneDepth())

    val repository = RepositoryRoot(pruningStateDS)
    val programInvokeFactory = ProgramInvokeFactoryImpl()

    val bc = BlockchainImpl(blockStore, repository)
      .withEthereumListener(listener)
      .withSyncManager(SyncManager())

    bc.setParentHeaderValidator(DependentBlockHeaderRuleAdapter())
    bc.programInvokeFactory = programInvokeFactory
    bc.setPruneManager(pruneManager)

    bc.byTest = true

    val pendingState = PendingStateImpl(listener)

    pendingState.setBlockchain(bc)
    bc.pendingState = pendingState

    Genesis.populateRepository(repository, genesis)

    repository.commit()

    blockStore.saveBlock(genesis, genesis.difficultyBI, true)

    bc.bestBlock = genesis
    bc.totalDifficulty = genesis.difficultyBI

    pruneManager.blockCommitted(genesis.header)

    bc.minerCoinbase = coinbase.bytes()

    return bc
  }

  fun addTx(tx: Transaction, createBlock: Boolean = false) {
    pendingTxs += tx
    if (createBlock) {
      createBlock()
    }
  }

  fun createBlock(): BlockRecord {
    return createForkBlock(blockchain.bestBlock)
  }

  fun createForkBlock(parent: Block): BlockRecord {

    time += timeIncrement

    val block = blockchain.createNewBlock(parent, pendingTxs, emptyList(), time)

    val gasLimitBoundDivisor = SystemProperties.getDefault().blockchainConfig.commonConstants.gaS_LIMIT_BOUND_DIVISOR

    val newGas = ByteUtil.bytesToBigInteger(parent.gasLimit)
      .multiply(BigInteger.valueOf((gasLimitBoundDivisor * 100 + blockGasIncreasePercent).toLong()))
      .divide(BigInteger.valueOf((gasLimitBoundDivisor * 100).toLong()))

    block.header.gasLimit = ByteUtil.bigIntegerToBytes(newGas)

    listener.resetBlockSummaries(1)

    Ethash.getForBlock(SystemProperties.getDefault(), block.number).mineLight(block).get(10, TimeUnit.SECONDS)
    val importResult = blockchain.tryToConnect(block)

    if (importResult != ImportResult.IMPORTED_BEST && importResult != ImportResult.IMPORTED_NOT_BEST) {
      throw RuntimeException("Invalid block import result $importResult for block $block")
    }

    val (blockSummary) = listener.waitForBlockSummaries(10, TimeUnit.SECONDS)
    pendingTxs = emptyList()

    // update repo snapshot
    repoSnapshot = blockchain.repository.getSnapshotTo(block.stateRoot)

    return objectMapper.convert(objectMapper, BlockSummary::class.java, BlockRecord.Builder::class.java, blockSummary).build()
  }

  private fun currentNonce(key: ECKey): Long {
    return noncesMap.getOrElse(key) { repoSnapshot.getNonce(key.address).toLong() }
  }

  private fun updateNonce(key: ECKey, nonce: Long) {
    noncesMap += key to nonce
  }

  fun sendEther(from: ECKey, to: ECKey, value: BigInteger, autoBlock: Boolean = false): BlockRecord? {
    val nonce = currentNonce(from)
    val tx = Transaction(
      longToBytesNoLeadZeroes(nonce),
      longToBytesNoLeadZeroes(gasPrice),
      longToBytesNoLeadZeroes(gasLimit),
      to.address,
      bigIntegerToBytes(value),
      ByteArray(0),
      null
    )
    tx.sign(from)
    addTx(tx)

    updateNonce(from, nonce + 1)

    return when(autoBlock) {
      true -> createBlock()
      false -> null
    }
  }


}
