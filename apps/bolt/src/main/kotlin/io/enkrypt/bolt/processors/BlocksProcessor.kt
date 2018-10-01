package io.enkrypt.bolt.processors

import arrow.core.right
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.extensions.transaction
import io.enkrypt.bolt.models.BlockStats
import io.enkrypt.bolt.serdes.RLPBlockSummarySerde
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.bson.Document
import org.ethereum.core.BlockSummary
import org.ethereum.core.TransactionExecutionSummary
import org.ethereum.util.ByteUtil
import org.joda.time.DateTime
import org.joda.time.Period
import java.math.BigInteger
import java.util.Properties

/**
 * This processor process Blocks and Txs at the same time. It calculates also block stats.
 */
class BlocksProcessor : AbstractBaseProcessor() {

  override val id: String = "blocks-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // RLP Serde
    val blockSerde = RLPBlockSummarySerde()

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.blocks, Consumed.with(Serdes.ByteArray(), blockSerde))
      .map { k, v -> KeyValue(ByteUtil.byteArrayToLong(k), v) }
      .map(::calculateStatistics)
      .foreach(::persist)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun calculateStatistics(number: Long, summary: BlockSummary): KeyValue<Long, Pair<BlockSummary, BlockStats>> {
    val block = summary.block
    val receipts = summary.receipts

    val blockTimeMs = Period(block.timestamp, DateTime.now().millis).millis // TODO: Review if this calculation is correct
    var successfulTxs = 0
    var failedTxs = 0
    var totalInternalTxs = 0
    val totalTxs = receipts.size
    val totalGasPrice = BigInteger.valueOf(0L)
    val totalTxsFees = BigInteger.valueOf(0L)
    var avgGasPrice = BigInteger.ZERO
    var avgTxsFees = BigInteger.ZERO

    receipts.forEach { receipt ->
      val transaction = receipt.transaction
      val txSummary: TransactionExecutionSummary? = summary.summaries.find { transaction.hash.toHex() == it.transaction.hash.toHex() }

      when {
        receipt.isTxStatusOK -> successfulTxs += 1
        else -> failedTxs += 1
      }

      val gasPrice = ByteUtil.bytesToBigInteger(transaction.gasPrice)
      val gasUsed = ByteUtil.bytesToBigInteger(receipt.gasUsed)

      totalGasPrice.add(gasPrice)

      val txFee = gasUsed.times(gasPrice)
      totalTxsFees.add(txFee)

      if (totalTxs > 0) {
        val total = totalTxs.toBigInteger()
        avgGasPrice = totalGasPrice.divide(total)
        avgTxsFees = totalTxsFees.divide(total)
      }

      val internalTxs = txSummary?.internalTransactions ?: emptyList()
      totalInternalTxs += internalTxs.size
    }

    val stats = BlockStats(
      blockTimeMs,
      successfulTxs,
      failedTxs,
      totalTxs,
      totalInternalTxs,
      totalGasPrice,
      avgGasPrice,
      totalTxsFees,
      avgTxsFees
    )

    return KeyValue(number, Pair(summary, stats))
  }

  private fun persist(number: Long, pair: Pair<BlockSummary, BlockStats>) {
    val summary = pair.first
    val blockStats = pair.second

    val block = summary.block
    val receipts = summary.receipts

    // Mongo
    val replaceOptions = ReplaceOptions().upsert(true)

    // Blocks
    val blockQuery = Document(mapOf("number" to number))
    val blockUpdate = block.toDocument(summary, blockStats)

    // Transactions
    val txsReplace = mutableListOf<ReplaceOneModel<Document>>()

    receipts.forEachIndexed { i, receipt ->
      val txId = Document(mapOf("_id" to receipt.transaction.hash.toHex()))
      val txDoc = receipt.transaction.toDocument(i, summary, receipt)
      txsReplace.add(ReplaceOneModel(txId, txDoc, replaceOptions))
    }

    val unclesReplace = block.uncleList.map { u ->
      val hash = u.hash.toHex()
      val query = Document(mapOf("_id" to hash))
      ReplaceOneModel(query, u.toDocument(summary))
    }

    mongoSession.transaction {

      blocksCollection.replaceOne(blockQuery, blockUpdate, replaceOptions)

      if(unclesReplace.isNotEmpty()) { unclesCollection.bulkWrite(unclesReplace) }
      if (txsReplace.isNotEmpty()) { transactionsCollection.bulkWrite(txsReplace) }

    }.also {
      when {
        it.isLeft() -> logger.info { "Block stored - Number: ${block.number} - Hash: ${block.hash.toHex()} - Txs: ${receipts.size}" }
        it.isRight() -> logger.error { "Block not stored - Number: ${block.number} - Hash: ${block.hash.toHex()}. Error: ${it.right()}" }
      }
    }
  }

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }
}
