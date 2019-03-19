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
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.methods.response.Trace
import org.web3j.utils.Numeric

fun EthBlock.Block.toBlockHeaderRecord(builder: BlockHeaderRecord.Builder): BlockHeaderRecord.Builder =
  builder
    .setNumber(number.toString())
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
    .setDifficulty(difficulty.toString())
    .setTotalDifficulty(totalDifficulty.toString())
    .setExtraData(extraData?.hexBuffer())
    .setGasLimit(gasLimit.toString())
    .setGasUsed(gasUsed.toString())
    .setTimestamp(timestamp.longValueExact())
    .setSize(Numeric.decodeQuantity(sizeRaw ?: "0x0").longValueExact())

fun Transaction.toTransactionRecord(
  builder: TransactionRecord.Builder
): TransactionRecord.Builder {
  builder
    .setBlockHash(blockHash)
    .setHash(hash)
    .setTransactionIndex(transactionIndex.intValueExact())
    .setBlockNumber(blockNumber.toString())
    .setNonce(nonce.toString())
    .setFrom(from)
    .setTo(to)
    .setValue(value.toString())
    .setGasPrice(gasPrice.toString())
    .setGas(gas.toString())
    .setV(v)
    .setR(r)
    .setS(s)
    .setCreates(creates)
    .setChainId(chainId)

  if (input != null) {
    // we compress if the input fixed is 1 Kb or more as some blocks later in the chain have nonsense inputs which are very large and most repeat themselves
    builder.input = input.hexBuffer().compress(150)
  }

  return builder
}

fun TransactionReceipt.toTransactionReceiptRecord(builder: TransactionReceiptRecord.Builder): TransactionReceiptRecord.Builder =
  builder
    .setBlockHash(blockHash)
    .setBlockNumber(blockNumber.toString())
    .setTransactionHash(transactionHash)
    .setTransactionIndex(transactionIndex.intValueExact())
    .setContractAddress(contractAddress)
    .setCumulativeGasUsed(cumulativeGasUsed.toString())
    .setGasUsed(gasUsed.toString())
    .setLogs(logs.map { it.toLogRecord(LogRecord.newBuilder()).build() })
    .setLogsBloom(logsBloom)
    .setRoot(root)
    .setStatus(status?.hexBuffer())
//    .setTraces(traces.map { it.toTraceRecord(TraceRecord.newBuilder()).build() })
//    .setNumInternalTxs(
//      /**
//       * https://ethereum.stackexchange.com/questions/6429/normal-transactions-vs-internal-transactions-in-etherscan
//       *
//       * Internal transactions, despite the name (which isn't part of the yellowpaper; it's a convention people have settled on)
//       * aren't actual transactions, and aren't included directly in the blockchain; they're value transfers that were initiated
//       * by executing a contract.
//       */
//      traces
//        .filterNot { t -> t.type == "reward" }
//        .filter { t -> t.traceAddress.isNotEmpty() }
//        .map { t -> t.action }
//        .map { action ->
//          when (action) {
//            is Trace.CallAction -> if (action.value > BigInteger.ZERO) 1 else 0
//            is Trace.CreateAction -> if (action.value > BigInteger.ZERO) 1 else 0
//            is Trace.SuicideAction -> if (action.balance > BigInteger.ZERO) 1 else 0
//            else -> 0
//          }
//        }.sum()
//    )

fun Log.toLogRecord(builder: LogRecord.Builder): LogRecord.Builder =
  builder
    .setAddress(address)
    .setData(data)
    .setTopics(topics.map { it })

fun Trace.toTraceRecord(builder: TraceRecord.Builder): TraceRecord.Builder {

  val action = this.action

  val actionRecord = when (action) {

    is Trace.CallAction -> TraceCallActionRecord.newBuilder()
      .setCallType(action.callType)
      .setFrom(action.from)
      .setTo(action.to)
      .setGas(action.gas.toString())
      .setInput(action.input)
      .setValue(action.value.toString())
      .build()

    is Trace.RewardAction -> TraceRewardActionRecord.newBuilder()
      .setAuthor(action.author)
      .setRewardType(action.rewardType)
      .setValue(action.value.toString())
      .build()

    is Trace.CreateAction -> TraceCreateActionRecord.newBuilder()
      .setFrom(action.from)
      .setGas(action.gas.toString())
      .setInit(action.init)
      .setValue(action.value.toString())
      .build()

    is Trace.SuicideAction -> TraceDestroyActionRecord.newBuilder()
      .setAddress(action.address)
      .setBalance(action.balance.toString())
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
    .setBlockNumber(blockNumber.toString())
    .setTransactionHash(if (transactionHash != null) transactionHash else null)
    .setTransactionPosition(if (transactionPosition != null) transactionPosition.intValueExact() else null)
}

fun Trace.Result.toTraceResultRecord(builder: TraceResultRecord.Builder): TraceResultRecord.Builder =
  builder
    .setAddress(address)
    .setCode(code)
    .setGasUsed(gasUsed.toString())
    .setOutput(output)
