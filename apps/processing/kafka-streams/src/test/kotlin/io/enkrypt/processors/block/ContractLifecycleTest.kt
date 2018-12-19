package io.enkrypt.processors.block

import io.enkrypt.common.extensions.*
import io.enkrypt.kafka.streams.models.ChainEvent
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.util.TestEthereumListener
import io.enkrypt.util.createBlockRecord
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import mu.KotlinLogging
import org.ethereum.config.net.BaseNetConfig
import org.ethereum.core.*
import org.ethereum.core.genesis.GenesisLoader
import org.ethereum.crypto.ECKey
import org.ethereum.util.ByteUtil.wrap
import org.ethereum.util.blockchain.StandaloneBlockchain
import org.ethereum.vm.OpCode
import org.ethereum.vm.hook.VMHook
import org.ethereum.vm.program.Program
import java.math.BigInteger

class LoggingVMHook : VMHook {

  val logger = KotlinLogging.logger {}

  override fun step(program: Program, opcode: OpCode) {
    logger.info{ "Step: origin = ${program.originAddress.shortHex()} owner = ${program.ownerAddress.shortHex()}, opcode = ${opcode}"}
  }
}

class ContractLifecycleTest : BehaviorSpec() {

  val logger = KotlinLogging.logger {}

  val coinbase = ECKey()

  val bob = ECKey()
  val alice = ECKey()
  val terence = ECKey()

  val erc20Source = ContractLifecycleTest::class.java.getResource("/solidity/erc20.sol").readText()

  val netConfig = BaseNetConfig().apply {
    add(0, StandaloneBlockchain.getEasyMiningConfig())
  }

  val listener = TestEthereumListener()

  val genesisBlock = GenesisLoader.loadGenesis(javaClass.getResourceAsStream("/genesis/genesis-light-sb.json")).apply {

    // initial balances
    addPremine(wrap(bob.address), AccountState(BigInteger.ZERO, 20.ether()))

    stateRoot = GenesisLoader.generateRootHash(premine)
  }

  val bc = StandaloneBlockchain().apply {
    withGenesis(genesisBlock)
    withNetConfig(netConfig)
    withMinerCoinbase(coinbase.address)
    withGasLimit(21000)
    withGasPrice(1.gwei().toLong())
    withVmHook(LoggingVMHook())
    addEthereumListener(listener)
  }

  init {

    given("a block with a contract creation") {

      bc.sender = bob

      val contract = bc
        .withGasLimit(500000)
        .submitNewContract(erc20Source, "ERC20")

      val blockRecord = bc.createBlockRecord(listener)

      `when`("we convert the block") {

        val chainEvents = ChainEvents.forBlock(blockRecord)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a fungible ether transfer for the coinbase") {
          checkCoinbase(chainEvents.first(), 3000292592000000000.toBigInteger())
        }

        then("there should be a contract creation event") {
          val creation = chainEvents[1].contractCreation
          creation.getAddress() shouldBe contract.address.data20()
          creation.getData().hex() shouldBe contract.binary
          creation.getCreator() shouldBe bob.address.data20()
          creation.getBlockHash() shouldBe blockRecord.getHeader().getHash()
          creation.getTxHash() shouldBe blockRecord.getTransactions().first().getHash()
        }

      }

    }

    given("a live contract which holds some ether") {

      bc.sender = bob

      val contract = bc
        .withGasLimit(500000)
        .submitNewContract(erc20Source, "ERC20")

      bc.createBlockRecord(listener)

      `when`("the contract self destructs") {

        val seppuku = contract.callFunction("seppuku")

        logger.info{ "Executing seppuku"}

        val blockRecord = bc.createBlockRecord(listener)
        val chainEvents = ChainEvents.forBlock(blockRecord)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a fungible ether transfer for the coinbase") {
          checkCoinbase(chainEvents.first(), 3000021272000000000.toBigInteger())
        }

        then("there should be several fungible transfer events") {


        }

      }

    }
  }

  private fun checkCoinbase(event: ChainEvent, reward: BigInteger) {
    val coinbaseTransfer = event.fungibleTransfer
    coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
    coinbaseTransfer.getTo() shouldBe coinbase.address.data20()
    coinbaseTransfer.amountBI shouldBe reward
  }

}
