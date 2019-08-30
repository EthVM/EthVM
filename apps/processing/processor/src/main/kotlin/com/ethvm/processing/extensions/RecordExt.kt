package com.ethvm.processing.extensions

import com.ethvm.common.extensions.hexBytes
import com.ethvm.db.tables.records.BlockHeaderRecord
import com.ethvm.db.tables.records.TransactionReceiptRecord
import com.ethvm.db.tables.records.TransactionRecord
import com.ethvm.db.tables.records.UncleRecord
import org.web3j.protocol.core.methods.response.EthBlock
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.utils.Numeric
import java.math.BigInteger
import java.sql.Timestamp

fun EthBlock.Block.toBlockHeaderRecord(record: BlockHeaderRecord): BlockHeaderRecord {

  record.number = number.toBigDecimal()
  record.hash = hash
  record.parentHash = parentHash

  if(nonceRaw != null) {
    record.nonce = nonce.toBigDecimal()
  }

  record.sha3Uncles = sha3Uncles
  record.logsBloom = logsBloom
  record.transactionsRoot = transactionsRoot
  record.stateRoot = stateRoot
  record.receiptsRoot = receiptsRoot
  record.author = author
  record.difficulty = difficulty.toBigDecimal()
  record.totalDifficulty = totalDifficulty.toBigDecimal()
  record.extraData = extraData
  record.gasUsed = gasUsed.toBigDecimal()
  record.gasLimit = gasLimit.toBigDecimal()
  record.timestamp = Timestamp(timestamp.longValueExact())
  record.size = Numeric.decodeQuantity(sizeRaw ?: "0x0").intValueExact()
  record.uncleCount = uncles.size
  record.uncleHashes = uncles.joinToString(",")
  record.transactionCount = transactions.size
  record.transactionHashes = transactions.map { it.get() as Transaction }.joinToString(",") { it.hash }

  return record

}

fun EthBlock.Block.toUncleRecord(record: UncleRecord, nephewHash: String, height: BigInteger, index: Int): UncleRecord {

  record.number = number.toBigDecimal()
  record.hash = hash
  record.height = height.toBigDecimal()
  record.nephewHash = nephewHash
  record.index = index
  record.parentHash = parentHash
  record.nonce = nonce.toBigDecimal()
  record.sha3Uncles = sha3Uncles
  record.logsBloom = logsBloom
  record.transactionsRoot = transactionsRoot
  record.stateRoot = stateRoot
  record.receiptsRoot = receiptsRoot
  record.author = author
  record.difficulty = difficulty.toBigDecimal()
  record.totalDifficulty = totalDifficulty.toBigDecimal()
  record.extraData = extraData
  record.gasUsed = gasUsed.toBigDecimal()
  record.gasLimit = gasLimit.toBigDecimal()
  record.timestamp = Timestamp(timestamp.longValueExact())
  record.size = Numeric.decodeQuantity(sizeRaw ?: "0x0").longValueExact()

  return record
}

fun Transaction.toTransactionRecord(record: TransactionRecord, timestamp: Long): TransactionRecord {

  record.hash = hash
  record.nonce = nonce.toBigDecimal()
  record.blockHash = blockHash
  record.blockNumber = blockNumber.toBigDecimal()
  record.transactionIndex = transactionIndex.intValueExact()
  record.from = from
  record.to = to
  record.value = value.toBigDecimal()
  record.gasPrice = gasPrice.toBigDecimal()
  record.gas = gas.toBigDecimal()
  record.setInput(*input.hexBytes())
  record.v = v
  record.r = r
  record.s = s
  record.chainId = chainId
  record.timestamp = Timestamp(timestamp)

  return record
}

fun TransactionReceipt.toTransactionReceiptRecord(record: TransactionReceiptRecord, timestamp: Long): TransactionReceiptRecord {

  record.transactionHash = transactionHash
  record.transactionIndex = transactionIndex.intValueExact()
  record.blockHash = blockHash
  record.blockNumber = blockNumber.toBigDecimal()
  record.from = from
  record.to = to
  record.contractAddress = contractAddress
  record.cumulativeGasUsed = cumulativeGasUsed.toBigDecimal()
  record.gasUsed = gasUsed.toBigDecimal()
  record.logs = "TBD" // TODO convert to json
  record.logsBloom = logsBloom
  record.root = root
  record.status = status
  record.timestamp = Timestamp(timestamp)

  return record
}

