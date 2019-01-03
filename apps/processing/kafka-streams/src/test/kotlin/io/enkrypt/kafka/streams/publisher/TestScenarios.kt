package io.enkrypt.kafka.streams.publisher

import io.enkrypt.avro.common.Data20
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.gwei
import io.enkrypt.common.extensions.keyRecord
import io.enkrypt.common.extensions.mwei
import io.enkrypt.kafka.streams.util.SolidityContract
import io.enkrypt.kafka.streams.util.StandaloneBlockchain
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Alice
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Bob
import io.enkrypt.kafka.streams.util.StandaloneBlockchain.Companion.Terence
import io.enkrypt.kafka.streams.util.TestContracts
import org.ethereum.crypto.ECKey
import java.math.BigInteger

enum class TestEventType {
  ETHER_TRANSFER,
  CONTRACT_CREATE,
  ERC20_TRANSFER,
  ERC721_MINT,
  ERC721_SAFE_TRANSFER
}

abstract class TestEvent(val type: TestEventType)

data class EtherTransfer(
  val from: ECKey,
  val to: ECKey,
  val amount: BigInteger
) : TestEvent(TestEventType.ETHER_TRANSFER)

data class CreateContract(
  val sender: ECKey,
  val contract: SolidityContract,
  val gasPrice: Long? = null,
  val gasLimit: Long? = null,
  val value: BigInteger? = null
) : TestEvent(TestEventType.CONTRACT_CREATE)

data class ERC20Transfer(
  val sender: ECKey,
  val contractAddress: Data20,
  val contract: SolidityContract,
  val gasPrice: Long? = null,
  val gasLimit: Long? = null,
  val to: ECKey,
  val amount: BigInteger
) : TestEvent(TestEventType.ERC20_TRANSFER)

data class ERC721Mint(
  val sender: ECKey,
  val contractAddress: Data20,
  val contract: SolidityContract,
  val gasPrice: Long? = null,
  val gasLimit: Long? = null,
  val to: ECKey,
  val amount: BigInteger
) : TestEvent(TestEventType.ERC721_MINT)

data class ERC721SafeTransfer(
  val sender: ECKey,
  val contractAddress: Data20,
  val contract: SolidityContract,
  val gasPrice: Long? = null,
  val gasLimit: Long? = null,
  val from: ECKey,
  val to: ECKey,
  val tokenId: BigInteger
) : TestEvent(TestEventType.ERC721_SAFE_TRANSFER)

abstract class TestScenario {

  abstract val premineBalances: Map<Data20?, BigInteger>

  abstract val blockEvents: List<List<TestEvent>>

  fun run(publisher: BlockPublisher, blockchain: StandaloneBlockchain) {

    blockEvents.forEach {

      // generate events

      it.forEach { event ->
        when (event.type) {
          TestEventType.ETHER_TRANSFER -> {
            val transfer = event as EtherTransfer
            blockchain.sendEther(transfer.from, transfer.to, transfer.amount)
          }
          TestEventType.CONTRACT_CREATE -> {
            val create = event as CreateContract
            blockchain.submitContract(
              create.sender,
              create.contract,
              create.gasPrice,
              create.gasLimit,
              create.value
            )
          }
          TestEventType.ERC20_TRANSFER -> {
            val transfer = event as ERC20Transfer
            blockchain.callFunction(
              transfer.sender,
              transfer.contractAddress,
              transfer.contract,
              "transfer",
              transfer.gasPrice,
              transfer.gasLimit,
              null,
              transfer.to.address,
              transfer.amount
            )
          }
          TestEventType.ERC721_MINT -> {
            val mint = event as ERC721Mint
            blockchain.callFunction(
              mint.sender,
              mint.contractAddress,
              mint.contract,
              "mint",
              mint.gasPrice,
              mint.gasLimit,
              null,
              mint.to.address,
              mint.amount
            )
          }
          TestEventType.ERC721_SAFE_TRANSFER -> {
            val transfer = event as ERC721SafeTransfer
            blockchain.callFunction(
              transfer.sender,
              transfer.contractAddress,
              transfer.contract,
              "safeTransferFrom",
              transfer.gasPrice,
              transfer.gasLimit,
              null,
              transfer.from.address,
              transfer.to.address,
              transfer.tokenId
            )
          }
        }
      }

      // create block and publish
      val block = blockchain.createBlock()
      publisher.publish(block.keyRecord(), block, true)
    }
  }
}

object TestScenarioOne : TestScenario() {

  private val erc20Contract = TestContracts.ERC20.contractFor("TestERC20Token")
  private val erc721Contract = TestContracts.ERC721.contractFor("TestERC721Token")

  override val premineBalances = mapOf(
    Bob.address.data20() to 1000.ether(),
    Alice.address.data20() to 1000.ether(),
    Terence.address.data20() to 1000.ether()
  )

  override val blockEvents = listOf(
    listOf(
      EtherTransfer(Bob, Alice, 1.ether()),
      EtherTransfer(Alice, Terence, 125.gwei()),
      EtherTransfer(Terence, Bob, 375.mwei())
    ),
    listOf(
      CreateContract(Bob, erc20Contract, gasLimit = 1.gwei().toLong()),
      CreateContract(Alice, erc721Contract, gasLimit = 1.gwei().toLong())
    ),
    listOf(
      ERC20Transfer(Bob, SolidityContract.contractAddress(Bob, 1L).data20()!!, erc20Contract, null, 1.gwei().toLong(), Alice, 1.ether()),
      ERC20Transfer(Bob, SolidityContract.contractAddress(Bob, 1L).data20()!!, erc20Contract, null, 1.gwei().toLong(), Terence, 227.gwei())
    ),
    listOf(
      ERC721Mint(Alice, SolidityContract.contractAddress(Alice, 1L).data20()!!, erc721Contract, null, 1.gwei().toLong(), Bob, 1.toBigInteger()),
      ERC721Mint(Alice, SolidityContract.contractAddress(Alice, 1L).data20()!!, erc721Contract, null, 1.gwei().toLong(), Alice, 2.toBigInteger()),
      ERC721Mint(Alice, SolidityContract.contractAddress(Alice, 1L).data20()!!, erc721Contract, null, 1.gwei().toLong(), Terence, 3.toBigInteger())
    ),
    listOf(
      ERC721SafeTransfer(Terence, SolidityContract.contractAddress(Alice, 1L).data20()!!, erc721Contract, null, 1.gwei().toLong(), Terence, Bob, 3.toBigInteger()),
      ERC721SafeTransfer(Bob, SolidityContract.contractAddress(Alice, 1L).data20()!!, erc721Contract, null, 1.gwei().toLong(), Bob, Alice, 1.toBigInteger())
    )
  )
}
