package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.BlockRewardRecord
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
import io.enkrypt.common.extensions.hexBuffer20
import io.enkrypt.common.extensions.hexBuffer256
import io.enkrypt.common.extensions.hexBuffer32
import io.enkrypt.common.extensions.hexBuffer8
import io.enkrypt.common.extensions.unsignedByteBuffer
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Log
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.protocol.parity.methods.response.Trace
import org.web3j.utils.Numeric
import java.math.BigInteger

data class BlockData(
  val block: EthBlock.Block,
  val uncles: List<EthBlock.Block>,
  val receipts: List<TransactionReceipt>?,
  val traces: List<Trace>?
) {

  fun toBlockRecord(): BlockRecord.Builder =
    block.toBlockRecord(BlockRecord.newBuilder(), uncles, receipts, traces)
}

fun EthBlock.Block.toBlockHeaderRecord(builder: BlockHeaderRecord.Builder): BlockHeaderRecord.Builder =
  builder
    .setNumber(number.unsignedByteBuffer())
    .setHash(hash.hexBuffer32())
    .setParentHash(parentHash.hexBuffer32())
    .setNonce(nonceRaw.hexBuffer8())
    .setSha3Uncles(sha3Uncles.hexBuffer32())
    .setLogsBloom(logsBloom.hexBuffer256())
    .setTransactionsRoot(transactionsRoot.hexBuffer32())
    .setStateRoot(stateRoot.hexBuffer32())
    .setReceiptsRoot(receiptsRoot.hexBuffer32())
    .setAuthor(author.hexBuffer20())
    .setDifficulty(difficulty.unsignedByteBuffer())
    .setExtraData(extraData?.hexBuffer())
    .setGasLimit(gasLimit.unsignedByteBuffer())
    .setGasUsed(gasUsed.unsignedByteBuffer())
    .setTimestamp(timestamp.longValueExact())
    .setSize(Numeric.decodeQuantity(sizeRaw ?: "0x0").longValueExact())

fun EthBlock.Block.toBlockRecord(
  builder: BlockRecord.Builder,
  uncles: List<EthBlock.Block>,
  receipts: List<TransactionReceipt>?,
  traces: List<Trace>?
): BlockRecord.Builder {

  val receiptsByTxHash = receipts?.map { it.transactionHash to it }?.toMap() ?: emptyMap()
  val tracesByTxHash = traces?.groupBy { it.transactionHash } ?: emptyMap()
  val txs = transactions.map { it.get() as Transaction }

  val rewards = traces
    ?.filter { it.type == "reward" }
    ?.map { it.action as Trace.RewardAction }
    ?.groupBy { it.author to it.rewardType }
    ?.map { (key, rewards) ->

      val totalReward = rewards.fold(BigInteger.ZERO) { memo, action -> memo + action.value }

      BlockRewardRecord.newBuilder()
        .setAuthor(key.first.hexBuffer())
        .setRewardType(key.second)
        .setValue(totalReward.unsignedByteBuffer())
        .build()

    } ?: emptyList()

  val uncleRewardsByAuthor = rewards
    .filter { it.getRewardType() == "uncle" }
    .groupBy { it.getAuthor() }
    .mapValues { (_, v) -> v.first().getValue() }

  return builder
    .setHeader(toBlockHeaderRecord(BlockHeaderRecord.newBuilder()).build())
    .setTotalDifficulty(totalDifficulty.unsignedByteBuffer())
    .setSha3Uncles(sha3Uncles.hexBuffer32())
    .setUncleHashes(this.uncles.map { it.hexBuffer32() })
    .setUncles(
      uncles.map { uncle ->
        uncle
          .toBlockHeaderRecord(BlockHeaderRecord.newBuilder())
          .setUncleReward(uncleRewardsByAuthor[uncle.author.hexBuffer20()])
          .build()
      }
    )
    .setRewards(rewards)
    .setTransactions(
      txs.map { tx ->
        tx.toTransactionRecord(
          TransactionRecord.newBuilder(),
          timestamp.longValueExact(),
          receiptsByTxHash.getValue(tx.hash),
          tracesByTxHash.getValue(tx.hash)
        ).build()
      }
    )
}

fun Transaction.toTransactionRecord(
  builder: TransactionRecord.Builder,
  blockTimestamp: Long,
  receipt: TransactionReceipt,
  traces: List<Trace>
): TransactionRecord.Builder {
  builder
    .setBlockHash(blockHash.hexBuffer32())
    .setHash(hash.hexBuffer32())
    .setTransactionIndex(transactionIndex.intValueExact())
    .setBlockNumber(blockNumber.unsignedByteBuffer())
    .setNonce(nonce.unsignedByteBuffer())
    .setFrom(from.hexBuffer20())
    .setTo(to?.hexBuffer20())
    .setValue(value.unsignedByteBuffer())
    .setGasPrice(gasPrice.unsignedByteBuffer())
    .setGas(gas.unsignedByteBuffer())
    .setV(v)
    .setR(r.hexBuffer())
    .setS(s.hexBuffer())
    .setCreates(creates?.hexBuffer20())
    .setChainId(chainId)
    .setTimestamp(blockTimestamp).receipt = receipt.toTransactionReceiptRecord(TransactionReceiptRecord.newBuilder(), traces).build()

  if (input != null) {
    // we compress if the input fixed is 1 Kb or more as some blocks later in the chain have nonsense inputs which are very large and most repeat themselves
    builder.input = input.hexBuffer().compress(1024)
  }

  return builder
}

fun TransactionReceipt.toTransactionReceiptRecord(builder: TransactionReceiptRecord.Builder, traces: List<Trace>): TransactionReceiptRecord.Builder =
  builder
    .setBlockHash(blockHash.hexBuffer32())
    .setBlockNumber(blockNumber.unsignedByteBuffer())
    .setTransactionHash(transactionHash.hexBuffer32())
    .setTransactionIndex(transactionIndex.intValueExact())
    .setContractAddress(contractAddress?.hexBuffer20())
    .setCumulativeGasUsed(cumulativeGasUsed.unsignedByteBuffer())
    .setGasUsed(gasUsed.unsignedByteBuffer())
    .setLogs(logs.map { it.toLogRecord(LogRecord.newBuilder()).build() })
    .setLogsBloom(logsBloom.hexBuffer256())
    .setRoot(root?.hexBuffer32())
    .setStatus(status?.hexBuffer())
    .setTraces(traces.map { it.toTraceRecord(TraceRecord.newBuilder()).build() })

fun Log.toLogRecord(builder: LogRecord.Builder): LogRecord.Builder =
  builder
    .setAddress(address.hexBuffer20())
    .setData(data.hexBuffer())
    .setTopics(topics.map { it.hexBuffer32() })

fun Trace.toTraceRecord(builder: TraceRecord.Builder): TraceRecord.Builder {

  val action = this.action

  val actionRecord = when (action) {

    is Trace.CallAction -> TraceCallActionRecord.newBuilder()
      .setCallType(action.callType)
      .setFrom(action.from.hexBuffer20())
      .setTo(action.to?.hexBuffer20())
      .setGas(action.gas.unsignedByteBuffer())
      .setInput(action.input?.hexBuffer().compress(1024))
      .setValue(action.value.unsignedByteBuffer())
      .build()

    is Trace.RewardAction -> TraceRewardActionRecord.newBuilder()
      .setAuthor(action.author.hexBuffer20())
      .setRewardType(action.rewardType)
      .setValue(action.value.unsignedByteBuffer())
      .build()

    is Trace.CreateAction -> TraceCreateActionRecord.newBuilder()
      .setFrom(action.from.hexBuffer20())
      .setGas(action.gas.unsignedByteBuffer())
      .setInit(action.init.hexBuffer())
      .setValue(action.value.unsignedByteBuffer())
      .build()

    is Trace.SuicideAction -> TraceDestroyActionRecord.newBuilder()
      .setAddress(action.address.hexBuffer20())
      .setBalance(action.balance.unsignedByteBuffer())
      .setRefundAddress(action.refundAddress.hexBuffer20())
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
    .setBlockHash(blockHash.hexBuffer32())
    .setBlockNumber(blockNumber.unsignedByteBuffer())
    .setTransactionHash(transactionHash.hexBuffer32())
    .setTransactionPosition(transactionPosition.intValueExact())
}

fun Trace.Result.toTraceResultRecord(builder: TraceResultRecord.Builder): TraceResultRecord.Builder =
  builder
    .setAddress(address?.hexBuffer20())
    .setCode(code?.hexBuffer())
    .setGasUsed(gasUsed.unsignedByteBuffer())
    .setOutput(output?.hexBuffer())
