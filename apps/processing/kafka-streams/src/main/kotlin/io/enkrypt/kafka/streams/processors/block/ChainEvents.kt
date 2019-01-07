package io.enkrypt.kafka.streams.processors.block

import arrow.core.Option
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.BlockRewardRecord
import io.enkrypt.avro.capture.InternalTransactionRecord
import io.enkrypt.avro.capture.PremineBalanceRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.common.ContractType
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.common.Data32
import io.enkrypt.avro.processing.ChainEventRecord
import io.enkrypt.avro.processing.ChainEventType
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.avro.processing.TokenTransferType
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.data20
import io.enkrypt.common.extensions.isSuccess
import io.enkrypt.common.extensions.txFee
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.utils.ERC20Abi
import io.enkrypt.kafka.streams.utils.ERC721Abi
import io.enkrypt.kafka.streams.utils.StandardTokenDetector
import org.ethereum.crypto.ECKey
import java.math.BigInteger
import java.nio.ByteBuffer

object ChainEvents {

  private val zeroByteBuffer = BigInteger.ZERO.unsignedByteBuffer()!!

  fun premineBalance(address: Data20, balance: ByteBuffer, reverse: Boolean = false) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.PREMINE_BALANCE)
      .setValue(
        PremineBalanceRecord.newBuilder()
          .setAddress(address)
          .setBalance(balance)
          .build()
      ).build()

  fun blockReward(address: Data20, reward: ByteBuffer, reverse: Boolean = false) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.BLOCK_REWARD)
      .setValue(
        BlockRewardRecord.newBuilder()
          .setAddress(address)
          .setReward(reward)
          .build()
      ).build()

  fun fungibleTransfer(from: ECKey, to: ECKey, amount: BigInteger, reverse: Boolean = false, contract: Data20? = null) =
    fungibleTransfer(from.address.data20()!!, to.address.data20()!!, amount.unsignedByteBuffer()!!, reverse, contract)

  fun fungibleTransfer(
    from: Data20,
    to: Data20,
    amount: ByteBuffer,
    reverse: Boolean = false,
    contract: Data20? = null,
    timestamp: Long? = null,
    blockHash: Data32? = null,
    txHash: Data32? = null,
    txIndex: Int? = 0,
    internalTxIdx: Int? = null,
    transferType: TokenTransferType = TokenTransferType.ETHER
  ) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.TOKEN_TRANSFER)
      .setValue(
        TokenTransferRecord.newBuilder()
          .setTimestamp(timestamp)
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setTxIndex(txIndex!!)
          .setInternalTxIdx(internalTxIdx)
          .setTransferType(transferType)
          .setContract(contract)
          .setFrom(from)
          .setTo(to)
          .setAmount(amount)
          .build()
      ).build()

  fun erc20Transfer(
    from: Data20,
    to: Data20,
    amount: ByteBuffer,
    reverse: Boolean = false,
    contract: Data20? = null,
    timestamp: Long? = null,
    blockHash: Data32? = null,
    txHash: Data32? = null,
    txIndex: Int? = 0,
    internalTxIdx: Int? = null
  ) = fungibleTransfer(from, to, amount, reverse, contract, timestamp, blockHash, txHash, txIndex, internalTxIdx, TokenTransferType.ERC20)

  fun erc721Transfer(
    contract: Data20,
    from: Data20,
    to: Data20,
    tokenId: ByteBuffer,
    reverse: Boolean = false,
    timestamp: Long? = null,
    blockHash: Data32? = null,
    txHash: Data32? = null,
    txIndex: Int? = 0,
    internalTxIdx: Int? = null
  ) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.TOKEN_TRANSFER)
      .setValue(
        TokenTransferRecord.newBuilder()
          .setTimestamp(timestamp)
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setTxIndex(txIndex!!)
          .setInternalTxIdx(internalTxIdx)
          .setTransferType(TokenTransferType.ERC721)
          .setContract(contract)
          .setFrom(from)
          .setTo(to)
          .setTokenId(tokenId)
          .build()
      ).build()

  fun contractCreate(
    contractType: ContractType,
    creator: Data20,
    blockHash: Data32,
    txHash: Data32,
    address: Data20,
    data: ByteBuffer,
    reverse: Boolean = false
  ) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.CONTRACT_CREATE)
      .setValue(
        ContractCreateRecord.newBuilder()
          .setType(contractType)
          .setCreator(creator)
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setAddress(address)
          .setData(data)
          .build()
      ).build()

  fun contractDestroy(blockHash: Data32, txHash: Data32, address: Data20, reverse: Boolean = false) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.CONTRACT_DESTROY)
      .setValue(
        ContractDestroyRecord.newBuilder()
          .setBlockHash(blockHash)
          .setTxHash(txHash)
          .setAddress(address)
          .build()
      ).build()

  fun forBlock(block: BlockRecord): List<ChainEventRecord> {

    val premineEvents = forPremineBalances(block)
    val (totalTxFees, transactionEvents) = forTransactions(block)
    val blockRewardEvents = forBlockRewards(block, totalTxFees)

    val events = premineEvents + blockRewardEvents + transactionEvents

    // return the events in reverse order if we are reversing the block
    return if (block.getReverse()) events.asReversed() else events
  }

  private fun forPremineBalances(block: BlockRecord): List<ChainEventRecord> =
    when (block.getHeader().getNumber()) {
      zeroByteBuffer ->
        block.getPremineBalances()
          .map {
            ChainEventRecord.newBuilder()
              .setReverse(block.getReverse())
              .setType(ChainEventType.PREMINE_BALANCE)
              .setValue(it)
              .build()
          }
      else -> {
        require(block.getPremineBalances().isEmpty()) { "Premine balances are only acceptable for block 0" }
        emptyList()
      }
    }

  private fun forBlockRewards(block: BlockRecord, totalTxFees: BigInteger) =
    block.getRewards()
      .map {
        ChainEventRecord.newBuilder()
          .setReverse(block.getReverse())
          .setType(ChainEventType.BLOCK_REWARD)
          .setValue(
            when (it.getAddress()) {
              block.getHeader().getAuthor() -> {
                // subtract tx fees from miner reward
                val reward = it.getReward().unsignedBigInteger()!! - totalTxFees
                BlockRewardRecord.newBuilder(it)
                  .setReward(reward.unsignedByteBuffer())
                  .build()
              }
              else -> it
            }
          ).build()
      }

  private fun forTransactions(block: BlockRecord): Pair<BigInteger, List<ChainEventRecord>> {

    var totalTxFees = BigInteger.ZERO

    val chainEvents = block.getTransactions()
      .zip(block.getTransactionReceipts())
      .map { (tx, receipt) ->
        totalTxFees += tx.txFee(receipt)
        forTransaction(block, tx, receipt)
      }
      .flatten()

    return Pair(totalTxFees, chainEvents)
  }

  private fun forTransaction(
    block: BlockRecord,
    tx: TransactionRecord,
    receipt: TransactionReceiptRecord
  ): List<ChainEventRecord> {

    val reverse = block.getReverse()

    var events = listOf<ChainEventRecord>()

    val miner = block.getHeader().getAuthor()
    val blockHash = block.getHeader().getHash()
    val txHash = tx.getHash()
    val txIdx = tx.getTransactionIndex()
    val timestamp = block.getHeader().getTimestamp()

    val from = tx.getFrom()
    val to = tx.getTo()
    val value = tx.getValue()
    val data = tx.getInput()

    // tx fee
    val txFee = (receipt.getGasUsed().unsignedBigInteger()!! * tx.getGasPrice().bigInteger()!!).unsignedByteBuffer()!!
    events += fungibleTransfer(from, miner, txFee, reverse, null, timestamp, blockHash, txHash, txIdx)

    // short circuit if the tx was not successful
    if (!receipt.isSuccess()) return events

    // simple ether transfer
    if (!(from == null || to == null || value.capacity() == 0)) {
      events += fungibleTransfer(from, to, value, reverse, null, timestamp, blockHash, txHash, txIdx)
    }

    // contract creation
    if (tx.getCreates() != null) {

      val (contractType, _) = StandardTokenDetector.detect(data)
      events += contractCreate(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)

      // some ether may have also been sent
      if (value.capacity() > 0) {
        events += fungibleTransfer(from, tx.getCreates(), value, reverse, null, timestamp, blockHash, txHash, txIdx)
      }
    }

    // contract suicides
    receipt.getDeletedAccounts()
      .forEach { events += contractDestroy(blockHash, txHash, it, reverse) }

    // token transfers

    receipt.getLogs().forEach { log ->

      val topics = log.getTopics()
      val logData = log.getData().array()

      // ERC20 transfer event has the same signature as ERC721 so we use this initial match to detect any
      // transfer event

      ERC20Abi.matchEvent(topics)
        .filter { it.name == ERC20Abi.EVENT_TRANSFER }
        .fold({ Unit }, {

          val erc20Transfer = ERC20Abi.decodeTransferEvent(logData, topics)
          val erc721Transfer =
            if (erc20Transfer.isDefined()) Option.empty() else ERC721Abi.decodeTransferEvent(logData, topics)

          erc20Transfer
            .filter { it.amount.bigInteger() != BigInteger.ZERO }
            .fold({ Unit }, {
              events +=
                erc20Transfer(it.from, it.to, it.amount, reverse, to
                  ?: receipt.getContractAddress(), timestamp, blockHash, txHash, txIdx)
            })

          erc721Transfer
            .fold({ Unit }, {
              events +=
                erc721Transfer(to
                  ?: receipt.getContractAddress(), it.from, it.to, it.tokenId, reverse, timestamp, blockHash, txHash, txIdx)
            })
        })
    }

    // internal transactions

    events += receipt.getInternalTxs()
      .filter { !it.getRejected() }
      .map { forInternalTransaction(block, tx, it) }
      .flatten()

    return events
  }

  private fun forInternalTransaction(
    block: BlockRecord,
    tx: TransactionRecord,
    internalTx: InternalTransactionRecord
  ): List<ChainEventRecord> {

    val reverse = block.getReverse()
    var events = listOf<ChainEventRecord>()

    val blockHash = block.getHeader().getHash()
    val txHash = tx.getHash()
    val txIdx = tx.getTransactionIndex()
    val internalTxIdx = internalTx.getInternalTransactionIndex()
    val timestamp = block.getHeader().getTimestamp()

    val from = internalTx.getFrom()
    val to = internalTx.getTo()
    val value = internalTx.getValue()
    val data = internalTx.getInput()

    // simple ether transfer
    if (!(from == null || to == null || value.capacity() == 0)) {
      events += fungibleTransfer(from, to, value, reverse, null, timestamp, txHash, blockHash, txIdx, internalTxIdx)
    }

    // contract creation
    if (internalTx.getCreates() != null) {
      val (contractType, _) = StandardTokenDetector.detect(data)
      events += contractCreate(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)
    }

    return events
  }
}
