package com.ethvm.kafka.connect.sources.web3.ext

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.LogRecord
import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.capture.TraceRecord
import com.ethvm.avro.capture.TraceResultRecord
import com.ethvm.avro.capture.TraceRewardActionRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.common.extensions.compress
import com.ethvm.common.extensions.hexBuffer
import com.ethvm.common.extensions.setBalanceBI
import com.ethvm.common.extensions.setBlockNumberBI
import com.ethvm.common.extensions.setCumulativeGasUsedBI
import com.ethvm.common.extensions.setDifficultyBI
import com.ethvm.common.extensions.setGasBI
import com.ethvm.common.extensions.setGasLimitBI
import com.ethvm.common.extensions.setGasPriceBI
import com.ethvm.common.extensions.setGasUsedBI
import com.ethvm.common.extensions.setHeightBI
import com.ethvm.common.extensions.setNonceBI
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.common.extensions.setTotalDifficultyBI
import com.ethvm.common.extensions.setValueBI
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.methods.response.Trace
import org.web3j.utils.Numeric
import java.math.BigInteger

fun EthBlock.Block.toBlockHeaderRecord(builder: BlockHeaderRecord.Builder, blockTime: Int): BlockHeaderRecord.Builder =
  builder
    .setNumberBI(number)
    .setHash(hash)
    .setParentHash(parentHash)
    .setNonceBI(if (nonceRaw != null) nonce else null)
    .setSha3Uncles(sha3Uncles)
    .setTransactionCount(transactions.size)
    .setTransactionHashes(transactions.map { (it.get() as EthBlock.TransactionObject).get().hash })
    .setUncleCount(uncles.size)
    .setUncleHashes(uncles)
    .setLogsBloom(logsBloom)
    .setTransactionsRoot(transactionsRoot)
    .setStateRoot(stateRoot)
    .setReceiptsRoot(receiptsRoot)
    .setAuthor(author)
    .setDifficultyBI(difficulty)
    .setTotalDifficultyBI(totalDifficulty)
    .setExtraData(extraData)
    .setGasLimitBI(gasLimit)
    .setGasUsedBI(gasUsed)
    .setTimestamp(timestamp.longValueExact())
    .setBlockTime(blockTime)
    .setSize(Numeric.decodeQuantity(sizeRaw ?: "0x0").longValueExact())

fun UncleBlock.Block.toUncleRecord(builder: UncleRecord.Builder): UncleRecord.Builder =
  builder
    .setIndex(uncleIndex)
    .setNephewHash(nephewHash)
    .setNumberBI(number)
    .setHeightBI(nephewNumber)
    .setHash(hash)
    .setParentHash(parentHash)
    .setNonceBI(nonce)
    .setSha3Uncles(sha3Uncles)
    .setLogsBloom(logsBloom)
    .setTransactionsRoot(transactionsRoot)
    .setStateRoot(stateRoot)
    .setReceiptsRoot(receiptsRoot)
    .setAuthor(author)
    .setDifficultyBI(difficulty)
    .setTotalDifficultyBI(totalDifficulty)
    .setExtraData(extraData)
    .setGasLimitBI(gasLimit)
    .setGasUsedBI(gasUsed)
    .setTimestamp(timestamp.longValueExact())
    .setSize(Numeric.decodeQuantity(sizeRaw ?: "0x0").longValueExact())

fun Transaction.toTransactionRecord(builder: TransactionRecord.Builder): TransactionRecord.Builder {
  builder
    .setBlockHash(blockHash)
    .setHash(hash)
    .setTransactionIndex(transactionIndex.intValueExact())
    .setBlockNumberBI(blockNumber)
    .setNonceBI(nonce)
    .setFrom(from)
    .setTo(to)
    .setValueBI(value)
    .setGasPriceBI(gasPrice)
    .setGasBI(gas)
    .setV(v)
    .setR(r)
    .setS(s)
    .setCreates(creates)
    .setChainId(chainId)

  if (input != null) {
    // we compress if the input fixed is more than 150 bytes as some blocks later in the chain have nonsense inputs which are very large and mostly repeat themselves
    builder.input = input.hexBuffer().compress(150)
  }

  return builder
}

fun TransactionReceipt.toTransactionReceiptRecord(builder: TransactionReceiptRecord.Builder): TransactionReceiptRecord.Builder =
  builder
    .setBlockHash(blockHash)
    .setBlockNumberBI(blockNumber)
    .setTransactionHash(transactionHash)
    .setTransactionIndex(transactionIndex.intValueExact())
    .setContractAddress(contractAddress)
    .setFrom(from)
    .setTo(to)
    .setCumulativeGasUsedBI(cumulativeGasUsed)
    .setGasUsedBI(gasUsed)
    .setLogs(logs.map { it.toLogRecord(LogRecord.newBuilder()).build() })
    .setLogsBloom(logsBloom)
    .setRoot(root)
    .setStatus(status)

fun Log.toLogRecord(builder: LogRecord.Builder): LogRecord.Builder =
  builder
    .setAddress(address)
    .setData(data)
    .setTopics(topics.map { it })

fun Trace.toTraceRecord(builder: TraceRecord.Builder): TraceRecord.Builder {

  val action = this.action

  val actionRecord = when (action) {

    is Trace.CallAction -> {
      val actionBuilder = TraceCallActionRecord.newBuilder()
        .setCallType(action.callType)
        .setFrom(action.from)
        .setTo(action.to)
        .setGasBI(action.gas)
        .setValueBI(action.value)

      if (action.input != null) {
        // we compress if the input fixed is more than 150 bytes as some blocks later in the chain have nonsense inputs which are very large and mostly repeat themselves
        actionBuilder.input = action.input.hexBuffer().compress(150)
      }

      actionBuilder.build()
    }

    is Trace.RewardAction -> TraceRewardActionRecord.newBuilder()
      .setAuthor(action.author)
      .setRewardType(action.rewardType)
      .setValueBI(action.value)
      .build()

    is Trace.CreateAction -> TraceCreateActionRecord.newBuilder()
      .setFrom(action.from)
      .setGasBI(action.gas)
      .setInit(action.init)
      .setValueBI(action.value)
      .build()

    is Trace.SuicideAction -> TraceDestroyActionRecord.newBuilder()
      .setAddress(action.address)
      .setBalanceBI(action.balance)
      .setRefundAddress(action.refundAddress)
      .build()

    else -> throw IllegalStateException("Unhandled action type: ${action::class}")
  }

  return builder
    .setAction(actionRecord)
    .setError(error)
    .setResult(result?.toTraceResultRecord(TraceResultRecord.newBuilder())?.build())
    .setSubtraces(subtraces.intValueExact())
    .setTraceAddress(traceAddress.map { it.intValueExact() })
    .setType(type)
    .setBlockHash(blockHash)
    .setBlockNumberBI(blockNumber)
    .setTransactionHash(if (transactionHash != null) transactionHash else null)
    .setTransactionPosition(if (transactionPosition != null) transactionPosition.intValueExact() else null)
}

fun Trace.Result.toTraceResultRecord(builder: TraceResultRecord.Builder): TraceResultRecord.Builder =
  builder
    .setAddress(address)
    .setCode(code)
    .setGasUsedBI(gasUsed)
    .setOutput(output)
