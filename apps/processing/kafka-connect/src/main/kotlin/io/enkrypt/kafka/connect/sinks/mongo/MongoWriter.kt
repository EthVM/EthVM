package io.enkrypt.kafka.connect.sinks.mongo

import com.mongodb.ConnectionString
import com.mongodb.MongoSocketException
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.WriteModel
import mu.KotlinLogging
import org.apache.kafka.connect.errors.ConnectException
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.sink.SinkRecord
import org.bson.BsonDocument
import java.util.concurrent.Callable
import java.util.concurrent.ExecutionException
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException
import java.util.concurrent.atomic.AtomicInteger

class MongoWriter {

  private val logger = KotlinLogging.logger {}

  private val recordBatchSize = 50
  private val maxBatchesInFlight = 5
  private val batchesInFlight = AtomicInteger(0)

  private var collections: Map<MongoCollections, MongoCollection<BsonDocument>> = emptyMap()
  private var pendingWrites: List<Future<*>> = emptyList()

  private var db: MongoDatabase? = null
  private var executor: ExecutorService? = null

  fun addTopics(topics: Set<String>) {
    logger.info { "Adding topics: $topics" }
    collections = collections + topics
      .map { MongoCollections.forTopic(it)!! }
      .map { it to db!!.getCollection(it.id, BsonDocument::class.java) }
  }

  fun start(client: MongoClient, connectionString: ConnectionString) {
    db = client.getDatabase(connectionString.database!!)
    executor = Executors.newSingleThreadExecutor()
    logger.info { "Started" }
  }

  fun put(records: MutableCollection<SinkRecord>) {

    val currentInFlight =
      records.chunked(recordBatchSize)
      .map { batch ->

        if (batchesInFlight.get() == maxBatchesInFlight) {
          wait(60, TimeUnit.SECONDS)
        }

        pendingWrites = pendingWrites + executor!!.submit(BulkWriteTask(batch))
        batchesInFlight.incrementAndGet()
      }.lastOrNull()

    if (currentInFlight != null) {
      logger.trace { "${records.size} records accepted, requests in flight = $currentInFlight" }
    }
  }

  private fun wait(timeout: Long, unit: TimeUnit) {

    // wait in 100 ms increments
    val timeoutMs = unit.toMillis(timeout)
    val intervalMs = 100L
    var elapsedMs = 0L

    do {
      Thread.sleep(intervalMs)
      elapsedMs += intervalMs
    } while (batchesInFlight.get() == maxBatchesInFlight && elapsedMs < timeoutMs)

    if (batchesInFlight.get() == maxBatchesInFlight) {
      throw RetriableException(TimeoutException("In flight requests has not reduced during configured wait time of $timeoutMs"))
    }
  }

  fun flush() {
    try {
      logger.trace { "Flushing" }
      pendingWrites.forEach { it.get(10, TimeUnit.SECONDS) }
      logger.trace { "Flush completed without exceptions" }
    } catch (e: ExecutionException) {

      when (e.cause) {
        is MongoSocketException -> throw RetriableException("Mongo disconnect", e)
        else -> throw ConnectException("Terminal Write failure", e)
      }
    } catch (e: TimeoutException) {
      throw RetriableException("Write timeout", e)
    } catch (e: InterruptedException) {
      throw ConnectException("Write interrupted", e)
    } finally {
      pendingWrites = emptyList()
    }
  }

  fun stop() {
    executor?.shutdown()
    executor?.awaitTermination(30, TimeUnit.SECONDS)
    logger.info { "Stopped" }
  }

  inner class BulkWriteTask(private val records: List<SinkRecord>) : Callable<Int> {

    override fun call(): Int {

      val batch = mutableMapOf<MongoCollections, List<WriteModel<BsonDocument>>>()

      logger.trace { "Processing ${records.size} records" }

      records.forEach { record ->
        TopicWriteGenerators.forTopic(record.topic())(record)
          .forEach { (collection, writes) ->
            val mergedWrites = batch.getOrDefault(collection, emptyList()) + writes
            batch += collection to mergedWrites
          }
      }

      batch
        .filterValues { it.isNotEmpty() }
        .map { (collectionId, writes) -> Pair(collectionId, writes.chunked(chunkSizeFor(collectionId))) }
        .forEach { pair ->

          val collectionId = pair.first
          val collection = collections.getValue(collectionId)
          val chunks = pair.second

          logger.trace { "Processing chunk size = ${chunks.size} for collection = $collectionId" }

          chunks.forEach {
            val bulkWrite = collection.bulkWrite(it)
            logger.trace {
              "Chunk write complete. Collection = $collectionId, ins = ${bulkWrite.insertedCount}, " +
                "upd = ${bulkWrite.modifiedCount}, ups = ${bulkWrite.upserts.size}, " +
                "del = ${bulkWrite.deletedCount}"
            }
          }
        }

      // reduce the number of inflight requests
      batchesInFlight.decrementAndGet()

      return records.size
    }
  }

  companion object {

    private val chunkSizeMap = mapOf(
      MongoCollections.Blocks to 20
    )

    fun chunkSizeFor(collectionId: MongoCollections, defaultSize: Int = 100) =
      chunkSizeMap.getOrDefault(collectionId, defaultSize)
  }
}
