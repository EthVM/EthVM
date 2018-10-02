package io.enkrypt.bolt.sinks

import arrow.core.Tuple3
import arrow.core.right
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.extensions.transaction
import io.enkrypt.bolt.models.BlockStats
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document
import org.ethereum.core.BlockSummary

class BlockMongoSink : MongoSink<Long, Pair<BlockSummary, BlockStats>>() {

  private val unclesCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("uncles") }
  private val blocksCollection: MongoCollection<Document>by lazy { mongoDB.getCollection("blocks") }
  private val transactionsCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("transactions") }

  override val batchSize = 10
  private val batch = ArrayList<Pair<BlockSummary, BlockStats>>()

  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext?) {
    super.init(context)
    this.scheduledWrite = context?.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: Long?, value: Pair<BlockSummary, BlockStats>?) {

    batch.add(value!!)

    if(batch.size == batchSize) {
      tryToWrite()
    }

  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) { return }

    val startMs = System.currentTimeMillis()

    val (blocksOps, txsOps, unclesOps) = batch.map { pair ->

      val summary = pair.first
      val blockStats = pair.second

      val block = summary.block
      val receipts = summary.receipts

      // Mongo
      val replaceOptions = ReplaceOptions().upsert(true)

      // Blocks
      val blockQuery = Document(mapOf("number" to block.number))
      val blockUpdate = block.toDocument(summary, blockStats)

      val blockReplace = ReplaceOneModel(blockQuery, blockUpdate, replaceOptions)

      // Transactions
      var txsReplace = listOf<ReplaceOneModel<Document>>()

      receipts.forEachIndexed { i, receipt ->
        val txId = Document(mapOf("_id" to receipt.transaction.hash.toHex()))
        val txDoc = receipt.transaction.toDocument(i, summary, receipt)
        txsReplace += ReplaceOneModel(txId, txDoc, replaceOptions)
      }

      val unclesReplace = block.uncleList.map { u ->
        val hash = u.hash.toHex()
        val query = Document(mapOf("_id" to hash))
        ReplaceOneModel(query, u.toDocument(summary), replaceOptions)
      }

      Tuple3(listOf(blockReplace), txsReplace, unclesReplace)
    }.reduce{ sum, element -> Tuple3(sum.a + element.a, sum.b + element.b, sum.c + element.c) }

    mongoSession?.transaction {

      blocksCollection.bulkWrite(blocksOps)

      if (txsOps.isNotEmpty()) {
        transactionsCollection.bulkWrite(txsOps)
      }
      if (unclesOps.isNotEmpty()) {
        unclesCollection.bulkWrite(unclesOps)
      }

    }.also {
      when {
        it!!.isLeft() -> {

          context?.commit()

          val elapsedMs = System.currentTimeMillis() - startMs
          logger.info{ "${batch.size} blocks stored in $elapsedMs ms"}

          batch.clear()

        }
        it.isRight() -> {
          // TODO handle error
          logger.error{ "Failed to store blocks. ${it.right()}"}
        }
      }
    }

  }

  override fun close() {
    this.running = false
    scheduledWrite?.cancel()
    mongoSession?.close()
  }

}
