package io.enkrypt.processors.block

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.*
import io.enkrypt.kafka.mapping.ObjectMapper
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.util.TestEthereumListener
import io.kotlintest.matchers.collections.shouldContainExactly
import io.kotlintest.shouldBe
import io.kotlintest.specs.BehaviorSpec
import org.ethereum.config.net.BaseNetConfig
import org.ethereum.core.*
import org.ethereum.crypto.ECKey
import org.ethereum.listener.EthereumListener
import org.ethereum.net.eth.message.StatusMessage
import org.ethereum.net.message.Message
import org.ethereum.net.p2p.HelloMessage
import org.ethereum.net.rlpx.Node
import org.ethereum.net.server.Channel
import org.ethereum.util.blockchain.StandaloneBlockchain
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class ChainEventsTest : BehaviorSpec() {

  val coinbase = ECKey()

  val bob = ECKey()
  val alice = ECKey()
  val terence = ECKey()

  // for converting ethj objects into avro records
  val objectMapper = ObjectMapper()

  val netConfig = BaseNetConfig().apply {
    add(0, StandaloneBlockchain.getEasyMiningConfig())
  }

  val listener = TestEthereumListener()

  val bc = StandaloneBlockchain().apply {
    withNetConfig(netConfig)
    withMinerCoinbase(coinbase.address)
    withGasLimit(21000)
    withGasPrice(1.gwei().toLong())
    withAccountBalance(bob.address, 20.ether())
    withAccountBalance(alice.address, 50.ether())
    withAccountBalance(terence.address, 100.ether())
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

      val blockRecord = createBlockRecord(bc, listener)

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

  }

  private fun createBlockRecord(bc: StandaloneBlockchain, listener: TestEthereumListener): BlockRecord {

    // reset listener and generate block
    listener.resetBlockSummaries(1)
    bc.createBlock()

    // capture block summary and convert to block record
    listener.waitForBlockSummaries(30, TimeUnit.SECONDS)
    val blockSummary = listener.blockSummaries.first()

    return objectMapper.convert(objectMapper, BlockSummary::class.java, BlockRecord.Builder::class.java, blockSummary).build()
  }

}
