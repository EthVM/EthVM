package io.enkrypt.kafka.connect.sinks.mongo

import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.WriteModel
import com.ethvm.common.extensions.hex
import com.ethvm.common.extensions.unsignedBigInteger
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.sink.SinkRecord
import org.bson.BsonDecimal128
import org.bson.BsonDocument
import org.bson.BsonString
import org.bson.Document
import org.bson.types.Decimal128

typealias SinkRecordToBsonFn = (record: SinkRecord) -> Map<MongoCollections, List<WriteModel<BsonDocument>>>

enum class TopicWriteGenerators(
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
        ReplaceOneModel(blockFilter, valueBson, replaceOptions)
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
        listOf(ReplaceOneModel(idFilter, value, replaceOptions))
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
        listOf(ReplaceOneModel(idFilter, value, replaceOptions))
      }
    }

    mapOf(MongoCollections.Uncles to uncleWrites)
  }),

  TokenTransfers("token-transfers", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val id = StructToBsonConverter.convert(record.key() as Struct, "tokenTransfer")

    writes += when {
      record.value() == null -> {

        // remove
        val filter = BsonDocument("_id", id)
        DeleteOneModel<BsonDocument>(filter)
      }
      else -> {

        val model = StructToBsonConverter
          .convert(record.value(), "tokenTransfer")
          .apply {
            append("_id", id)
          }

        ReplaceOneModel(BsonDocument("_id", id), model, replaceOptions)
      }
    }

    mapOf(MongoCollections.TokenTransfers to writes)
  }),

  ContractCreations("contract-creations", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    when {
      record.value() == null -> {

        // TODO determine how to handle tombstones in light of merging with fixed from ethlists
      }
      else -> {

        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

        val struct = record.value() as Struct
        val bson = BsonDocument().apply {
          append("\$set", StructToBsonConverter.convert(struct, "contract"))
        }

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractDestructions("contract-destructions", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    when {
      record.value() == null -> {
        // tombstone received so we need unset the suicide in the contract object
        writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to mapOf("destructed" to ""))))
      }
      else -> {

        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

        val struct = record.value() as Struct

        val bson = BsonDocument().apply {
          append("\$set", BsonDocument().apply { append("destructed", StructToBsonConverter.convert(struct, "contract")) })
        }

        writes += UpdateOneModel(idFilter, bson)
      }
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractMetadata("contract-metadata", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    when {
      record.value() == null -> {
        // tombstone received so we need to delete
        writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to mapOf("metadata" to ""))))
      }
      else -> {

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

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  Balances("balances", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "balanceId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    when {
      record.value() == null -> {
        // tombstone received so we need to delete
        writes += DeleteOneModel(idFilter)
      }
      else -> {

        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

        val struct = record.value() as Struct

        try {
          var bson = StructToBsonConverter.convert(struct, "balance")

          // combine with id fields so we can query on them later
          idBson.forEach { k, v -> bson = bson.append(k, v) }

          writes += ReplaceOneModel(idFilter, bson, replaceOptions)
        } catch (e: NumberFormatException) {
          System.err.println("Number format exception. Key = $idBson, value = ${record.value()}")
          throw e
        }
      }
    }

    mapOf(MongoCollections.Balances to writes)
  }),

  PendingTransactions("pending-transactions", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "transactionId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    when {
      record.value() == null -> {
        // tombstone received so we need to delete
        writes += DeleteOneModel(idFilter)
      }
      else -> {

        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

        val struct = record.value() as Struct
        var bson = StructToBsonConverter.convert(struct, "transaction")

        // combine with id fields so we can query on them later
        idBson.forEach { k, v -> bson = bson.append(k, v) }

        writes += ReplaceOneModel(idFilter, bson, replaceOptions)
      }
    }

    mapOf(MongoCollections.PendingTransactions to writes)
  }),

  BlockMetricsByBlock("block-metrics-by-block", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val blockNumber = (record.key() as Struct).getBytes("number").unsignedBigInteger()
    val blockNumberBson = BsonDecimal128(Decimal128(blockNumber.toBigDecimal()))
    val idFilter = BsonDocument("_id", blockNumberBson)

    when {
      record.value() == null -> {
        // tombstone received so we need to delete
        writes += DeleteOneModel(idFilter)
      }
      else -> {

        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

        val struct = record.value() as Struct
        val bson = BsonDocument("\$set", StructToBsonConverter.convert(struct, "block-metrics"))

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
    }

    mapOf(MongoCollections.BlockMetrics to writes)
  }),

  AggregateBlockMetrics("aggregate-block-metrics-by-day", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "metricId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    when {
      record.value() == null -> {
        // tombstone received so we need to delete
        writes += DeleteOneModel(idFilter)
      }
      else -> {

        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

        val struct = record.value() as Struct
        var bson = StructToBsonConverter.convert(struct, "metric", false)

        // combine with id fields so we can query on them later
        idBson.forEach { k, v -> bson = bson.append(k, v) }

        writes += ReplaceOneModel(idFilter, bson, replaceOptions)
      }
    }

    mapOf(MongoCollections.AggregateBlockMetrics to writes)
  }),

  ProcessingMetdata("processing-metadata", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "").getString("name")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct
      var bson = StructToBsonConverter.convert(struct, "processingMetadata")

      writes += ReplaceOneModel(idFilter, bson, replaceOptions)
    }

    mapOf(MongoCollections.ProcessingMetadata to writes)
  }),

  AddressTxCounts("address-tx-counts", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val keyBson = StructToBsonConverter.convert(record.key() as Struct, "accountTxCountKey")
    val idFilter = BsonDocument().apply { append("_id", keyBson.get("address")) }

    when {
      record.value() == null -> {

        val bson = when (keyBson.getString("type").value) {
          "OUT_TX_COUNT" -> Document(mapOf("\$unset" to mapOf("outTxCount" to "")))
          "IN_TX_COUNT" -> Document(mapOf("\$unset" to mapOf("inTxCount" to "")))
          "TOTAL_TX_COUNT" -> Document(mapOf("\$unset" to mapOf("totalTxCount" to "")))
          else -> throw IllegalStateException("Unexpected type value")
        }

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
      else -> {

        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }
        val struct = StructToBsonConverter.convert(record.value() as Struct)
        val count = struct.getInt64("count").longValue()

        val bson = when (keyBson.getString("type").value) {
          "OUT_TX_COUNT" -> Document(mapOf("\$set" to mapOf("outTxCount" to count)))
          "IN_TX_COUNT" -> Document(mapOf("\$set" to mapOf("inTxCount" to count)))
          "TOTAL_TX_COUNT" -> Document(mapOf("\$set" to mapOf("totalTxCount" to count)))
          else -> throw IllegalStateException("Unexpected type value")
        }

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
    }

    mapOf(MongoCollections.AccountMetadata to writes)
  }),

  MinerList("miner-list", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val keyBson = StructToBsonConverter.convert(record.key() as Struct, "accountTxCountKey")
    val idFilter = BsonDocument().apply { append("_id", keyBson["address"]) }

    when {
      record.value() == null -> {

        val bson = when (keyBson.getString("type").value) {
          "MINER" -> Document(mapOf("\$unset" to mapOf("isMiner" to "")))
          else -> throw IllegalStateException("Unexpected type value")
        }

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
      else -> {

        val bson = when (keyBson.getString("type").value) {
          "MINER" -> Document(mapOf("\$set" to mapOf("isMiner" to true)))
          else -> throw IllegalStateException("Unexpected type value")
        }

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
    }

    mapOf(MongoCollections.AccountMetadata to writes)
  }),

  ContractCreator("contract-creator-list", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val writes = mutableListOf<WriteModel<BsonDocument>>()

    val keyBson = StructToBsonConverter.convert(record.key() as Struct, "accountTxCountKey")
    val idFilter = BsonDocument().apply { append("_id", keyBson["address"]) }

    when {
      record.value() == null -> {

        val bson = when (keyBson.getString("type").value) {
          "CONTRACT_CREATOR" -> Document(mapOf("\$unset" to mapOf("isContractCreator" to "")))
          else -> throw IllegalStateException("Unexpected type value")
        }

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
      else -> {

        val bson = when (keyBson.getString("type").value) {
          "CONTRACT_CREATOR" -> Document(mapOf("\$set" to mapOf("isContractCreator" to true)))
          else -> throw IllegalStateException("Unexpected type value")
        }

        writes += UpdateOneModel(idFilter, bson, updateOptions)
      }
    }

    mapOf(MongoCollections.AccountMetadata to writes)
  }),

  TokenExchangeRates("token-exchange-rates", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    val key = record.key() as Struct
    val value = record.value()

    val idBson = StructToBsonConverter.convert(key, "symbol")
    val idFilter = BsonDocument().apply { append("_id", idBson["symbol"]) }

    val writes: List<WriteModel<BsonDocument>> = when (value) {
      null -> listOf(DeleteOneModel(idFilter))
      else -> {
        require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

        val bsonValue = StructToBsonConverter.convert(value as Struct, "exchangeRate")
        val bson = BsonDocument("\$set", bsonValue)

        listOf(UpdateOneModel(idFilter, bson, updateOptions))
      }
    }

    mapOf(MongoCollections.TokenExchangeRates to writes)
  });

  companion object {

    fun forTopic(topic: String): SinkRecordToBsonFn =
      TopicWriteGenerators.values().find { it.id == topic }?.convertFn ?: throw IllegalStateException("Unhandled topic: $topic")

    val updateOptions: UpdateOptions = UpdateOptions().upsert(true)
    val replaceOptions: ReplaceOptions = ReplaceOptions().upsert(true)
  }
}
