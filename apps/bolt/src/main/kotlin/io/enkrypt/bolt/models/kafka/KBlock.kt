package io.enkrypt.bolt.models.kafka

import io.enkrypt.bolt.extensions.rewind
import io.enkrypt.bolt.extensions.toBigDecimal
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.models.avro.Block
import org.bson.Document
import org.joda.time.DateTime
import java.math.BigDecimal

class KBlock(private val delegate: Block) {

  val number: BigDecimal? by lazy { delegate.getNumber().toBigDecimal() }
  val hash: String? by lazy { delegate.getHash().toHex() }
  val parentHash: String? by lazy { delegate.getParentHash().toHex() }
  val mixDigest: String? by lazy { delegate.getMixDigest().toHex() }
  val isUncle: Boolean by lazy { delegate.getUncle() }
  val status: Int by lazy { delegate.getStatus() }
  val timestamp: DateTime by lazy { delegate.getTimestamp() }
  val nonce: String? by lazy { delegate.getNonce().toHex() }
  val sha3Uncles: String? by lazy { delegate.getSha3Uncles().toHex() }
  val logsBloom: String? by lazy { delegate.getLogsBloom().toHex() }
  val stateRoot: String? by lazy { delegate.getStateRoot().toHex() }
  val transactionsRoot: String? by lazy { delegate.getTransactionsRoot().toHex() }
  val miner: String? by lazy { delegate.getMiner().toHex() }
  val difficulty: BigDecimal? by lazy { delegate.getDifficulty().toBigDecimal() }
  val totalDifficulty: BigDecimal? by lazy { delegate.getTotalDifficulty().toBigDecimal() }
  val extraData: String? by lazy { delegate.getExtraData().toHex() }
  val size: BigDecimal? by lazy { delegate.getSize().toBigDecimal() }
  val gasLimit: BigDecimal? by lazy { delegate.getGasLimit().toBigDecimal() }
  val gasUsed: BigDecimal? by lazy { delegate.getGasUsed().toBigDecimal() }
  val txsFees: BigDecimal? by lazy { delegate.getTxsFees().toBigDecimal() }
  val transactions: List<KTransaction> by lazy { delegate.getTransactions().map { KTransaction(it) } }
  val uncles: List<String?> by lazy { delegate.getUncles().map { it.toHex() } }
  val blockReward: BigDecimal? by lazy { delegate.getBlockReward().toBigDecimal() }
  val uncleReward: BigDecimal? by lazy { delegate.getUncleReward().toBigDecimal() }
  var stats: KBlockStats? = null

  val isCanonical: Boolean by lazy { status == Status.CANONICAL.ordinal }

  // Storing in pure binary
//  val number: ByteArray? by lazy { delegate.getNumber().toByteArray() }
//  val hash: ByteArray? by lazy { delegate.getHash().toByteArray() }
//  val parentHash: ByteArray? by lazy { delegate.getParentHash().toByteArray() }
//  val mixDigest: ByteArray? by lazy { delegate.getMixDigest().toByteArray() }
//  val isUncle: Boolean by lazy { delegate.getUncle() }
//  val status: Int by lazy { delegate.getStatus() }
//  val timestamp: DateTime by lazy { delegate.getTimestamp() }
//  val nonce: ByteArray? by lazy { delegate.getNonce().toByteArray() }
//  val sha3Uncles: ByteArray? by lazy { delegate.getSha3Uncles().toByteArray() }
//  val logsBloom: ByteArray? by lazy { delegate.getLogsBloom().toByteArray() }
//  val stateRoot: ByteArray? by lazy { delegate.getStateRoot().toByteArray() }
//  val transactionsRoot: ByteArray? by lazy { delegate.getTransactionsRoot().toByteArray() }
//  val miner: ByteArray? by lazy { delegate.getMiner().toByteArray() }
//  val difficulty: ByteArray? by lazy { delegate.getDifficulty().toByteArray() }
//  val totalDifficulty: ByteArray? by lazy { delegate.getTotalDifficulty().toByteArray() }
//  val extraData: ByteArray? by lazy { delegate.getExtraData().toByteArray() }
//  val size: ByteArray? by lazy { delegate.getSize().toByteArray() }
//  val gasLimit: ByteArray? by lazy { delegate.getGasLimit().toByteArray() }
//  val gasUsed: ByteArray? by lazy { delegate.getGasUsed().toByteArray() }
//  val txsFees: ByteArray? by lazy { delegate.getTxsFees().toByteArray() }
//  val transactions: List<KTransaction> by lazy { delegate.getTransactions().map { KTransaction(it) } }
//  val blockReward: ByteArray? by lazy { delegate.getBlockReward().toByteArray() }
//  val uncleReward: ByteArray? by lazy { delegate.getUncleReward().toByteArray() }
//  var stats: BlockStats? = null

  fun toDocument(): Document = Document()
    .append("number", number)
    .append("hash", hash)
    .append("parentHash", parentHash)
    .append("mixDigest", mixDigest)
    .append("uncle", isUncle)
    .append("status", status)
    .append("timestamp", timestamp.millis)
    .append("nonce", nonce)
    .append("sha3Uncles", sha3Uncles)
    .append("logsBloom", logsBloom)
    .append("stateRoot", stateRoot)
    .append("transactionsRoot", transactionsRoot)
    .append("miner", miner)
    .append("difficulty", difficulty)
    .append("totalDifficulty", totalDifficulty)
    .append("extraData", extraData)
    .append("size", size)
    .append("gasLimit", gasLimit)
    .append("gasUsed", gasUsed)
    .append("txsFees", txsFees)
    .append("transactions", transactions.map { tx -> tx.toDocument() })
    .append("blockReward", blockReward)
    .append("uncleReward", uncleReward)
    .append("uncles", uncles)
    .append("stats", stats?.toDocument())

  fun toBlock(): Block = Block.newBuilder(delegate.rewind()).build()

  enum class Status {
    UNKNOWN,
    CANONICAL,
    SIDE
  }
}
