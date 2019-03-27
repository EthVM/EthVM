package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.LogRecord
import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.avro.capture.TraceResultRecord
import io.enkrypt.avro.capture.TraceRewardActionRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.common.extensions.compress
import io.enkrypt.common.extensions.hexBuffer
import io.enkrypt.common.extensions.setBalanceBI
import io.enkrypt.common.extensions.setBlockNumberBI
import io.enkrypt.common.extensions.setCumulativeGasUsedBI
import io.enkrypt.common.extensions.setDifficultyBI
import io.enkrypt.common.extensions.setGasBI
import io.enkrypt.common.extensions.setGasLimitBI
import io.enkrypt.common.extensions.setGasPriceBI
import io.enkrypt.common.extensions.setGasUsedBI
import io.enkrypt.common.extensions.setNumberBI
import io.enkrypt.common.extensions.setTotalDifficultyBI
import io.enkrypt.common.extensions.setValueBI
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.methods.response.Trace
import org.web3j.utils.Numeric

fun EthBlock.Block.toBlockHeaderRecord(builder: BlockHeaderRecord.Builder): BlockHeaderRecord.Builder =
  builder
    .setNumberBI(number)
    .setHash(hash)
    .setParentHash(parentHash)
    .setNonce(nonceRaw)
    .setSha3Uncles(sha3Uncles)
    .setUncles(uncles)
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
    .setNonce(nonce.toString())
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
    .setStatus(status?.hexBuffer())

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
