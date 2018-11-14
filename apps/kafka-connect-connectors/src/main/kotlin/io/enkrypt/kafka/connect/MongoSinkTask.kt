package io.enkrypt.kafka.connect

import arrow.core.Either
import arrow.core.getOrHandle
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.result.UpdateResult
import com.mongodb.reactivestreams.client.MongoClient
import com.mongodb.reactivestreams.client.MongoClients
import com.mongodb.reactivestreams.client.MongoCollection
import com.mongodb.reactivestreams.client.MongoDatabase
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.sink.SinkRecord
import org.apache.kafka.connect.sink.SinkTask
import org.bson.BsonDocument
import org.bson.BsonInt64
import org.reactivestreams.Publisher
import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.TimeoutException
import java.util.concurrent.atomic.AtomicInteger

class MongoSinkTask : SinkTask() {

  private lateinit var client: MongoClient
  private lateinit var db: MongoDatabase

  private lateinit var blocksCollection: MongoCollection<BsonDocument>
  private lateinit var accountsCollection: MongoCollection<BsonDocument>

  override fun version() = "0.0.1"    // TODO load from resources

  private var updatesSubscriber = UpdatesSubscriber()

  override fun start(props: MutableMap<String, String>?) {

    val uri = MongoSinkConfig.mongoUri(props)

    client = MongoClients.create(uri)
    db = client.getDatabase(uri)

    blocksCollection = db.getCollection("blocks", BsonDocument::class.java)
    accountsCollection = db.getCollection("accounts", BsonDocument::class.java)

  }

  override fun stop() {
    client.close()
  }

  override fun put(records: MutableCollection<SinkRecord>) {

    records.forEach{

      when(it.topic()) {
        "blocks" -> writeBlock(it).subscribe(updatesSubscriber)
        else -> throw IllegalStateException("Unhandled topic: " + it.topic())
      }

    }

  }

  override fun flush(currentOffsets: MutableMap<TopicPartition, OffsetAndMetadata>?) {

    val results = updatesSubscriber.await()

    results.forEach{ if(it.isLeft()) it.getOrHandle { throw it } }

    updatesSubscriber = UpdatesSubscriber()

  }

  private fun writeBlock(record: SinkRecord): Publisher<UpdateResult> {

    val keySchema = record.keySchema()
    if(keySchema.type() != Schema.Type.INT64) throw IllegalArgumentException("Key schema must be a long")

    val valueSchema = record.valueSchema()
    if(valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value schema must be a struct")

    val filter = BsonDocument().apply {
      append("_id", BsonInt64(record.key() as Long))
    }

    val value = StructToBsonConverter.convert(record.value() as Struct)

    return blocksCollection.replaceOne(filter, value, replaceOptions)
  }

  companion object {

    val replaceOptions = ReplaceOptions().upsert(true)

  }

}

class UpdatesSubscriber(private val timeoutMs: Long = 30000) : Subscriber<UpdateResult> {

  private val count = AtomicInteger(0)
  private var results = CopyOnWriteArrayList<Either<Throwable, UpdateResult>>()

  private var awaitStartMs: Long = 0L

  fun await(): List<Either<Throwable, UpdateResult>> {

    awaitStartMs = System.currentTimeMillis()

    while(count.get() != results.size) {
      val elapsedMs = System.currentTimeMillis() - awaitStartMs
      if(elapsedMs >= timeoutMs)
        throw TimeoutException()
      else
        Thread.sleep(100)
    }

    return results;
  }

  override fun onComplete() {
  }

  override fun onSubscribe(s: Subscription) {
    s.request(1)
    count.incrementAndGet()
  }

  override fun onNext(t: UpdateResult) {
    results.add(Either.Right(t))
  }

  override fun onError(t: Throwable) {
    results.add(Either.Left(t))
  }


}
