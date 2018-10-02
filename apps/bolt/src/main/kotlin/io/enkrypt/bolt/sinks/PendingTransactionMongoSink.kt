package io.enkrypt.bolt.sinks

import arrow.core.right
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.WriteModel
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.transaction
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document
import org.ethereum.core.Transaction

class PendingTransactionMongoSink : MongoSink<String, Transaction?>() {

  private val accountsCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("pending_transactions") }

  override val batchSize = 100

  private val batch = ArrayList<Pair<String, Transaction?>>()
  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: String, value: Transaction?) {
    batch.add(Pair(key, value))
    if (batch.size == batchSize) {
      tryToWrite()
    }
  }

  private fun tryToWrite() {
    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val ops = batch.map<Pair<String, Transaction?>, WriteModel<Document>> { pair ->
      val hash = pair.first
      val txn = pair.second

      val filter = Document(mapOf("_id" to hash))
      val replaceOptions = ReplaceOptions().upsert(true)

      if (txn == null) {
        DeleteOneModel<Document>(filter)
      } else {
        ReplaceOneModel(filter, txn.toDocument(), replaceOptions)
      }
    }

    mongoSession.transaction {
      accountsCollection.bulkWrite(ops)
    }.also {
      when {
        it.isLeft() -> {
          context.commit()

          val elapsedMs = System.currentTimeMillis() - startMs
          logger.info { "${batch.size} pending transactions updated in $elapsedMs ms" }

          batch.clear()
        }
        it.isRight() -> {
          // TODO handle error
          logger.error { "Failed to update pending transactions. ${it.right()}" }
        }
      }
    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
    mongoSession.close()
  }

}
