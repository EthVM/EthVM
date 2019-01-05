package io.enkrypt.kafka.connect.sinks.mongo

import com.mongodb.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.DeleteManyModel
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.WriteModel
import io.enkrypt.common.extensions.hex
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Accounts
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.BlockStatistics
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Blocks
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Contracts
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.FungibleBalances
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.NonFungibleBalances
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.PendingTransactions
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.Transactions
import io.enkrypt.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.sink.SinkRecord
import org.apache.kafka.connect.sink.SinkTask
import org.bson.BsonBinary
import org.bson.BsonDocument
import org.bson.BsonString
import org.bson.Document
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
      Accounts to db.getCollection(Accounts.id, clazz),
      Transactions to db.getCollection(Transactions.id, clazz),
      Contracts to db.getCollection(Contracts.id, clazz),
      FungibleBalances to db.getCollection(FungibleBalances.id, clazz),
      NonFungibleBalances to db.getCollection(NonFungibleBalances.id, clazz),
      PendingTransactions to db.getCollection(PendingTransactions.id, clazz),
      BlockStatistics to db.getCollection(BlockStatistics.id, clazz)
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

      records.forEach { r -> batch += KafkaTopics.forTopic(r.topic())(r) }

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
  BlockStatistics("block_statistics"),
  Accounts("accounts"),
  Transactions("transactions"),
  Contracts("contracts"),
  FungibleBalances("fungible_balances"),
  NonFungibleBalances("non_fungible_balances"),
  PendingTransactions("pending_transactions")
}

typealias SinkRecordToBsonFn = (record: SinkRecord) -> Map<MongoCollections, List<WriteModel<BsonDocument>>>

enum class KafkaTopics(
  private val id: String,
  private val convertFn: SinkRecordToBsonFn
) {

  Blocks("blocks", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    var blockWrites = listOf<WriteModel<BsonDocument>>()
    var txWrites = listOf<WriteModel<BsonDocument>>()

    val blockNumber = (record.key() as Struct).getBytes("number")
    val blockNumberBson = BsonBinary(blockNumber)

    val blockFilter = BsonDocument().apply { append("_id", blockNumberBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      blockWrites += DeleteOneModel(blockFilter)

      // delete transactions as-well
      val txsFilter = BsonDocument().apply { append("blockNumber", blockNumberBson) }
      txWrites += DeleteManyModel(txsFilter)
    } else {

      val valueBson = StructToBsonConverter.convert(record.value() as Struct)

      blockWrites += ReplaceOneModel(blockFilter, valueBson, MongoSinkTask.Companion.replaceOptions)

      val txReceiptsBson = valueBson.getArray("transactions")

      txWrites += txReceiptsBson
        .map { it as BsonDocument }
        .map {

          val txHash = it.getString("hash")

          // drop and replace

          val update = UpdateOneModel<BsonDocument>(
            Document(mapOf(
              "from" to it.getString("from"),
              "nonce" to it.getString("nonce"))
            ),
            Document(mapOf(
              "\$set" to mapOf("replacedBy" to txHash),
              "\$unset" to mapOf("blockNumber" to 1)
            ))
          )

          val doc = it.append("blockNumber", blockNumberBson)

          val replace = ReplaceOneModel(org.bson.BsonDocument("_id", txHash), doc, MongoSinkTask.replaceOptions)

          listOf(update, replace)
        }.flatten()
    }

    mapOf(MongoCollections.Blocks to blockWrites, MongoCollections.Transactions to txWrites)
  }),

  ContractCreations("contract-creations", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // TODO determine how to handle tombstones in light of merging with data from ethlists
    } else {

      val struct = record.value() as Struct
      val bson = BsonDocument().apply {
        append("\$set", StructToBsonConverter.convert(struct))
      }

      writes += UpdateOneModel(idFilter, bson, MongoSinkTask.updateOptions)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractDestructions("contract-destructions", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need unset the suicide in the contract object
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "destructed")))
    } else {

      val struct = record.value() as Struct

      val bson = BsonDocument().apply {
        append("\$set", BsonDocument().apply { append("destructed", StructToBsonConverter.convert(struct)) })
      }

      writes += UpdateOneModel(idFilter, bson)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractMetadata("contract-metadata", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "metadata")))
    } else {

      val struct = record.value() as Struct
      val bson = BsonDocument().apply {
        append("\$set", BsonDocument().apply { append("metadata", StructToBsonConverter.convert(struct)) })
      }

      writes += UpdateOneModel(idFilter, bson, MongoSinkTask.updateOptions)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  FungibleTokenBalances("fungible-token-balances", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("key must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, false)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      val struct = record.value() as Struct

      var bson = StructToBsonConverter.convert(struct)

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.FungibleBalances to writes)
  }),

  NonFungibleTokenBalances("non-fungible-token-balances", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, false)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      val struct = record.value() as Struct

      var bson = StructToBsonConverter.convert(struct)

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.NonFungibleBalances to writes)
  }),

  PendingTransactions("pending-transactions", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      val struct = record.value() as Struct
      var bson = StructToBsonConverter.convert(struct)

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.PendingTransactions to writes)
  }),

  BlockStatistics("block-statistics", { record: SinkRecord ->

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      val struct = record.value() as org.apache.kafka.connect.data.Struct
      var bson = StructToBsonConverter.convert(struct, false)

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.BlockStatistics to writes)
  });

  companion object {

    fun forTopic(topic: String): SinkRecordToBsonFn =
      values().find { it.id == topic }?.convertFn ?: throw IllegalStateException("Unhandled topic: $topic")
  }
}
