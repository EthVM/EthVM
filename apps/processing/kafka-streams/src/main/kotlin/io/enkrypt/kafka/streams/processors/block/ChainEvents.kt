package io.enkrypt.kafka.streams.processors.block

import arrow.core.Option
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.InternalTransactionRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.byteArray
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.isSuccess
import io.enkrypt.kafka.streams.models.ChainEvent
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.utils.ERC20Abi
import io.enkrypt.kafka.streams.utils.ERC721Abi
import io.enkrypt.kafka.streams.utils.StandardTokenDetector
import org.spongycastle.util.BigIntegers
import java.math.BigInteger

object ChainEvents {

  fun forBlock(block: BlockRecord): List<ChainEvent> {
    val events = forPremineBalances(block) +
      forBlockRewards(block) +
      forTransactions(block)

    // return the events in reverse order if we are reversing the block
    return if (block.getReverse()) events.asReversed() else events
  }

  fun forPremineBalances(block: BlockRecord) =
    block.getPremineBalances()
      .map {
        ChainEvent.fungibleTransfer(
          StaticAddresses.EtherZero,
          it.getAddress(),
          it.getBalance(),
          block.getReverse()
        )
      }

  fun forBlockRewards(block: BlockRecord) =
    block.getRewards()
      .map {
        ChainEvent.fungibleTransfer(
          StaticAddresses.EtherZero,
          it.getAddress(),
          it.getReward(),
          block.getReverse()
        )
      }

  fun forTransactions(block: BlockRecord) =
    block.getTransactions()
      .zip(block.getTransactionReceipts())
      .filter { (_, receipt) -> receipt.isSuccess() }
      .map { (tx, receipt) -> forTransaction(block, tx, receipt) }
      .flatten()

  fun forTransaction(
    block: BlockRecord,
    tx: TransactionRecord,
    receipt: TransactionReceiptRecord
  ): List<ChainEvent> {

    val reverse = block.getReverse()

    var events = listOf<ChainEvent>()

    val blockHash = block.getHeader().getHash()
    val txHash = tx.getHash()

    val from = tx.getFrom()
    val to = tx.getTo()
    val value = tx.getValue()
    val data = tx.getInput()

    // tx fee
    val txFee = (receipt.getGasUsed().bigInteger()!! * tx.getGasPrice().bigInteger()!!).byteBuffer()!!
    events += ChainEvent.fungibleTransfer(from, StaticAddresses.EtherZero, txFee, reverse)

    // simple ether transfer
    if (!(from == null || to == null || value.capacity() == 0)) {
      events += ChainEvent.fungibleTransfer(from, to, value, reverse)
    }

    // contract creation
    if (tx.getCreates() != null) {

      val (contractType, _) = StandardTokenDetector.detect(data)
      events += ChainEvent.contractCreate(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)

      // some ether may have also been sent
      if (value.capacity() > 0) {
        events += ChainEvent.fungibleTransfer(from, tx.getCreates(), value)
      }

    }

    // contract suicides
    receipt.getDeletedAccounts()
      .forEach { events += ChainEvent.contractDestruct(blockHash, txHash, it, reverse) }

    // token transfers

    receipt.getLogs().forEach { log ->

      val topics = log.getTopics().toList()
      val logData = log.getData().array()

      // ERC20 transfer event has the same signature as ERC721 so we use this initial match to detect any
      // transfer event

      ERC20Abi.matchEvent(log.getTopics())
        .filter { it.name == ERC20Abi.EVENT_TRANSFER }
        .fold({ Unit }, {

          val erc20Transfer = ERC20Abi.decodeTransferEvent(logData, topics)
          val erc721Transfer =
            if (erc20Transfer.isDefined()) Option.empty() else ERC721Abi.decodeTransferEvent(logData, topics)

          erc20Transfer
            .filter { it.amount.bigInteger() != BigInteger.ZERO }
            .fold({ Unit }, {
              events += ChainEvent.fungibleTransfer(it.from, it.to, it.amount, reverse, to
                ?: receipt.getContractAddress())
            })

          erc721Transfer
            .fold({ Unit }, {
              events += ChainEvent.nonFungibleTransfer(to
                ?: receipt.getContractAddress(), it.from, it.to, it.tokenId, reverse)
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

  fun forInternalTransaction(
    block: BlockRecord,
    tx: TransactionRecord,
    internalTx: InternalTransactionRecord
  ): List<ChainEvent> {

    val reverse = block.getReverse()
    var events = listOf<ChainEvent>()

    val blockHash = block.getHeader().getHash()
    val txHash = tx.getHash()

    val from = internalTx.getFrom()
    val to = internalTx.getTo()
    val value = internalTx.getValue()
    val data = internalTx.getInput()

    // simple ether transfer
    if (!(from == null || to == null || value == null)) {
      events += ChainEvent.fungibleTransfer(from, to, value, reverse)
    }

    // contract creation
    if (internalTx.getCreates() != null) {
      val (contractType, _) = StandardTokenDetector.detect(data)
      events += ChainEvent.contractCreate(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)
    }

    return events
  }
}
