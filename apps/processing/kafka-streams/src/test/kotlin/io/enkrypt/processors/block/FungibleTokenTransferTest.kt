package io.enkrypt.processors.block

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.amountBI
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.util.TestEthereumListener
import io.enkrypt.util.createBlockRecord
import io.kotlintest.matchers.collections.shouldContainExactly
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.ethereum.config.net.BaseNetConfig
import org.ethereum.core.AccountState
import org.ethereum.core.genesis.GenesisLoader
import org.ethereum.crypto.ECKey
import org.ethereum.util.ByteUtil.wrap
import org.ethereum.util.blockchain.StandaloneBlockchain
import java.math.BigInteger

class FungibleTokenTransferTest : BehaviorSpec() {

  val coinbase = ECKey()

  val bob = ECKey()
  val alice = ECKey()
  val terence = ECKey()

  val netConfig = BaseNetConfig().apply {
    add(0, StandaloneBlockchain.getEasyMiningConfig())
  }

  val listener = TestEthereumListener()

  val genesisBlock = GenesisLoader.loadGenesis(javaClass.getResourceAsStream("/genesis/genesis-light-sb.json")).apply {

    // initial balances
    addPremine(wrap(bob.address), AccountState(BigInteger.ZERO, 20.ether()))
    addPremine(wrap(alice.address), AccountState(BigInteger.ZERO, 50.ether()))
    addPremine(wrap(terence.address), AccountState(BigInteger.ZERO, 100.ether()))

    stateRoot = GenesisLoader.generateRootHash(premine)
  }

  val bc = StandaloneBlockchain().apply {
    withGenesis(genesisBlock)
    withNetConfig(netConfig)
    withMinerCoinbase(coinbase.address)
    withGasLimit(21000)
    withGasPrice(1.gwei().toLong())
    addEthereumListener(listener)
  }

  init {

    given("a block with a series of valid ether transfers") {

      bc.sender = bob
      bc.sendEther(alice.address, 50.gwei())

      bc.sender = alice
      bc.sendEther(terence.address, 25.gwei())

      bc.sender = terence
      bc.sendEther(bob.address, 125.gwei())

      val blockRecord = bc.createBlockRecord(listener)

      `when`("we convert the block") {

        val chainEvents = ChainEvents.forBlock(blockRecord)

        then("there should be 4 chain events") {
          chainEvents.size shouldBe 4
        }

        then("there should be a fungible ether transfer for the coinbase") {
          val coinbaseTransfer = chainEvents.first().fungibleTransfer
          coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
          coinbaseTransfer.getTo() shouldBe coinbase.address.data20()
          coinbaseTransfer.amountBI shouldBe 3000063000000000000.toBigInteger()
          coinbaseTransfer.getReverse() shouldBe false
        }

        then("there should be 3 fungible ether transfers between bob, alice and terence") {

          val bobToAlice = chainEvents[1].fungibleTransfer
          bobToAlice.getFrom() shouldBe bob.address.data20()
          bobToAlice.getTo() shouldBe alice.address.data20()
          bobToAlice.amountBI shouldBe 50.gwei()
          bobToAlice.getReverse() shouldBe false

          val aliceToTerence = chainEvents[2].fungibleTransfer
          aliceToTerence.getFrom() shouldBe alice.address.data20()
          aliceToTerence.getTo() shouldBe terence.address.data20()
          aliceToTerence.amountBI shouldBe 25.gwei()
          aliceToTerence.getReverse() shouldBe false

          val terenceToBob = chainEvents[3].fungibleTransfer
          terenceToBob.getFrom() shouldBe terence.address.data20()
          terenceToBob.getTo() shouldBe bob.address.data20()
          terenceToBob.amountBI shouldBe 125.gwei()
          terenceToBob.getReverse() shouldBe false
        }

      }

      `when`("we reverse the block") {

        val chainEvents = ChainEvents.forBlock(blockRecord)

        val reverseBlockRecord = BlockRecord.newBuilder(blockRecord)
          .setReverse(true)
          .build()

        val reversedChainEvents = ChainEvents.forBlock(reverseBlockRecord)

        then("there should be 4 chain events") {
          reversedChainEvents.size shouldBe 4
        }

        then("the chain events should be in reverse order") {
          chainEvents.map{ it.reverse() }.asReversed() shouldContainExactly reversedChainEvents
        }

        then("there should be a reversed fungible ether transfer for the coinbase") {
          val coinbaseTransfer = reversedChainEvents.last().fungibleTransfer
          coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
          coinbaseTransfer.getTo() shouldBe coinbase.address.data20()
          coinbaseTransfer.amountBI shouldBe 3000063000000000000.toBigInteger()
          coinbaseTransfer.getReverse() shouldBe true
        }

        then("there should be a reversed fungible ether transfer for each originating transfer") {

          val bobToAlice = reversedChainEvents[2].fungibleTransfer
          bobToAlice.getFrom() shouldBe bob.address.data20()
          bobToAlice.getTo() shouldBe alice.address.data20()
          bobToAlice.amountBI shouldBe 50.gwei()
          bobToAlice.getReverse() shouldBe true

          val aliceToTerence = reversedChainEvents[1].fungibleTransfer
          aliceToTerence.getFrom() shouldBe alice.address.data20()
          aliceToTerence.getTo() shouldBe terence.address.data20()
          aliceToTerence.amountBI shouldBe 25.gwei()
          aliceToTerence.getReverse() shouldBe true

          val terenceToBob = reversedChainEvents[0].fungibleTransfer
          terenceToBob.getFrom() shouldBe terence.address.data20()
          terenceToBob.getTo() shouldBe bob.address.data20()
          terenceToBob.amountBI shouldBe 125.gwei()
          terenceToBob.getReverse() shouldBe true

        }
      }

    }

    given("a block with some invalid ether transfers") {

      bc.sender = bob     // invalid, insufficient ether in account
      bc.sendEther(alice.address, 100.ether())

      bc.sender = alice
      bc.sendEther(terence.address, 56.gwei())

      bc.sender = terence // invalid, insufficient ether in account
      bc.sendEther(bob.address, 200.ether())

      val blockRecord = bc.createBlockRecord(listener)

      `when`("we convert the block") {

        val chainEvents = ChainEvents.forBlock(blockRecord)

        then("there should be 2 chain events") {
          chainEvents.size shouldBe 2
        }

        then("there should be a fungible ether transfer for the coinbase") {
          val coinbaseTransfer = chainEvents.first().fungibleTransfer
          coinbaseTransfer.getFrom() shouldBe StaticAddresses.EtherZero
          coinbaseTransfer.getTo() shouldBe coinbase.address.data20()
          coinbaseTransfer.amountBI shouldBe 3000021000000000000.toBigInteger()
        }

        then("there should be a single transfer from alice to terence") {
          val aliceToTerence = chainEvents[1].fungibleTransfer
          aliceToTerence.getFrom() shouldBe alice.address.data20()
          aliceToTerence.getTo() shouldBe terence.address.data20()
          aliceToTerence.amountBI shouldBe 56.gwei()
        }

      }

    }

  }

}
