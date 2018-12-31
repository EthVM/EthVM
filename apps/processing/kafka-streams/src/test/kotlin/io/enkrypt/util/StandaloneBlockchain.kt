package io.enkrypt.util

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.Data20
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.unsignedBytes
import io.enkrypt.kafka.mapping.ObjectMapper
import io.mockk.every
import io.mockk.mockkStatic
import org.ethereum.config.BlockchainNetConfig
import org.ethereum.config.CommonConfig
import org.ethereum.config.SystemProperties
import org.ethereum.config.blockchain.ByzantiumConfig
import org.ethereum.config.blockchain.ConstantinopleConfig
import org.ethereum.config.blockchain.DaoNoHFConfig
import org.ethereum.config.blockchain.FrontierConfig
import org.ethereum.config.blockchain.HomesteadConfig
import org.ethereum.config.net.BaseNetConfig
import org.ethereum.core.AccountState
import org.ethereum.core.Block
import org.ethereum.core.BlockSummary
import org.ethereum.core.BlockchainImpl
import org.ethereum.core.Genesis
import org.ethereum.core.ImportResult
import org.ethereum.core.PendingStateImpl
import org.ethereum.core.Transaction
import org.ethereum.core.genesis.GenesisLoader
import org.ethereum.crypto.ECKey
import org.ethereum.datasource.NoDeleteSource
import org.ethereum.datasource.Source
import org.ethereum.datasource.inmem.HashMapDB
import org.ethereum.db.IndexedBlockStore
import org.ethereum.db.RepositoryRoot
import org.ethereum.mine.Ethash
import org.ethereum.sync.SyncManager
import org.ethereum.util.ByteUtil
import org.ethereum.util.ByteUtil.longToBytesNoLeadZeroes
import org.ethereum.util.ByteUtil.wrap
import org.ethereum.validator.DependentBlockHeaderRuleAdapter
import org.ethereum.vm.program.ProgramPrecompile
import org.ethereum.vm.program.invoke.ProgramInvokeFactoryImpl
import java.math.BigInteger
import java.util.Date
import java.util.concurrent.TimeUnit

class StandaloneBlockchain(config: Config) {

  private val genesis: Genesis = (
    config.genesis
      ?: GenesisLoader.loadGenesis(javaClass.getResourceAsStream("/genesis/genesis-light-sb.json"))).apply {

    config.premineBalances.forEach { (address, balance) ->
      val state = AccountState(BigInteger.ZERO, balance)
      addPremine(wrap(address!!.bytes()), state)
    }

    stateRoot = GenesisLoader.generateRootHash(premine)
  }

  private val gasPrice by lazy { config.gasPrice }
  private val gasLimit by lazy { config.gasLimit }
  private val blockGasIncreasePercent by lazy { config.blockGasIncreasePercent }

  private val coinbase by lazy { config.coinbase }
  private val timeIncrement = config.timeIncrement
  private val netConfig by lazy { config.netConfig }

  private val objectMapper = ObjectMapper()

  private var time = (config.time ?: Date()).time / 1000
  private var listener = TestEthereumListener()

  private var pendingTxs = listOf<Transaction>()
  private var noncesMap = emptyMap<ECKey, Long>()

  private lateinit var genesisBlock: BlockRecord

  private val commonConfig = object : CommonConfig() {
    override fun systemProperties() =
      SystemProperties.getDefault().apply { blockchainConfig = StandaloneBlockchain.Byzantium }

    override fun precompileSource(): Source<ByteArray, ProgramPrecompile>? = null
  }

  val blockchain = createBlockchain()

  private fun createBlockchain(): BlockchainImpl {
    SystemProperties.setUseOnlySpringConfig(false)

    mockkStatic(CommonConfig::class)
    every { CommonConfig.getDefault() } returns commonConfig

    SystemProperties.getDefault().blockchainConfig = netConfig

    val blockStore = IndexedBlockStore().apply {
      init(HashMapDB(), HashMapDB())
    }

    val source = NoDeleteSource<ByteArray, ByteArray>(HashMapDB())
    val repository = RepositoryRoot(source)

    val bc = BlockchainImpl(blockStore, repository)
      .withEthereumListener(listener)
      .withSyncManager(SyncManager())

    bc.setParentHeaderValidator(DependentBlockHeaderRuleAdapter())
    bc.programInvokeFactory = ProgramInvokeFactoryImpl()
    bc.byTest = true

    val pendingState = PendingStateImpl(listener)
    bc.pendingState = pendingState

    pendingState.setBlockchain(bc)

    val track = repository.startTracking()
    Genesis.populateRepository(repository, genesis)

    track.commit()
    repository.commit()

    blockStore.saveBlock(genesis, genesis.difficultyBI, true)

    bc.bestBlock = genesis
    bc.totalDifficulty = genesis.difficultyBI
    bc.minerCoinbase = coinbase.bytes()

    return bc
  }

  fun createBlock(): BlockRecord = createForkBlock(blockchain.bestBlock)

  fun createForkBlock(number: Long): BlockRecord =
    createForkBlock(blockchain.getBlockByNumber(number))

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

    return objectMapper
      .convert(objectMapper, BlockSummary::class.java, BlockRecord.Builder::class.java, blockSummary)
      .build()
  }

  private fun currentNonce(key: ECKey): Long =
    noncesMap.getOrElse(key) { blockchain.repositorySnapshot.getNonce(key.address).toLong() }

  private fun updateNonce(key: ECKey, nonce: Long) {
    noncesMap += key to nonce
  }

  fun sendEther(from: ECKey, to: ECKey, value: BigInteger): Transaction =
    submitTx(
      from,
      receiver = to.address.data20(),
      value = value.unsignedBytes() ?: ByteArray(0)
    )

  fun submitContract(
    sender: ECKey,
    contract: SolidityContract,
    gasPrice: Long? = null,
    gasLimit: Long? = null,
    value: BigInteger? = null,
    vararg constructorArgs: Any
  ): Transaction =
    submitTx(
      sender,
      gasPrice,
      gasLimit,
      data = contract.construct(*constructorArgs),
      value = value?.unsignedBytes() ?: ByteArray(0)
    )

  fun callFunction(
    sender: ECKey,
    contractAddress: Data20,
    contract: SolidityContract,
    name: String,
    gasPrice: Long? = null,
    gasLimit: Long? = null,
    value: BigInteger? = null,
    vararg args: Any
  ) =
    submitTx(
      sender,
      gasPrice,
      gasLimit,
      receiver = contractAddress,
      data = contract.callFunction(name, *args),
      value = value?.unsignedBytes() ?: ByteArray(0)
    )

  fun submitTx(
    sender: ECKey,
    gasPrice: Long? = null,
    gasLimit: Long? = null,
    receiver: Data20? = null,
    value: ByteArray = ByteArray(0),
    data: ByteArray = ByteArray(0)
  ): Transaction {

    val nonce = currentNonce(sender)

    val tx = Transaction(
      longToBytesNoLeadZeroes(nonce),
      longToBytesNoLeadZeroes(gasPrice ?: this.gasPrice),
      longToBytesNoLeadZeroes(gasLimit ?: this.gasLimit),
      receiver?.bytes(),
      value,
      data,
      null
    )

    tx.sign(sender)
    updateNonce(sender, nonce + 1)

    pendingTxs += tx
    return tx
  }

  companion object {
    private val constants = object : HomesteadConfig.HomesteadConstants() {
      override fun getMINIMUM_DIFFICULTY() = BigInteger.ONE
    }

    val Frontier: BaseNetConfig = BaseNetConfig().apply {
      add(0, FrontierConfig(constants))
    }

    val Homestead: BaseNetConfig = BaseNetConfig().apply {
      add(0, DaoNoHFConfig(HomesteadConfig(constants), 0))
    }

    val Byzantium: BaseNetConfig = BaseNetConfig().apply {
      add(0, ByzantiumConfig(DaoNoHFConfig(HomesteadConfig(constants), 0)))
    }

    val Constantinople: BaseNetConfig = BaseNetConfig().apply {
      add(0, ConstantinopleConfig(ByzantiumConfig(DaoNoHFConfig(HomesteadConfig(constants), 0))))
    }

    val Coinbase = ECKey()
    val Bob = ECKey()
    val Alice = ECKey()
    val Terence = ECKey()
  }

  data class Config(
    val chainId: Int = 1,
    val blockGasIncreasePercent: Int = 0,
    val gasPrice: Long = 50_000_000_000L,
    val gasLimit: Long = 5_000_000L,
    val coinbase: Data20 = Coinbase.address.data20()!!,
    val autoBlock: Boolean = false,
    val timeIncrement: Long = 60,
    val netConfig: BlockchainNetConfig = Byzantium,
    val genesis: Genesis? = null,
    val premineBalances: Map<Data20?, BigInteger> = emptyMap(),
    val time: Date? = null
  )
}
