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

class MongoSinkTask : SinkTask() {

  private val logger = KotlinLogging.logger {}

  private lateinit var client: MongoClient
  private lateinit var db: MongoDatabase

  private var collectionsMap = mapOf<MongoCollections, MongoCollection<BsonDocument>>()

  override fun version() = Versions.of("/mongo-sink-version.properties")

  override fun start(props: MutableMap<String, String>) {

    val uri = MongoSinkConnector.Config.mongoUri(props)

    client = MongoClient(uri)
    db = client.getDatabase(uri.database!!)

    collectionsMap += MongoCollections.Blocks to db.getCollection(
      MongoCollections.Blocks.name,
      BsonDocument::class.java
    )
    collectionsMap += MongoCollections.Accounts to db.getCollection(
      MongoCollections.Accounts.name,
      BsonDocument::class.java
    )
    collectionsMap += MongoCollections.Transactions to db.getCollection(
      MongoCollections.Transactions.name,
      BsonDocument::class.java
    )
    collectionsMap += MongoCollections.Contracts to db.getCollection(
      MongoCollections.Contracts.name,
      BsonDocument::class.java
    )
    collectionsMap += MongoCollections.FungibleBalances to db.getCollection(
      MongoCollections.FungibleBalances.name,
      BsonDocument::class.java
    )
    collectionsMap += MongoCollections.NonFungibleBalances to db.getCollection(
      MongoCollections.NonFungibleBalances.name,
      BsonDocument::class.java
    )
    collectionsMap += MongoCollections.PendingTransactions to db.getCollection(
      MongoCollections.PendingTransactions.name,
      BsonDocument::class.java
    )
    collectionsMap += MongoCollections.BlockStatistics to db.getCollection(
      MongoCollections.BlockStatistics.name,
      BsonDocument::class.java
    )
  }

  override fun stop() {
    client.close()
  }

  override fun put(records: MutableCollection<SinkRecord>) {

    // TODO use mongo transactions

    logger.info { "Processing ${records.size} records" }

    val startMs = System.currentTimeMillis()

    var batch = mapOf<MongoCollections, List<WriteModel<BsonDocument>>>()

    records.forEach {

      val writesMap = when (it.topic()) {
        "blocks" -> processBlock(it)
        "contract-creations" -> processContractCreate(it)
        "contract-destructions" -> processContractDestruct(it)
        "fungible-token-balances" -> processFungibleTokenBalance(it)
        "non-fungible-token-balances" -> processNonFungibleTokenBalance(it)
        "pending-transactions" -> processPendingTransaction(it)
        "block-statistics" -> processBlockStatistic(it)
        "contract-metadata" -> processContractMetadata(it)
        else -> throw IllegalStateException("Unhandled topic: " + it.topic())
      }

      writesMap.forEach { (topicId, writesForCollection) ->
        batch += topicId to batch.getOrDefault(topicId, emptyList()) + writesForCollection
      }
    }

    batch
      .filterValues { it.isNotEmpty() }
      .forEach { (collectionId, writes) ->

        val collection = collectionsMap[collectionId]!!
        val bulkWrite = collection.bulkWrite(writes)

        logger.debug {
          "Bulk write complete. Collection = $collectionId, inserts = ${bulkWrite.insertedCount}, " +
            "updates = ${bulkWrite.modifiedCount}, upserts = ${bulkWrite.upserts.size}, " +
            "deletes = ${bulkWrite.deletedCount}"
        }
      }

    val elapsedMs = System.currentTimeMillis() - startMs

    logger.info { "Batch processing completed in $elapsedMs ms" }
  }

  override fun flush(currentOffsets: MutableMap<TopicPartition, OffsetAndMetadata>?) {
  }

  private fun processBlock(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a long")

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

      blockWrites += ReplaceOneModel(
        blockFilter, valueBson,
        replaceOptions
      )

      val txReceiptsBson = valueBson
        .getArray("transactions")

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

          //

          val doc = it
            .append("blockNumber", blockNumberBson)

          val replace = ReplaceOneModel(
            BsonDocument("_id", txHash), doc,
            replaceOptions
          )

          listOf(update, replace)
        }.flatten()
    }

    return mapOf(
      MongoCollections.Blocks to blockWrites,
      MongoCollections.Transactions to txWrites
    )
  }

  private fun processContractCreate(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // TODO determine how to handle tombstones in light of merging with data from ethlists
    } else {

      val struct = record.value() as Struct
      val bson = BsonDocument()
        .apply {
          append("\$set", StructToBsonConverter.convert(struct))
        }

      writes += UpdateOneModel(
        idFilter, bson,
        updateOptions
      )
    }

    return mapOf(MongoCollections.Contracts to writes)
  }

  private fun processContractMetadata(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

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
      val bson = BsonDocument()
        .apply {
          append("\$set", BsonDocument()
            .apply { append("metadata", StructToBsonConverter.convert(struct)) })
        }

      writes += UpdateOneModel(
        idFilter, bson,
        updateOptions
      )
    }

    return mapOf(MongoCollections.Contracts to writes)
  }

  private fun processContractDestruct(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be binary")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need unset the suicide in the contract object
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "destructed")))
    } else {

      val struct = record.value() as Struct

      val bson = BsonDocument()
        .apply {
          append("\$set", BsonDocument()
            .apply { append("destructed", StructToBsonConverter.convert(struct)) })
        }

      writes += UpdateOneModel(idFilter, bson)
    }

    return mapOf(MongoCollections.Contracts to writes)
  }

  private fun processFungibleTokenBalance(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

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

      writes += ReplaceOneModel(
        idFilter, bson,
        replaceOptions
      )
    }

    return mapOf(MongoCollections.FungibleBalances to writes)
  }

  private fun processNonFungibleTokenBalance(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

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

      writes += ReplaceOneModel(
        idFilter, bson,
        replaceOptions
      )
    }

    return mapOf(MongoCollections.NonFungibleBalances to writes)
  }

  private fun processPendingTransaction(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

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

      writes += ReplaceOneModel(
        idFilter, bson,
        replaceOptions
      )
    }

    return mapOf(MongoCollections.PendingTransactions to writes)
  }

  private fun processBlockStatistic(record: SinkRecord): Map<MongoCollections, List<WriteModel<BsonDocument>>> {

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
      var bson = StructToBsonConverter.convert(struct, false)

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(
        idFilter, bson,
        replaceOptions
      )
    }

    return mapOf(MongoCollections.BlockStatistics to writes)
  }

  companion object {

    val updateOptions: UpdateOptions = UpdateOptions().upsert(true)
    val replaceOptions: ReplaceOptions = ReplaceOptions().upsert(true)
  }
}

enum class MongoCollections(name: String) {
  Blocks("blocks"),
  BlockStatistics("block_statistics"),
  Accounts("accounts"),
  Transactions("transactions"),
  Contracts("contracts"),
  FungibleBalances("fungible_balances"),
  NonFungibleBalances("non_fungible_balances"),
  PendingTransactions("pending_transactions")
}
