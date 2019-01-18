package io.enkrypt.kafka.connect.sinks.mongo

import com.mongodb.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.WriteModel
import io.enkrypt.common.extensions.hex
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Blocks
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Transactions
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Uncles
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Contracts
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Balances
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.PendingTransactions
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.TokenTransfers
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.AggregateBlockMetrics
import io.enkrypt.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.sink.SinkRecord
import org.apache.kafka.connect.sink.SinkTask
import org.bson.BsonDecimal128
import org.bson.BsonDocument
import org.bson.BsonString
import org.bson.Document
import org.bson.types.Decimal128
import kotlin.system.measureTimeMillis

class MongoSinkTask : SinkTask() {

  private val logger = KotlinLogging.logger {}

  private var client: MongoClient? = null
  private lateinit var db: MongoDatabase
  private lateinit var collections: Map<MongoCollections, MongoCollection<BsonDocument>>

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    val uri = MongoSinkConnector.Config.mongoUri(props)
    val databaseName = uri.database ?: throw IllegalArgumentException("Mongo URI does not contain a database name!")
    client = MongoClient(uri)
    db = client!!.getDatabase(databaseName)

    val clazz = BsonDocument::class.java
    collections = mapOf<MongoCollections, MongoCollection<BsonDocument>>(
      Blocks to db.getCollection(Blocks.id, clazz),
      Transactions to db.getCollection(Transactions.id, clazz),
      Uncles to db.getCollection(Uncles.id, clazz),
      Contracts to db.getCollection(Contracts.id, clazz),
      TokenTransfers to db.getCollection(TokenTransfers.id, clazz),
      Balances to db.getCollection(Balances.id, clazz),
      PendingTransactions to db.getCollection(PendingTransactions.id, clazz),
      AggregateBlockMetrics to db.getCollection(AggregateBlockMetrics.id, clazz)
    )
  }

  override fun stop() {
    client?.close()
  }

  override fun put(records: MutableCollection<SinkRecord>) {

    // TODO use mongo transactions

    logger.info { "Processing ${records.size} records" }

    val elapsedMs = measureTimeMillis {

      var batch = mapOf<MongoCollections, List<WriteModel<BsonDocument>>>()

      records.forEach { record ->
        KafkaTopics.forTopic(record.topic())(record)
          .forEach { (collection, writes) ->
            val mergedWrites = batch.getOrDefault(collection, emptyList()) + writes
            batch += collection to mergedWrites
          }
      }

      batch
        .filterValues { it.isNotEmpty() }
        .forEach { (collectionId, writes) ->

          val collection = collections[collectionId]!!
          val bulkWrite = collection.bulkWrite(writes)

          logger.debug {
            "Bulk write complete. Collection = $collectionId, inserts = ${bulkWrite.insertedCount}, " +
              "updates = ${bulkWrite.modifiedCount}, upserts = ${bulkWrite.upserts.size}, " +
              "deletes = ${bulkWrite.deletedCount}"
          }
        }
    }

    logger.info { "Batch processing completed in $elapsedMs ms" }
  }

  override fun flush(currentOffsets: MutableMap<TopicPartition, OffsetAndMetadata>?) {
  }

  companion object {

    val updateOptions: UpdateOptions = UpdateOptions().upsert(true)
    val replaceOptions: ReplaceOptions = ReplaceOptions().upsert(true)
  }
}

enum class MongoCollections(val id: String) {
  Blocks("blocks"),
  AggregateBlockMetrics("aggregate_block_metrics"),
  Uncles("uncles"),
  Transactions("transactions"),
  Contracts("contracts"),
  TokenTransfers("token_transfers"),
  Balances("balances"),
  PendingTransactions("pending_transactions")
}

typealias SinkRecordToBsonFn = (record: SinkRecord) -> Map<MongoCollections, List<WriteModel<BsonDocument>>>

enum class KafkaTopics(
  private val id: String,
  private val convertFn: SinkRecordToBsonFn
) {

  Blocks("blocks", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val blockNumber = (record.key() as Struct).getBytes("number").unsignedBigInteger()
    val blockNumberBson = BsonDecimal128(Decimal128(blockNumber.toBigDecimal()))

    val blockFilter = BsonDocument().apply { append("_id", blockNumberBson) }

    val blockWrite = when (record.value()) {
      null -> DeleteOneModel<BsonDocument>(blockFilter)
      else -> {
        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }
        val valueBson = StructToBsonConverter.convert(record.value() as Struct, "block")
        ReplaceOneModel(blockFilter, valueBson, MongoSinkTask.replaceOptions)
      }
    }

    mapOf(MongoCollections.Blocks to listOf(blockWrite))
  }),

  Transactions("transactions", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val key = StructToBsonConverter.convert(record.key(), "transactionKey")
    val idFilter = BsonDocument("_id", key["txHash"])

    val txWrites = when (record.value()) {
      null -> listOf(DeleteOneModel<BsonDocument>(idFilter))
      else -> {

        val value = StructToBsonConverter.convert(record.value(), "transaction")
        listOf(ReplaceOneModel(idFilter, value, MongoSinkTask.replaceOptions))
      }
    }

    mapOf(MongoCollections.Transactions to txWrites)
  }),

  Uncles("uncles", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val key = StructToBsonConverter.convert(record.key(), "uncleKey")
    val idFilter = BsonDocument("_id", key["uncleHash"])

    val uncleWrites = when (record.value()) {
      null -> listOf(DeleteOneModel<BsonDocument>(idFilter))
      else -> {
        val value = StructToBsonConverter.convert(record.value(), "blockHeader")
        listOf(ReplaceOneModel(idFilter, value, MongoSinkTask.replaceOptions))
      }
    }

    mapOf(MongoCollections.Uncles to uncleWrites)
  }),

  TokenTransfers("token-transfers", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val id = StructToBsonConverter.convert(record.key() as Struct, "tokenTransfer")

    writes += if (record.value() == null) {

      // remove
      val filter = BsonDocument("_id", id)
      DeleteOneModel<BsonDocument>(filter)
    } else {

      val model = StructToBsonConverter
        .convert(record.value(), "tokenTransfer")
        .apply {
          append("_id", id)
        }

      ReplaceOneModel(BsonDocument("_id", id), model, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.TokenTransfers to writes)
  }),

  ContractCreations("contract-creations", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // TODO determine how to handle tombstones in light of merging with data from ethlists
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct
      val bson = BsonDocument().apply {
        append("\$set", StructToBsonConverter.convert(struct, "contract"))
      }

      writes += UpdateOneModel(idFilter, bson, MongoSinkTask.updateOptions)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractDestructions("contract-destructions", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need unset the suicide in the contract object
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "destructed")))
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct

      val bson = BsonDocument().apply {
        append("\$set", BsonDocument().apply { append("destructed", StructToBsonConverter.convert(struct, "contract")) })
      }

      writes += UpdateOneModel(idFilter, bson)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractMetadata("contract-metadata", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "metadata")))
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct
      val metadataBson = StructToBsonConverter.convert(struct, "contract")

      val typeBson = metadataBson.remove("type")
      metadataBson.remove("address")

      val bsonValue = BsonDocument().apply {
        append("address", addressBson)
        append("type", typeBson)
        append("metadata", metadataBson)
      }

      val bson = BsonDocument().apply {
        append("\$set", bsonValue)
      }

      writes += UpdateOneModel(idFilter, bson, MongoSinkTask.updateOptions)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  Balances("balances", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "balanceId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct

      var bson = StructToBsonConverter.convert(struct, "balance")

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.Balances to writes)
  }),

  PendingTransactions("pending-transactions", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "transactionId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct
      var bson = StructToBsonConverter.convert(struct, "transaction")

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.PendingTransactions to writes)
  }),

  BlockMetricsByBlock("block-metrics-by-block", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val blockNumber = (record.key() as Struct).getBytes("number").unsignedBigInteger()
    val blockNumberBson = BsonDecimal128(Decimal128(blockNumber.toBigDecimal()))
    val idFilter = BsonDocument("_id", blockNumberBson)

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "metrics")))

    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as org.apache.kafka.connect.data.Struct
      val bson = BsonDocument("\$set", BsonDocument("metrics", StructToBsonConverter.convert(struct, "block-metrics")))

      writes += UpdateOneModel(idFilter, bson, MongoSinkTask.updateOptions)
    }

    mapOf(MongoCollections.Blocks to writes)

  }),

  AggregateBlockMetrics("aggregate-block-metrics-by-day", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "metricId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as org.apache.kafka.connect.data.Struct
      var bson = StructToBsonConverter.convert(struct, "metric", false)

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.AggregateBlockMetrics to writes)
  });

  companion object {

    fun forTopic(topic: String): SinkRecordToBsonFn =
      values().find { it.id == topic }?.convertFn ?: throw IllegalStateException("Unhandled topic: $topic")
  }
}
