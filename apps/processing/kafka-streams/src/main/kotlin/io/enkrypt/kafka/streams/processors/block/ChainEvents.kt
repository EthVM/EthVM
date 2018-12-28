package io.enkrypt.kafka.streams.processors.block

import arrow.core.Option
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.InternalTransactionRecord
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
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.isSuccess
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.utils.ERC20Abi
import io.enkrypt.kafka.streams.utils.ERC721Abi
import io.enkrypt.kafka.streams.utils.StandardTokenDetector
import java.math.BigInteger
import java.nio.ByteBuffer

object ChainEvents {

  fun fungibleTransfer(from: Data20, to: Data20, amount: ByteBuffer, reverse: Boolean = false, contract: Data20? = null) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.TOKEN_TRANSFER)
      .setValue(
        TokenTransferRecord.newBuilder()
          .setContract(contract)
          .setFrom(from)
          .setTo(to)
          .setAmount(amount)
          .build()
      ).build()

  fun nonFungibleTransfer(contract: Data20, from: Data20, to: Data20, tokenId: ByteBuffer, reverse: Boolean = false) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.TOKEN_TRANSFER)
      .setValue(
        TokenTransferRecord.newBuilder()
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

    val events = forPremineBalances(block) +
      forBlockRewards(block) +
      forTransactions(block)

    // return the events in reverse order if we are reversing the block
    return if (block.getReverse()) events.asReversed() else events
  }

  private fun forPremineBalances(block: BlockRecord) =
    block.getPremineBalances()
      .map {
        fungibleTransfer(
          StaticAddresses.EtherZero,
          it.getAddress(),
          it.getBalance(),
          block.getReverse()
        )
      }

  private fun forBlockRewards(block: BlockRecord) =
    block.getRewards()
      .map {
        fungibleTransfer(
          StaticAddresses.EtherZero,
          it.getAddress(),
          it.getReward(),
          block.getReverse()
        )
      }

  private fun forTransactions(block: BlockRecord) =
    block.getTransactions()
      .zip(block.getTransactionReceipts())
      .map { (tx, receipt) -> forTransaction(block, tx, receipt) }
      .flatten()

  private fun forTransaction(
    block: BlockRecord,
    tx: TransactionRecord,
    receipt: TransactionReceiptRecord
  ): List<ChainEventRecord> {

    val reverse = block.getReverse()

    var events = listOf<ChainEventRecord>()

    val blockHash = block.getHeader().getHash()
    val txHash = tx.getHash()

    val from = tx.getFrom()
    val to = tx.getTo()
    val value = tx.getValue()
    val data = tx.getInput()

    // tx fee
    val txFee = (receipt.getGasUsed().unsignedBigInteger()!! * tx.getGasPrice().bigInteger()!!).unsignedByteBuffer()!!
    events += fungibleTransfer(from, StaticAddresses.EtherZero, txFee, reverse)

    // short circuit if the tx was not successful
    if (!receipt.isSuccess()) return events

    // simple ether transfer
    if (!(from == null || to == null || value.capacity() == 0)) {
      events += fungibleTransfer(from, to, value, reverse)
    }

    // contract creation
    if (tx.getCreates() != null) {

      val (contractType, _) = StandardTokenDetector.detect(data)
      events += contractCreate(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)

      // some ether may have also been sent
      if (value.capacity() > 0) {
        events += fungibleTransfer(from, tx.getCreates(), value)
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
              events += fungibleTransfer(it.from, it.to, it.amount, reverse, to ?: receipt.getContractAddress())
            })

          erc721Transfer
            .fold({ Unit }, {
              events += nonFungibleTransfer(to ?: receipt.getContractAddress(), it.from, it.to, it.tokenId, reverse)
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

    val from = internalTx.getFrom()
    val to = internalTx.getTo()
    val value = internalTx.getValue()
    val data = internalTx.getInput()

    // simple ether transfer
    if (!(from == null || to == null || value.capacity() == 0)) {
      events += fungibleTransfer(from, to, value, reverse)
    }

    // contract creation
    if (internalTx.getCreates() != null) {
      val (contractType, _) = StandardTokenDetector.detect(data)
      events += contractCreate(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)
    }

    return events
  }
}
