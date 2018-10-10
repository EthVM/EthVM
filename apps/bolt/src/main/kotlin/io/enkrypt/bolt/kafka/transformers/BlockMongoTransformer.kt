package io.enkrypt.bolt.kafka.transformers

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.BulkWriteOptions
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import io.enkrypt.bolt.extensions.toDocument
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document
import org.ethereum.core.BlockSummary

class BlockMongoTransformer : MongoTransformer<Long, BlockSummary>() {

  private val blocksCollection: MongoCollection<Document>by lazy {
    mongoDB.getCollection(config.mongo.blocksCollection)
  }

  override val batchSize = 50
  private val batch = ArrayList<BlockSummary>()

  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun transform(key: Long?, value: BlockSummary?): KeyValue<Long, BlockSummary>? {

    batch.add(value!!)

    if (batch.size == batchSize) {
      tryToWrite()
    }

    // we will forward later
    return null
  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val blocksOps = batch.map { summary ->

      val block = summary.block

      // Mongo
      val replaceOptions = ReplaceOptions().upsert(true)

      // Blocks
      val blockQuery = Document(mapOf("_id" to block.number))
      val blockUpdate = block.toDocument(summary)

      ReplaceOneModel(blockQuery, blockUpdate, replaceOptions)
    }

    try {

      val bulkOptions = BulkWriteOptions().ordered(false)
      blocksCollection.bulkWrite(blocksOps, bulkOptions)

      // forward to downstream processors and commit
      batch.forEach { b -> context.forward(b.block.number, b) }

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} blocks stored in $elapsedMs ms" }

      batch.clear()

    } catch (e: Exception) {

      // TODO handle error
      logger.error { "Failed to store blocks. $e" }

    }

  }

  override fun close() {
    this.running = false
    scheduledWrite?.cancel()
//    mongoSession.close()
  }

}
