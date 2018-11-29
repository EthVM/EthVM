package io.enkrypt.kafka.connect.sinks

import com.mongodb.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.*
import io.enkrypt.kafka.connect.StructToBsonConverter
import io.enkrypt.kafka.connect.toHex
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.sink.SinkRecord
import org.apache.kafka.connect.sink.SinkTask
import org.bson.*

enum class CollectionId {

  Blocks, Accounts, Transactions, Contracts, FungibleBalances, NonFungibleBalances, PendingTransactions, BlockStatistics

}

class MongoSinkTask : SinkTask() {

  val logger = KotlinLogging.logger {}

  private lateinit var client: MongoClient
  private lateinit var db: MongoDatabase

  private var collectionsMap = mapOf<CollectionId, MongoCollection<BsonDocument>>()

  override fun version() = "0.0.1"    // TODO load from resources

  override fun start(props: MutableMap<String, String>) {

    val uri = MongoSinkConnector.Config.mongoUri(props)

    client = MongoClient(uri)
    db = client.getDatabase(uri.database!!)

    // TODO maybe use a Struct to Bson Codec?

    collectionsMap += CollectionId.Blocks to db.getCollection("blocks", BsonDocument::class.java)
    collectionsMap += CollectionId.Accounts to db.getCollection("accounts", BsonDocument::class.java)
    collectionsMap += CollectionId.Transactions to db.getCollection("transactions", BsonDocument::class.java)
    collectionsMap += CollectionId.Contracts to db.getCollection("contracts", BsonDocument::class.java)
    collectionsMap += CollectionId.FungibleBalances to db.getCollection("fungible_balances", BsonDocument::class.java)
    collectionsMap += CollectionId.NonFungibleBalances to db.getCollection("non_fungible_balances", BsonDocument::class.java)
    collectionsMap += CollectionId.PendingTransactions to db.getCollection("pending_transactions", BsonDocument::class.java)
    collectionsMap += CollectionId.BlockStatistics to db.getCollection("block_statistics", BsonDocument::class.java)
    collectionsMap += CollectionId.BlockStatistics to db.getCollection("block_statistics", BsonDocument::class.java)
  }

  override fun stop() {
    client.close()
  }

  override fun put(records: MutableCollection<SinkRecord>) {

    // TODO use mongo transactions

    logger.info { "Processing ${records.size} records" }

    val startMs = System.currentTimeMillis()

    var batch = mapOf<CollectionId, List<WriteModel<BsonDocument>>>()

    records.forEach {

      val writesMap = when (it.topic()) {
        "blocks" -> processWeb3Block(it)
        "block-summaries" -> processBlock(it)
        "contract-creations" -> processContractCreation(it)
        "contract-suicides" -> processContractSuicide(it)
        "fungible-token-balances" -> processFungibleTokenBalance(it)
        "non-fungible-token-balances" -> processNonFungibleTokenBalance(it)
        "pending-transactions" -> processPendingTransaction(it)
        "block-statistics" -> processBlockStatistic(it)
        "contract-metadata" -> processContractMetadata(it)
        else -> throw IllegalStateException("Unhandled topic: " + it.topic())
      }

      writesMap.forEach{ (collectionId, writesForCollection) ->
        batch += collectionId to batch.getOrDefault(collectionId, emptyList()) + writesForCollection
      }
    }

    batch
      .filterValues { it.isNotEmpty() }
      .forEach { (collectionId, writes) ->

      val collection = collectionsMap[collectionId]!!
      val bulkWrite = collection.bulkWrite(writes)

      logger.debug { "Bulk write complete. Collection = $collectionId, inserts = ${bulkWrite.insertedCount}, updates = ${bulkWrite.modifiedCount}, upserts = ${bulkWrite.upserts.size}, deletes = ${bulkWrite.deletedCount}" }
    }

    val elapsedMs = System.currentTimeMillis() - startMs

    logger.info{ "Batch processing completed in $elapsedMs ms"}

  }

  override fun flush(currentOffsets: MutableMap<TopicPartition, OffsetAndMetadata>?) {

  }

  private fun processWeb3Block(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var blockWrites = listOf<WriteModel<BsonDocument>>()
    var txWrites = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

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

      val valueBson = StructToBsonConverter.convert(record.value() as Struct, false)

      blockWrites += ReplaceOneModel(blockFilter, valueBson, replaceOptions)

      val txs = valueBson.getArray("transactions")

      txWrites += txs
        .map { it as BsonDocument }
        .map {

          val txHash = it.getString("hash")
          ReplaceOneModel(BsonDocument("_id", txHash), it, replaceOptions)

        }

    }

    return mapOf(
      CollectionId.Blocks to blockWrites,
      CollectionId.Transactions to txWrites
    )

  }

  private fun processBlock(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var blockWrites = listOf<WriteModel<BsonDocument>>()
    var txWrites = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a long")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val blockNumber = (record.key() as Struct).getInt64("number")
    val blockNumberBson = BsonInt64(blockNumber)

    val blockFilter = BsonDocument().apply { append("_id", blockNumberBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      blockWrites += DeleteOneModel(blockFilter)

      // delete transactions as-well
      val txsFilter = BsonDocument().apply { append("blockNumber", blockNumberBson) }
      txWrites += DeleteManyModel(txsFilter)

    } else {

      val valueBson = StructToBsonConverter.convert(record.value() as Struct)

      blockWrites += ReplaceOneModel(blockFilter, valueBson, replaceOptions)

      val txReceiptsBson = valueBson
        .getDocument("block")
        .getArray("txReceipts")

      txWrites += txReceiptsBson
        .map { it as BsonDocument }
        .map {

          val txHash = it.getDocument("tx").getString("hash")

          val doc = it
            .append("blockNumber", blockNumberBson)

          ReplaceOneModel(BsonDocument("_id", txHash), doc, replaceOptions)

        }

    }

    return mapOf(
      CollectionId.Blocks to blockWrites,
      CollectionId.Transactions to txWrites
    )

  }

  private fun processContractCreation(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var writes = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.toHex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // TODO determine how to handle tombstones in light of merging with data from ethlists

    } else {

      val struct = record.value() as Struct
      val bson = BsonDocument()
        .apply {
          append("\$set", StructToBsonConverter.convert(struct))
        }

      writes += UpdateOneModel(idFilter, bson, updateOptions)
    }

    return mapOf(CollectionId.Contracts to writes)
  }

  private fun processContractMetadata(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var writes = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.toHex())

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

      writes += UpdateOneModel(idFilter, bson, updateOptions)
    }

    return mapOf(CollectionId.Contracts to writes)
  }


  private fun processContractSuicide(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var writes = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be binary")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.toHex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need unset the suicide in the contract object
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "suicide")))

    } else {

      val struct = record.value() as Struct

      val bson = BsonDocument()
        .apply {
          append("\$set", BsonDocument()
            .apply { append("suicide", StructToBsonConverter.convert(struct)) })
        }

      writes += UpdateOneModel(idFilter, bson)
    }

    return mapOf(CollectionId.Contracts to writes)
  }

  private fun processFungibleTokenBalance(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var writes = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val idBson = StructToBsonConverter.convert(record.key() as Struct)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)

    } else {

      val struct = record.value() as Struct

      var bson = StructToBsonConverter.convert(struct)

      // combine with id fields so we can query on them later
      idBson.forEach{ k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, replaceOptions)
    }

    return mapOf(CollectionId.FungibleBalances to writes)
  }

  private fun processNonFungibleTokenBalance(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var writes = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val idBson = StructToBsonConverter.convert(record.key() as Struct)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)

    } else {

      val struct = record.value() as Struct

      var bson = StructToBsonConverter.convert(struct)

      // combine with id fields so we can query on them later
      idBson.forEach{ k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, replaceOptions)
    }

    return mapOf(CollectionId.NonFungibleBalances to writes)
  }

  private fun processPendingTransaction(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var writes = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val idBson = StructToBsonConverter.convert(record.key() as Struct)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)

    } else {

      val struct = record.value() as Struct
      var bson = StructToBsonConverter.convert(struct)

      // combine with id fields so we can query on them later
      idBson.forEach{ k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, replaceOptions)
    }

    return mapOf(CollectionId.PendingTransactions to writes)
  }

  private fun processBlockStatistic(record: SinkRecord): Map<CollectionId, List<WriteModel<BsonDocument>>> {

    var writes = listOf<WriteModel<BsonDocument>>()

    val keySchema = record.keySchema()
    if (keySchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Key contractMetadataSchema must be a struct")

    val valueSchema = record.valueSchema()
    if (valueSchema.type() != Schema.Type.STRUCT) throw IllegalArgumentException("Value contractMetadataSchema must be a struct")

    val idBson = StructToBsonConverter.convert(record.key() as Struct)
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)

    } else {

      val struct = record.value() as Struct
      var bson = StructToBsonConverter.convert(struct, false)

      // combine with id fields so we can query on them later
      idBson.forEach{ k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, replaceOptions)
    }

    return mapOf(CollectionId.BlockStatistics to writes)
  }

  companion object {

    val updateOptions = UpdateOptions().upsert(true)
    val replaceOptions = ReplaceOptions().upsert(true)

  }

}

