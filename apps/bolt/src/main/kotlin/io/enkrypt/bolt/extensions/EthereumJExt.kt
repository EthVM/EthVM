package io.enkrypt.bolt.extensions

import io.enkrypt.kafka.models.Account
import org.bson.Document
import org.ethereum.core.Block
import org.ethereum.core.BlockHeader
import org.ethereum.core.BlockStatistics
import org.ethereum.core.BlockSummary
import org.ethereum.core.Transaction
import org.ethereum.core.TransactionExecutionSummary
import org.ethereum.core.TransactionReceipt
import org.ethereum.vm.LogInfo
import org.ethereum.vm.program.InternalTransaction

fun Block?.toDocument(summary: BlockSummary) = Document(
  mapOf(
    "hash" to this?.hash?.toHex(),
    "number" to this?.number,
    "header" to this?.header.toDocument(summary),
    "transactions" to this?.transactionsList?.mapIndexed { pos, tx -> tx.toDocument(pos, summary) },
    "uncles" to this?.uncleList?.map { it.toDocument(summary) },
    "stats" to summary.statistics.toDocument()
  )
)

fun BlockStatistics?.toDocument(): Document? {
  return if (this == null) {
    null
  } else {
    Document(
      mapOf(
        "successfulTxs" to numSuccessfulTxs,
        "failedTxs" to numFailedTxs,
        "txs" to totalTxs,
        "internalTxs" to totalInternalTxs,
        "totalGasPrice" to totalGasPrice.toByteArray(),
        "avgGasPrice" to avgGasPrice.toByteArray(),
        "totalTxsFees" to totalTxsFees.toByteArray(),
        "avgTxsFees" to avgTxsFees.toByteArray()
      )
    )
  }
}

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

fun Transaction?.toDocument(pos: Int, blockSummary: BlockSummary): Document {
  val txHash = this?.hash.toHex()
  val receipt = blockSummary.receipts.find { txHash == it.transaction.hash.toHex() }
  val executionSummary = blockSummary.summaries.find { txHash == it.transaction.hash.toHex() }

  return this.toDocument(pos, receipt, executionSummary)
}

fun Transaction?.toDocument(pos: Int? = null, receipt: TransactionReceipt?, executionSummary: TransactionExecutionSummary?): Document {
  val internalTxs = executionSummary?.internalTransactions ?: emptyList()

  return Document(
    mapOf(
      "hash" to this?.hash.toHex(),
      "transactionIndex" to pos,
      "nonce" to this?.nonce.toHex(),
      "from" to this?.sender.toHex(),
      "to" to this?.receiveAddress?.toHex(),
      "contractAddress" to this?.contractAddress?.toHex(),
      "status" to receipt?.isTxStatusOK,
      "fee" to executionSummary?.fee?.toByteArray(),
      "value" to this?.value,
      "data" to this?.data,
      "logs" to executionSummary?.logs?.map { it.toDocument() },
      "gasPrice" to this?.gasPrice,
      "gasLimit" to this?.gasLimit,
      "gasUsed" to executionSummary?.gasUsed?.toByteArray(),
      "gasRefund" to executionSummary?.gasRefund?.toByteArray(),
      "gasLeftover" to executionSummary?.gasLeftover?.toByteArray(),
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
