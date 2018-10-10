package io.enkrypt.bolt.kafka

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.WriteModel
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.kafka.models.Account
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document

class AccountMongoSink : MongoSink<String, Account>() {

  private val accountsCollection: MongoCollection<Document> by lazy { mongoDB.getCollection("accounts") }

  override val batchSize = 100

  private val batch = ArrayList<Account>()
  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: String, value: Account) {
    batch.add(value)
    if (batch.size == batchSize) {
      tryToWrite()
    }
  }

  private fun tryToWrite() {
    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val ops = batch.map<Account, WriteModel<Document>> { account ->
      val filter = Document(mapOf("_id" to account.address.toHex()))
      val replaceOptions = ReplaceOptions().upsert(true)

      if (account.isEmpty) {
        DeleteOneModel<Document>(filter)
      } else {
        ReplaceOneModel(filter, account.toDocument(), replaceOptions)
      }
    }

    try {

      accountsCollection.bulkWrite(ops)

      context.commit()

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} accounts updated in $elapsedMs ms" }

      batch.clear()

    } catch (e: Exception) {
      logger.error { "Failed to update accounts. $e" }
    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}
