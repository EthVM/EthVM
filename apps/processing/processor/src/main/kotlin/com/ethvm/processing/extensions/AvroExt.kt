package com.ethvm.processing.extensions

import com.beust.klaxon.Klaxon
import com.ethvm.processing.StandardTokenDetector
import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.BlockRecord
import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TraceRecord
import com.ethvm.avro.capture.TraceRewardActionRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.avro.processing.BalanceDeltaType
import com.ethvm.avro.processing.TokenType
import com.ethvm.common.extensions.bigInteger
import com.ethvm.common.extensions.byteArray
import com.ethvm.common.extensions.getBlockNumberBI
import com.ethvm.common.extensions.hasError
import com.ethvm.common.extensions.hexBuffer
import com.ethvm.db.tables.records.BalanceDeltaRecord
import com.ethvm.db.tables.records.BlockMetricsHeaderRecord
import com.ethvm.db.tables.records.BlockMetricsTraceRecord
import com.ethvm.db.tables.records.ContractRecord
import com.ethvm.processing.web3.ERC20Abi
import com.ethvm.processing.web3.ERC721Abi
import org.jooq.TableRecord
import java.lang.IllegalStateException
import java.math.BigDecimal
import java.math.BigInteger
import java.sql.Timestamp
import java.util.Comparator
import java.util.TreeSet

private val klaxon = Klaxon()

fun BlockRecord.toDbRecords(blockTime: Int): List<TableRecord<*>> {
  var result = listOf<TableRecord<*>>()

  val timestamp = header.timestamp

  result = result + header.toDbRecord(blockTime)
  result = result + uncles.mapIndexed { idx, uncle -> uncle.toDbRecord(idx, timestamp) }
  result = result + transactions.map { it.toDbRecord(timestamp) }
  result = result + receipts.map { it.toDbRecord(timestamp) }

  return result
}

fun BlockRecord.toMetricRecord(blockTime: Int): BlockMetricsHeaderRecord {
  // some basic stats

  var totalGasPrice = BigInteger.ZERO
  var totalGasLimit = BigInteger.ZERO

  transactions
    .map { Pair(it.gasPrice, it.gas) }
    .forEach { (gasPrice, gas) ->
      totalGasPrice += gasPrice.bigInteger()
      totalGasLimit += gas.bigInteger()
    }

  val txCount = header.transactionCount.toBigInteger()

  val avgGasPrice = if (txCount > BigInteger.ZERO) totalGasPrice / txCount else BigInteger.ZERO
  val avgGasLimit = if (txCount > BigInteger.ZERO) totalGasLimit / txCount else BigInteger.ZERO

  return BlockMetricsHeaderRecord()
    .apply {
      this.number = header.number.bigInteger().toBigDecimal()
      this.hash = header.hash
      this.timestamp = Timestamp(header.timestamp)
      this.blockTime = blockTime
      this.numUncles = header.uncleCount
      this.difficulty = header.difficulty.bigInteger().toBigDecimal()
      this.totalDifficulty = header.totalDifficulty.bigInteger().toBigDecimal()
      this.totalGasPrice = totalGasPrice.toBigDecimal()
      this.avgGasPrice = avgGasPrice.toBigDecimal()
      this.avgGasLimit = avgGasLimit.toBigDecimal()
    }
}

fun BlockHeaderRecord.toDbRecord(blockTime: Int): com.ethvm.db.tables.records.BlockHeaderRecord {

  val avro = this

  return com.ethvm.db.tables.records.BlockHeaderRecord()
    .apply {
      this.number = avro.number.bigInteger().toBigDecimal()
      this.hash = avro.hash
      this.parentHash = avro.parentHash
      this.nonce = if (avro.nonce != null) avro.nonce.bigInteger().toBigDecimal() else BigDecimal.ZERO
      this.sha3Uncles = avro.sha3Uncles
      this.logsBloom = avro.logsBloom
      this.transactionsRoot = avro.transactionsRoot
      this.stateRoot = avro.stateRoot
      this.receiptsRoot = avro.receiptsRoot
      this.author = avro.author
      this.difficulty = avro.difficulty.bigInteger().toBigDecimal()
      this.totalDifficulty = avro.totalDifficulty.bigInteger().toBigDecimal()
      this.extraData = avro.extraData
      this.gasLimit = avro.gasLimit.bigInteger().toBigDecimal()
      this.gasUsed = avro.gasUsed.bigInteger().toBigDecimal()
      this.timestamp = Timestamp(avro.timestamp)
      this.size = avro.size.toInt()
      this.uncleCount = avro.uncleCount
      this.uncleHashes = klaxon.toJsonString(avro.uncleHashes)
      this.transactionCount = avro.transactionCount
      this.transactionHashes = klaxon.toJsonString(avro.transactionHashes)
      this.blockTime = blockTime
    }
}

fun UncleRecord.toDbRecord(index: Int, timestamp: Long): com.ethvm.db.tables.records.UncleRecord {

  val avro = this

  return com.ethvm.db.tables.records.UncleRecord()
    .apply {
      number = avro.number.bigInteger().toBigDecimal()
      hash = avro.hash
      this.index = index
      nephewHash = avro.nephewHash
      height = avro.height.bigInteger().toBigDecimal()
      parentHash = avro.parentHash
      nonce = avro.nonce.bigInteger().toBigDecimal()
      sha3Uncles = avro.sha3Uncles
      logsBloom = avro.logsBloom
      transactionsRoot = avro.transactionsRoot
      stateRoot = avro.stateRoot
      receiptsRoot = avro.receiptsRoot
      author = avro.author
      difficulty = avro.difficulty.bigInteger().toBigDecimal()
      totalDifficulty = avro.totalDifficulty.bigInteger().toBigDecimal()
      extraData = avro.extraData
      gasLimit = avro.gasLimit.bigInteger().toBigDecimal()
      gasUsed = avro.gasUsed.bigInteger().toBigDecimal()
      this.timestamp = Timestamp(timestamp)
      size = avro.size
    }
}

fun TransactionRecord.toDbRecord(timestamp: Long): com.ethvm.db.tables.records.TransactionRecord {
  val avro = this

  return com.ethvm.db.tables.records.TransactionRecord()
    .apply {
      hash = avro.hash
      nonce = avro.nonce.bigInteger().toBigDecimal()
      blockHash = avro.blockHash
      blockNumber = avro.blockNumber.bigInteger().toBigDecimal()
      transactionIndex = avro.transactionIndex
      from = avro.from
      to = avro.to
      value = avro.value.bigInteger().toBigDecimal()
      creates = avro.creates
      gasPrice = avro.gasPrice.bigInteger().toBigDecimal()
      gas = avro.gas.bigInteger().toBigDecimal()
      setInput(*(avro.input?.byteArray() ?: ByteArray(0)))
      v = avro.v
      r = avro.r
      s = avro.s
      this.timestamp = Timestamp(timestamp)
      chainId = avro.chainId
    }
}

fun TransactionReceiptRecord.toDbRecord(timestamp: Long): com.ethvm.db.tables.records.TransactionReceiptRecord {
  val avro = this

  return com.ethvm.db.tables.records.TransactionReceiptRecord()
    .apply {
      transactionHash = avro.transactionHash
      transactionIndex = avro.transactionIndex
      blockHash = avro.blockHash
      blockNumber = avro.blockNumber.bigInteger().toBigDecimal()
      transactionIndex = avro.transactionIndex
      from = avro.from
      to = avro.to
      contractAddress = avro.contractAddress
      cumulativeGasUsed = avro.cumulativeGasUsed.bigInteger().toBigDecimal()
      gasUsed = avro.gasUsed.bigInteger().toBigDecimal()
      logs = klaxon.toJsonString(avro.logs)
      logsBloom = avro.logsBloom
      root = avro.root
      status = avro.status
      this.timestamp = Timestamp(timestamp * 1000L)
    }
}

fun TransactionReceiptRecord.toBalanceDeltas(block: BlockRecord): List<BalanceDeltaRecord> {

  val receipt = this

  val erc20Deltas = logs
    .map { log -> Pair(log, ERC20Abi.decodeTransferEventHex(log.getData(), log.getTopics()).orNull()) }
    .filter { (_, transfer) -> transfer != null }
    .map { (log, transfer) -> Pair(log, transfer!!) }
    .map { (log, transfer) ->

      // generate balance deltas

      listOf(
        BalanceDeltaRecord().apply {
          this.address = transfer.from
          this.counterpartAddress = transfer.to
          this.contractAddress = log.address
          this.deltaType = BalanceDeltaType.TOKEN_TRANSFER.toString()
          this.tokenType = TokenType.ERC20.toString()
          this.blockNumber = block.header.number.bigInteger().toBigDecimal()
          this.blockHash = block.header.hash
          this.transactionHash = receipt.transactionHash
          this.amount = transfer.amount.negate().toBigDecimal()
          this.timestamp = Timestamp(block.header.timestamp)
          this.isReceiving = false
        },
        BalanceDeltaRecord().apply {
          this.address = transfer.to
          this.counterpartAddress = transfer.from
          this.contractAddress = log.address
          this.deltaType = BalanceDeltaType.TOKEN_TRANSFER.toString()
          this.tokenType = TokenType.ERC20.toString()
          this.blockNumber = block.header.number.bigInteger().toBigDecimal()
          this.blockHash = block.header.hash
          this.transactionHash = receipt.transactionHash
          this.amount = transfer.amount.toBigDecimal()
          this.timestamp = Timestamp(block.header.timestamp)
          this.isReceiving = true
        }
      )
    }

  val erc721Deltas = logs
    .map { log -> Pair(log, ERC721Abi.decodeTransferEventHex(log.getData(), log.getTopics()).orNull()) }
    .filter { (_, transfer) -> transfer != null }
    .map { (log, transfer) -> Pair(log, transfer!!) }
    .map { (log, transfer) ->

      listOf(
        BalanceDeltaRecord().apply {
          this.address = transfer.to
          this.counterpartAddress = transfer.from
          this.contractAddress = log.address
          this.deltaType = BalanceDeltaType.TOKEN_TRANSFER.toString()
          this.tokenType = TokenType.ERC721.toString()
          this.blockNumber = block.header.number.bigInteger().toBigDecimal()
          this.blockHash = block.header.hash
          this.transactionHash = receipt.transactionHash
          this.tokenId = transfer.tokenId.toBigDecimal()
          this.timestamp = Timestamp(block.header.timestamp)
          this.isReceiving = true
        }
      )
    }

  return erc20Deltas.flatten() + erc721Deltas.flatten()
}

fun TraceListRecord.toMetricsRecord(): BlockMetricsTraceRecord {

  val traceList = this

  val totalTxs = traceList.gasPrices.size
  var totalSuccessfulTxs = 0
  var totalFailedTxs = 0
  var totalInternalTxs = 0

  traces
    // we only want tx traces
    .filter { it.transactionHash != null }
    .forEach { trace ->

      if (trace.traceAddress.isEmpty()) {
        // root trace
        if (trace.hasError())
          totalFailedTxs += 1
        else
          totalSuccessfulTxs += 1
      } else {
        totalInternalTxs += 1
      }
    }

  val totalTxFees =
    traceList
      .gasUsed
      .mapValues { (txHash, gasUsed) -> traceList.gasPrices[txHash]!!.bigInteger() * gasUsed.bigInteger() }
      .values.fold(BigInteger.ZERO) { agg, next -> agg + next }

  val avgTxFees = if (totalTxs > 0) totalTxFees / totalTxs.toBigInteger() else BigInteger.ZERO

  return BlockMetricsTraceRecord()
    .apply {
      this.number = traceList.blockNumber.bigInteger().toBigDecimal()
      this.hash = traceList.blockHash
      this.timestamp = Timestamp(traceList.timestamp)
      this.totalTxs = totalTxs
      this.numSuccessfulTxs = totalSuccessfulTxs
      this.numFailedTxs = totalFailedTxs
      this.numInternalTxs = totalInternalTxs
      this.totalTxFees = totalTxFees.toBigDecimal()
      this.avgTxFees = avgTxFees.toBigDecimal()
    }
}

fun TraceListRecord.toContractRecords(): List<ContractRecord> {

  val traceList = this

  val traceListSummary = traces
    .fold(TraceListSummary()) { info, trace ->

      when {
        trace.hasError() -> info.addError(trace.traceAddress)
        !trace.hasError() && trace.action is TraceDestroyActionRecord -> info.addSelfDestruct((trace.action as TraceDestroyActionRecord).address, trace.traceAddress)
        else -> info
      }
    }

  return traces
    .filter {
      when (it.action) {
        is TraceCreateActionRecord, is TraceDestroyActionRecord -> true
        else -> false
      }
    }
    .asSequence()
    .filterNot { it.hasError() }
    .filter { isTraceValid(it.traceAddress, traceListSummary.errorTraceAddresses) }
    .mapNotNull { it.toContractRecord(traceList) }
    .toList()
}

fun TraceListRecord.toDbRecords(): List<com.ethvm.db.tables.records.TraceRecord> {

  val traceList = this

  val blockNumber = traceList.blockNumber.bigInteger().toBigDecimal()
  val blockHash = traceList.blockHash
  val timestamp = Timestamp(traceList.timestamp)

  return traceList
    .traces
    .groupBy { Pair(it.blockHash, it.transactionHash) }
    .map { (key, traces) ->

      com.ethvm.db.tables.records.TraceRecord()
        .apply {
          this.blockNumber = blockNumber
          this.blockHash = blockHash
          this.transactionHash = key.second
          this.timestamp = timestamp
          this.traceCount = traces.size
          this.rootError = traces.first { it.traceAddress.isEmpty() }.error // traceList.rootError
          this.traces = klaxon.toJsonString(traces)
        }
    }
}

fun TraceListRecord.toBalanceDeltas(): List<BalanceDeltaRecord> {

  val traceList = this

  // top level traces
  var rootTxTraces = emptyMap<String, TraceRecord>()

  var result = traceList.traces
    .asSequence()
    .groupBy { trace ->

      if (trace.transactionHash != null && trace.traceAddress.isEmpty()) {
        rootTxTraces = rootTxTraces + (trace.transactionHash to trace)
      }

      Pair(trace.blockHash, trace.transactionHash)
    }
    .map { (key, traces) ->

      var deltas = emptyList<BalanceDeltaRecord>()

      val timestamp = Timestamp(timestamp)

      if (key.second == null) {

        // dealing with block and uncle rewards
        deltas = deltas + traces.map { it.toBalanceDeltas(timestamp) }.flatten()
      } else {

        // all other traces

        val traceListSummary = traces.fold(TraceListSummary()) { info, trace ->

          when {
            trace.hasError() -> info.addError(trace.traceAddress)
            !trace.hasError() && trace.action is TraceDestroyActionRecord -> info.addSelfDestruct((trace.action as TraceDestroyActionRecord).address, trace.traceAddress)
            else -> info
          }
        }

        val validTraces = traces
          .asSequence()
          .filterNot { it.hasError() }
          .filter { isTraceValid(it.traceAddress, traceListSummary.errorTraceAddresses) }

        deltas = deltas + validTraces
          .asSequence()
          .map { trace -> trace.toBalanceDeltas(timestamp) }
          .flatten()
          .filterNot { delta ->

            // we filter any addition to the balance of a contract which when self destructing uses itself as the refund address

            delta.deltaType == BalanceDeltaType.CONTRACT_DESTRUCTION.toString() &&
              delta.isReceiving &&
              delta.address == delta.counterpartAddress
          }
          .map { delta ->

            // TODO optimize
            val traceAddress: List<Int> =
              if (delta.traceAddress.isEmpty())
                emptyList()
              else
                delta.traceAddress.split(",").map { it.toInt() }

            val destroyedContracts = traceListSummary.destroyedContracts

            when (delta.deltaType) {

              BalanceDeltaType.INTERNAL_TX.toString(), BalanceDeltaType.CONTRACT_DESTRUCTION.toString() -> {

                if (isTraceAddressGreaterThanSelfDestruct(traceAddress, destroyedContracts[delta.address]
                    ?: sortedSetOf())) {

                  // We zero out any balance modification where the receiving address has already self destructed
                  // The reason we zero is so that we will reflect a zero balance for some addresses which may have only existed within the lifetime of a tx call stack

                  delta.amount = BigDecimal.ZERO
                }

                delta
              }

              else -> delta
            }
          }.toList()
      }

      deltas
    }.flatten()
    .filter { delta -> delta.amount != null }
    .toList()

  // tx fees

  result = result + gasPrices
    .mapValues { (txHash, gasPrice) -> gasUsed[txHash]!!.bigInteger() * gasPrice.bigInteger() }
    .map { (txHash, txFee) ->

      val rootTxTrace = rootTxTraces[txHash]!!

      val from = when (val action = rootTxTrace.action) {
        is TraceCallActionRecord -> action.from
        is TraceCreateActionRecord -> action.from
        else -> throw IllegalStateException("Unexpected root trace")
      }

      listOf(
        BalanceDeltaRecord().apply {
          this.address = author
          this.counterpartAddress = from
          this.deltaType = BalanceDeltaType.TX_FEE.toString()
          this.tokenType = TokenType.ETHER.toString()
          this.amount = txFee.toBigDecimal()
          this.blockHash = traceList.blockHash
          this.blockNumber = traceList.blockNumber.bigInteger().toBigDecimal()
          this.blockHash = traceList.blockHash
          this.transactionHash = txHash
          this.transactionIndex = rootTxTrace.transactionPosition
          this.timestamp = Timestamp(traceList.timestamp)
          this.isReceiving = true
        },
        BalanceDeltaRecord().apply {
          this.address = from
          this.counterpartAddress = author
          this.deltaType = BalanceDeltaType.TX_FEE.toString()
          this.tokenType = TokenType.ETHER.toString()
          this.amount = txFee.negate().toBigDecimal()
          this.blockHash = traceList.blockHash
          this.blockNumber = traceList.blockNumber.bigInteger().toBigDecimal()
          this.blockHash = traceList.blockHash
          this.transactionHash = txHash
          this.transactionIndex = rootTxTrace.transactionPosition
          this.timestamp = Timestamp(traceList.timestamp)
          this.isReceiving = false
        }
      )
    }.flatten()

  return result
}

fun TraceRecord.toContractRecord(traceList: TraceListRecord): ContractRecord? {

  val blockNumber = traceList.blockNumber.bigInteger().toBigDecimal()
  val blockHash = traceList.blockHash
  val transactionHash = transactionHash
  val traceAddressStr = traceAddress.joinToString(",")
  val timestamp = Timestamp(traceList.timestamp)

  // error check first
  if (!(error == null || error.isEmpty())) {
    return null
  }

  return when (val action = getAction()) {

    is TraceCreateActionRecord ->

      ContractRecord().apply {
        address = result.address
        creator = action.from
        init = action.init
        code = result.code
        contractType = StandardTokenDetector.detect(result.code.hexBuffer()!!).first.toString()
        createdAtBlockNumber = blockNumber
        createdAtBlockHash = blockHash
        createdAtTransactionHash = transactionHash
        createdAtTraceAddress = traceAddressStr
        this.createdAtTimestamp = timestamp
      }

    is TraceDestroyActionRecord ->

      ContractRecord().apply {
        address = action.address
        destroyedAtBlockNumber = blockNumber
        destroyedAtBlockHash = blockHash
        destroyedAtTransactionHash = transactionHash
        destroyedAtTraceAddress = traceAddressStr
        this.destroyedAtTimestamp = timestamp
      }

    else -> null
  }
}

fun TraceRecord.toBalanceDeltas(timestamp: Timestamp): List<BalanceDeltaRecord> {

  // error check first
  val error = getError()
  if (!(error == null || error.isEmpty())) {
    return emptyList()
  }

  val action = getAction()

  val blockNumber = getBlockNumberBI().toBigDecimal()
  val blockHash = getBlockHash()
  val transactionHash = getTransactionHash()
  val transactionIndex = getTransactionPosition()
  val traceAddress = getTraceAddress().joinToString(",")

  return when (action) {

    is TraceRewardActionRecord -> {

      val type = when (action.getRewardType()) {
        "uncle" -> BalanceDeltaType.UNCLE_REWARD
        "block" -> BalanceDeltaType.BLOCK_REWARD
        else -> throw IllegalArgumentException("Unexpected reward type: ${action.getRewardType()}")
      }

      listOf(
        BalanceDeltaRecord().apply {
          this.address = action.getAuthor()
          this.tokenType = TokenType.ETHER.toString()
          this.deltaType = type.toString()
          this.amount = action.getValue().bigInteger().toBigDecimal()
          this.blockNumber = blockNumber
          this.blockHash = blockHash
          this.timestamp = timestamp
          this.isReceiving = true
        }
      )
    }

    is TraceCallActionRecord -> {

      if (action.callType == "delegatecall") {
        emptyList()
      } else {

        val deltaType =
          if (traceAddress.isEmpty())
            BalanceDeltaType.TX
          else
            BalanceDeltaType.INTERNAL_TX

        listOf(

          BalanceDeltaRecord().apply {
            this.tokenType = TokenType.ETHER.toString()
            this.deltaType = deltaType.toString()
            this.address = action.from
            this.counterpartAddress = action.to
            this.amount = action.value.bigInteger().negate().toBigDecimal()
            this.blockNumber = blockNumber
            this.blockHash = blockHash
            this.transactionHash = transactionHash
            this.transactionIndex = transactionIndex
            this.traceAddress = traceAddress
            this.timestamp = timestamp
            this.isReceiving = false
          },

          BalanceDeltaRecord().apply {
            this.tokenType = TokenType.ETHER.toString()
            this.deltaType = deltaType.toString()
            this.address = action.to
            this.counterpartAddress = action.from
            this.amount = action.value.bigInteger().toBigDecimal()
            this.blockNumber = blockNumber
            this.blockHash = blockHash
            this.transactionHash = transactionHash
            this.transactionIndex = transactionIndex
            this.traceAddress = traceAddress
            this.timestamp = timestamp
            this.isReceiving = true
          }

        )
      }
    }

    is TraceCreateActionRecord -> listOf(

      BalanceDeltaRecord().apply {
        this.tokenType = TokenType.ETHER.toString()
        this.deltaType = BalanceDeltaType.CONTRACT_CREATION.toString()
        this.address = action.from
        this.counterpartAddress = result.address
        this.amount = action.value.bigInteger().negate().toBigDecimal()
        this.blockNumber = blockNumber
        this.blockHash = blockHash
        this.transactionHash = transactionHash
        this.transactionIndex = transactionIndex
        this.traceAddress = traceAddress
        this.timestamp = timestamp
        this.isReceiving = false
      },

      BalanceDeltaRecord().apply {
        this.tokenType = TokenType.ETHER.toString()
        this.deltaType = BalanceDeltaType.CONTRACT_CREATION.toString()
        this.address = result.address
        this.counterpartAddress = action.from
        this.amount = action.value.bigInteger().toBigDecimal()
        this.blockNumber = blockNumber
        this.blockHash = blockHash
        this.transactionHash = transactionHash
        this.transactionIndex = transactionIndex
        this.traceAddress = traceAddress
        this.timestamp = timestamp
        this.isReceiving = true
      }
    )

    is TraceDestroyActionRecord -> listOf(

      BalanceDeltaRecord().apply {
        this.tokenType = TokenType.ETHER.toString()
        this.deltaType = BalanceDeltaType.CONTRACT_DESTRUCTION.toString()
        this.address = action.address
        this.counterpartAddress = action.refundAddress
        this.amount = action.balance.bigInteger().negate().toBigDecimal()
        this.blockNumber = blockNumber
        this.blockHash = blockHash
        this.transactionHash = transactionHash
        this.transactionIndex = transactionIndex
        this.traceAddress = traceAddress
        this.timestamp = timestamp
        this.isReceiving = false
      },

      BalanceDeltaRecord().apply {
        this.tokenType = TokenType.ETHER.toString()
        this.deltaType = BalanceDeltaType.CONTRACT_DESTRUCTION.toString()
        this.address = action.refundAddress
        this.counterpartAddress = action.address
        this.amount = action.balance.bigInteger().toBigDecimal()
        this.blockNumber = blockNumber
        this.blockHash = blockHash
        this.transactionHash = transactionHash
        this.transactionIndex = transactionIndex
        this.traceAddress = traceAddress
        this.timestamp = timestamp
        this.isReceiving = true
      }
    )

    else -> throw IllegalArgumentException("Unexpected action type: $action")
  }
}

private val traceAddressComparator = TraceAddressComparator()

class TraceAddressComparator : Comparator<List<Int>> {

  override fun compare(a: List<Int>?, b: List<Int>?): Int {

    return when {
      a == null && b != null -> -1
      a != null && b == null -> 1
      else -> {

        var idx = 0
        var result: Int

        do {
          result = when {

            idx < a!!.size && idx < b!!.size -> a[idx] - b[idx]
            idx < a.size && idx >= b!!.size -> 1
            idx < b!!.size && idx >= a.size -> -1
            else -> 0
          }

          idx += 1
        } while (result == 0 && (idx < a!!.size || idx < b!!.size))

        result
      }
    }
  }
}

fun isTraceAddressGreaterThanSelfDestruct(traceAddress: List<Int>, selfDestructTraceAddresses: TreeSet<List<Int>>): Boolean {
  // we can do this kind of check since the tree set is ordered
  return if (selfDestructTraceAddresses.isEmpty()) false
  else traceAddressComparator.compare(traceAddress, selfDestructTraceAddresses.first()) > 0
}

data class TraceListSummary(
  val errorTraceAddresses: Set<List<Int>> = emptySet(),
  val destroyedContracts: Map<String, TreeSet<List<Int>>> = emptyMap()
) {

  fun addError(traceAddress: List<Int>): TraceListSummary =
    TraceListSummary(errorTraceAddresses + setOf(traceAddress), destroyedContracts)

  fun addSelfDestruct(address: String, traceAddress: List<Int>): TraceListSummary {
    val traceAddresses: TreeSet<List<Int>> = destroyedContracts.getOrDefault(address, sortedSetOf(traceAddressComparator))
    traceAddresses.add(traceAddress)
    return TraceListSummary(
      errorTraceAddresses,
      destroyedContracts + (address to traceAddresses)
    )
  }
}

fun isTraceValid(traceAddress: List<Int>, errorTraceAddresses: Set<List<Int>>, target: List<Int> = emptyList()): Boolean {

  if (traceAddress.size - target.size == 0) return true

  return if (!errorTraceAddresses.contains(target)) {
    isTraceValid(traceAddress, errorTraceAddresses, traceAddress.subList(0, target.size + 1))
  } else {
    false
  }
}
