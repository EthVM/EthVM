package io.enkrypt.bolt.extensions

import io.enkrypt.bolt.models.BlockStats
import io.enkrypt.kafka.models.Account
import org.bson.Document
import org.ethereum.core.Block
import org.ethereum.core.BlockHeader
import org.ethereum.core.BlockSummary
import org.ethereum.core.Transaction
import org.ethereum.core.TransactionReceipt
import org.ethereum.vm.LogInfo
import org.ethereum.vm.program.InternalTransaction

fun Block?.toDocument(summary: BlockSummary, stats: BlockStats? = null) = Document(
  mapOf(
    "hash" to this?.hash?.toHex(),
    "number" to this?.number,
    "header" to this?.header.toDocument(summary),
    "transactions" to this?.transactionsList?.map { it.hash.toHex() },
    "uncles" to this?.uncleList?.map { it.hash.toHex() },
    "stats" to stats?.toDocument()
  )
)

fun BlockHeader?.toDocument(summary: BlockSummary) = Document(
  mapOf(
    "parentHash" to this?.parentHash?.toHex(),
    "unclesHash" to this?.unclesHash?.toHex(),
    "timestamp" to this?.timestamp,
    "nonce" to this?.nonce,
    "miner" to this?.coinbase?.toHex(),
    "rewards" to summary.rewards?.entries?.associate { it.key.toHex() to it.value.toByteArray() },
    "difficulty" to this?.difficulty,
    "totalDifficulty" to summary.totalDifficulty.toByteArray(),
    "stateRoot" to this?.stateRoot,
    "transactionsRoot" to this?.txTrieRoot,
    "receiptsRoot" to this?.receiptsRoot,
    "logsBloom" to this?.logsBloom,
    "gasLimit" to this?.gasLimit,
    "gasUsed" to this?.gasUsed,
    "mixHash" to this?.mixHash,
    "extraData" to this?.extraData
  )
)

fun Transaction?.toDocument(pos: Int = 0, summary: BlockSummary, receipt: TransactionReceipt): Document {
  val txHash = this?.hash.toHex()

  val block = summary.block
  val txSummary = summary.summaries.find { txHash == it.transaction.hash.toHex() }
  val internalTxs = txSummary?.internalTransactions ?: emptyList()

  return Document(
    mapOf(
      "hash" to txHash,
      "blockHash" to block.hash.toHex(),
      "blockNumber" to block.number,
      "transactionIndex" to pos,
      "timestamp" to block.timestamp,
      "nonce" to this?.nonce,
      "status" to receipt.isTxStatusOK,
      "fee" to txSummary?.fee?.toByteArray(),
      "from" to this?.sender.toHex(),
      "to" to this?.receiveAddress?.toHex(),
      "contractAddress" to this?.contractAddress?.toHex(),
      "value" to this?.value,
      "data" to this?.data,
      "logs" to txSummary?.logs?.map { it.toDocument() },
      "gasPrice" to this?.gasPrice,
      "gasLimit" to this?.gasLimit,
      "gasUsed" to txSummary?.gasUsed?.toByteArray(),
      "gasRefund" to txSummary?.gasRefund?.toByteArray(),
      "gasLeftover" to txSummary?.gasLeftover?.toByteArray(),
      "traces" to internalTxs.map { it.toDocument() },
      "v" to this?.signature?.v,
      "r" to this?.signature?.r?.toByteArray(),
      "s" to this?.signature?.s?.toByteArray()
    )
  )
}

fun LogInfo?.toDocument(): Document = Document(
  mapOf(
    "address" to this?.address.toHex(),
    "topics" to this?.topics?.map { it.data },
    "data" to this?.data
  )
)

fun InternalTransaction?.toDocument(): Document = Document(
  mapOf(
    "parentHash" to this?.parentHash.toHex(),
    "hash" to this?.hash.toHex(),
    "opcode" to this?.note,
    "deep" to this?.deep,
    "index" to this?.index,
    "rejected" to this?.isRejected,
    "from" to this?.sender.toHex(),
    "to" to this?.receiveAddress.toHex(),
    "value" to this?.value,
    "data" to this?.data,
    "gas" to this?.gasLimit,
    "gasPrice" to this?.gasLimit,
    "nonce" to this?.nonce
  )
)

fun Account?.toDocument(): Document = Document(
  mapOf(
    "address" to this?.address.toHex(),
    "nonce" to this?.nonce?.toByteArray(),
    "balance" to this?.balance?.toByteArray()
  )
)
