package io.enkrypt.kafka.streams.processors.block

import arrow.core.Option
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.LogRecord
import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.ChainEventRecord
import io.enkrypt.avro.processing.ChainEventType
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.PremineBalanceRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.avro.processing.TxFeeRecord
import io.enkrypt.common.config.NetConfig
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.decompress
import io.enkrypt.common.extensions.hexBuffer20
import io.enkrypt.common.extensions.hexUBigInteger
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.utils.ERC20Abi
import io.enkrypt.kafka.streams.utils.ERC721Abi
import io.enkrypt.kafka.streams.utils.StandardTokenDetector
import java.math.BigInteger

object ChainEvents {

  fun forBlock(block: BlockRecord, netConfig: NetConfig = NetConfig.mainnet): List<ChainEventRecord> {

    val premineBalances = forPremineBalances(block, netConfig)

    val hardForkEvents = netConfig
      .chainConfigForBlock(block)
      .hardForkEvents(block)

    val txEvents = block
      .getTransactions()
      .map { forTransaction(block, it) }
      .flatten()

    val rewards = forRewards(block)

    val events = premineBalances + hardForkEvents + txEvents + rewards

    // return the events in reverse order if we are reversing the block
    return if (block.getReverse()) events.asReversed() else events
  }

  private fun forPremineBalances(block: BlockRecord, netConfig: NetConfig): List<ChainEventRecord> =
    if (block.getHeader().getNumber().unsignedBigInteger()!! > BigInteger.ZERO) {
      emptyList()
    } else {
      netConfig.genesis
        .alloc
        .map { (address, balance) ->

          ChainEventRecord.newBuilder()
            .setReverse(block.getReverse())
            .setTimestamp(block.getHeader().getTimestamp())
            .setType(ChainEventType.PREMINE_BALANCE)
            .setBlockHash(block.getHeader().getHash())
            .setValue(
              PremineBalanceRecord.newBuilder()
                .setAddress(address.hexBuffer20())
                .setBalance(balance.hexUBigInteger().unsignedByteBuffer())
                .build()
            ).build()
        }
    }

  private fun forRewards(block: BlockRecord) = block
    .getRewards()
    .map { reward ->
      ChainEventRecord
        .newBuilder()
        .setReverse(block.getReverse())
        .setTimestamp(block.getHeader().getTimestamp())
        .setType(ChainEventType.REWARD)
        .setBlockHash(block.getHeader().getHash())
        .setValue(reward)
        .build()
    }

  private fun forTransaction(block: BlockRecord, tx: TransactionRecord): List<ChainEventRecord> {

    val reverse = block.getReverse()
    val receipt = tx.getReceipt()
    val traces = receipt.getTraces()

    val timestamp = block.getHeader().getTimestamp()

    val traceEvents = traces.map { trace -> forTrace(tx, trace, timestamp, reverse) }.flatten()
    val receiptEvents = forReceipts(block, tx)

    return traceEvents + receiptEvents
  }

  private fun forReceipts(block: BlockRecord, tx: TransactionRecord): List<ChainEventRecord> {

    val reverse = block.getReverse()
    val timestamp = block.getHeader().getTimestamp()

    val receipt = tx.getReceipt()

    val logEvents = receipt.getLogs().map { log -> forLog(tx, log, timestamp, reverse) }.flatten()

    return logEvents +
      // tx fee
      ChainEventRecord.newBuilder()
        .setReverse(reverse)
        .setTimestamp(timestamp)
        .setType(ChainEventType.TX_FEE)
        .setBlockHash(tx.getBlockHash())
        .setTxHash(tx.getHash())
        .setTxIndex(tx.getTransactionIndex())
        .setValue(
          TxFeeRecord.newBuilder()
            .setMiner(block.getHeader().getAuthor())
            .setFrom(tx.getFrom())
            .setAmount(
              (tx.getGasPrice().unsignedBigInteger()!! * receipt.getGasUsed().unsignedBigInteger()!!).unsignedByteBuffer()
            ).build()
        ).build()
  }

  private fun forLog(tx: TransactionRecord, log: LogRecord, timestamp: Long, reverse: Boolean): List<ChainEventRecord> {

    var result = emptyList<ChainEventRecord>()

    val topics = log.getTopics()
    val logData = log.getData().array()

    val contractAddress = tx.getTo()

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

            result = result +
              ChainEventRecord.newBuilder()
                .setReverse(reverse)
                .setTimestamp(timestamp)
                .setType(ChainEventType.TOKEN_TRANSFER)
                .setBlockHash(tx.getBlockHash())
                .setTxHash(tx.getHash())
                .setTxIndex(tx.getTransactionIndex())
                .setValue(
                  TokenTransferRecord.newBuilder()
                    .setTransferType(BalanceType.ERC20)
                    .setContract(contractAddress)
                    .setFrom(it.from)
                    .setTo(it.to)
                    .setAmount(it.amount)
                    .build()
                ).build()
          })

        erc721Transfer
          .fold({ Unit }, {

            result = result +
              ChainEventRecord.newBuilder()
                .setReverse(reverse)
                .setTimestamp(timestamp)
                .setType(ChainEventType.TOKEN_TRANSFER)
                .setBlockHash(tx.getBlockHash())
                .setTxHash(tx.getHash())
                .setTxIndex(tx.getTransactionIndex())
                .setValue(
                  TokenTransferRecord.newBuilder()
                    .setTransferType(BalanceType.ERC721)
                    .setContract(contractAddress)
                    .setFrom(it.from)
                    .setTo(it.to)
                    .setTokenId(it.tokenId)
                    .build()
                ).build()
          })
      })

    return result
  }

  @Suppress("UsePropertyAccessSyntax")
  private fun forTrace(tx: TransactionRecord, trace: TraceRecord, timestamp: Long, reverse: Boolean = false): List<ChainEventRecord> {

    var result = listOf<ChainEventRecord>()

    if (trace.getError() != null) {
      return result
    }

    val action = trace.getAction()

    when (action) {

      is TraceCallActionRecord -> {

        val from = action.getFrom()
        val to = action.getTo()
        val value = action.getValue().unsignedBigInteger()!!

        if (to != null && value > BigInteger.ZERO) {
          result = result +
            ChainEventRecord.newBuilder()
              .setReverse(reverse)
              .setTimestamp(timestamp)
              .setType(ChainEventType.TOKEN_TRANSFER)
              .setBlockHash(tx.getBlockHash())
              .setTxHash(tx.getHash())
              .setTxIndex(tx.getTransactionIndex())
              .setTraceAddress(trace.getTraceAddress())
              .setValue(
                TokenTransferRecord.newBuilder()
                  .setTransferType(BalanceType.ETHER)
                  .setFrom(from)
                  .setTo(to)
                  .setAmount(value.unsignedByteBuffer())
                  .build()
              ).build()
        }
      }

      is TraceCreateActionRecord -> {

        val from = action.getFrom()
        val value = action.getValue().unsignedBigInteger()!!
        val contractAddress = trace.getResult().getAddress()

        val contractData = tx.getInput().decompress()!!

        result = result +
          ChainEventRecord.newBuilder()
            .setReverse(reverse)
            .setTimestamp(timestamp)
            .setType(ChainEventType.CONTRACT_CREATE)
            .setBlockHash(tx.getBlockHash())
            .setTxHash(tx.getHash())
            .setTxIndex(tx.getTransactionIndex())
            .setTraceAddress(trace.getTraceAddress())
            .setValue(
              ContractCreateRecord.newBuilder()
                .setCreator(from)
                .setAddress(contractAddress)
                .setType(StandardTokenDetector.detect(contractData).first)
                .setData(contractData)
                .build()
            ).build()

        if (value > BigInteger.ZERO) {
          // some there has also been sent to the contract on creation

          result = result +
            ChainEventRecord.newBuilder()
              .setReverse(reverse)
              .setTimestamp(timestamp)
              .setType(ChainEventType.TOKEN_TRANSFER)
              .setBlockHash(tx.getBlockHash())
              .setTxHash(tx.getHash())
              .setTxIndex(tx.getTransactionIndex())
              .setTraceAddress(trace.getTraceAddress())
              .setValue(
                TokenTransferRecord.newBuilder()
                  .setTransferType(BalanceType.ETHER)
                  .setFrom(from)
                  .setTo(contractAddress)
                  .setAmount(value.unsignedByteBuffer())
                  .build()
              ).build()
        }
      }
      is TraceDestroyActionRecord -> {

        result = result + listOf(

          ChainEventRecord.newBuilder()
            .setReverse(reverse)
            .setTimestamp(timestamp)
            .setType(ChainEventType.CONTRACT_DESTROY)
            .setBlockHash(tx.getBlockHash())
            .setTxHash(tx.getHash())
            .setTxIndex(tx.getTransactionIndex())
            .setTraceAddress(trace.getTraceAddress())
            .setValue(
              ContractDestroyRecord
                .newBuilder()
                .setAddress(action.getAddress())
                .setRefundAddress(action.getRefundAddress())
                .setBalance(action.getBalance())
                .build()
            ).build(),

          ChainEventRecord.newBuilder()
            .setReverse(reverse)
            .setTimestamp(timestamp)
            .setType(ChainEventType.TOKEN_TRANSFER)
            .setBlockHash(tx.getBlockHash())
            .setTxHash(tx.getHash())
            .setTxIndex(tx.getTransactionIndex())
            .setTraceAddress(trace.getTraceAddress())
            .setValue(
              TokenTransferRecord.newBuilder()
                .setTransferType(BalanceType.ETHER)
                .setFrom(action.getAddress())
                .setTo(action.getRefundAddress())
                .setAmount(action.getBalance())
                .build()
            ).build()

        )
      }

      else -> {
      } // do nothing
    }

    return result
  }
}
