package io.enkrypt.bolt.sinks

import arrow.core.Tuple4
import arrow.core.right
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.extensions.transaction
import io.enkrypt.bolt.models.BlockStats
import io.enkrypt.bolt.models.Contract
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document
import org.ethereum.core.BlockSummary

class BlockMongoSink : MongoSink<Long, Triple<BlockSummary, Set<Contract>, BlockStats>>() {

  private val blocksCollection: MongoCollection<Document>by lazy { mongoDB.getCollection("blocks") }
  private val transactionsCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("transactions") }
  private val unclesCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("uncles") }
  private val accountsCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("accounts") }

  override val batchSize = 10
  private val batch: MutableList<Triple<BlockSummary, Set<Contract>, BlockStats>> = ArrayList()

  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: Long?, value: Triple<BlockSummary, Set<Contract>, BlockStats>?) {
    batch.add(value!!)
    if (batch.size == batchSize) {
      tryToWrite()
    }
  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val (blocksOps, txsOps, unclesOps, contractsOps) = batch.asSequence().map { pair ->

      val summary = pair.first
      val contracts = pair.second
      val blockStats = pair.third

      val block = summary.block
      val receipts = summary.receipts

      // Mongo
      val replaceOptions = ReplaceOptions().upsert(true)
      val updateOptions = UpdateOptions().upsert(true)

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

      // Uncles
      val unclesReplace = block.uncleList.map { u ->
        val hash = u.hash.toHex()
        val query = Document(mapOf("_id" to hash))
        ReplaceOneModel(query, u.toDocument(summary), replaceOptions)
      }

      // Contracts
      var contractsUpdate = listOf<UpdateOneModel<Document>>()

      contracts.forEach { c ->
        val address = c.address
        val filter = Document(mapOf("_id" to address.toHex()))
        val update = Document(mapOf("\$set" to c.toDocument()))
        contractsUpdate += UpdateOneModel(filter, update, updateOptions)
      }

      Tuple4(listOf(blockReplace), txsReplace, unclesReplace, contractsUpdate)
    }.reduce { sum, element ->
      Tuple4(sum.a + element.a, sum.b + element.b, sum.c + element.c, sum.d + element.d)
    }
    mongoSession.transaction {

      blocksCollection.bulkWrite(blocksOps)

      if (txsOps.isNotEmpty()) {
        transactionsCollection.bulkWrite(txsOps)
      }

      if (unclesOps.isNotEmpty()) {
        unclesCollection.bulkWrite(unclesOps)
      }

      if (contractsOps.isNotEmpty()) {
        accountsCollection.bulkWrite(contractsOps)
      }
    }.also {
      when {
        it.isLeft() -> {

          context.commit()

          val elapsedMs = System.currentTimeMillis() - startMs
          logger.info { "${batch.size} blocks stored in $elapsedMs ms" }

          batch.clear()
        }
        it.isRight() -> {
          // TODO handle error
          logger.error { "Failed to store blocks. ${it.right()}" }
        }
      }
    }

  }

  override fun close() {
    this.running = false
    scheduledWrite?.cancel()
    mongoSession.close()
  }

}
