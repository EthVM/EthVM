package com.ethvm.kafka.connect.sinks.mongo

import arrow.core.Option
import com.ethvm.common.extensions.bigInteger
import com.ethvm.common.extensions.hex
import com.ethvm.common.extensions.unsignedBigInteger
import com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType.BigInt
import com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType.Hex
import com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType.Ignore
import com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType.UBigInt
import com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType.Int64
import com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType.UInt64
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Schema.Type.ARRAY
import org.apache.kafka.connect.data.Schema.Type.BOOLEAN
import org.apache.kafka.connect.data.Schema.Type.BYTES
import org.apache.kafka.connect.data.Schema.Type.FLOAT32
import org.apache.kafka.connect.data.Schema.Type.FLOAT64
import org.apache.kafka.connect.data.Schema.Type.INT16
import org.apache.kafka.connect.data.Schema.Type.INT32
import org.apache.kafka.connect.data.Schema.Type.INT64
import org.apache.kafka.connect.data.Schema.Type.INT8
import org.apache.kafka.connect.data.Schema.Type.MAP
import org.apache.kafka.connect.data.Schema.Type.STRING
import org.apache.kafka.connect.data.Schema.Type.STRUCT
import org.apache.kafka.connect.data.SchemaAndValue
import org.apache.kafka.connect.data.Struct
import org.bson.BsonArray
import org.bson.BsonBinary
import org.bson.BsonBoolean
import org.bson.BsonDocument
import org.bson.BsonDouble
import org.bson.BsonInt32
import org.bson.BsonInt64
import org.bson.BsonNull
import org.bson.BsonString
import org.bson.BsonValue
import java.nio.ByteBuffer

object TypeMappings {

  enum class ConversionType {
    Hex,
    UBigInt,
    BigInt,
    UInt64,
    Int64,
    Ignore,
  }

  private val traces = mapOf(
    "blockHash" to Hex,
    "blockNumber" to UInt64,
    "transactionHash" to Hex,
    "action" to mapOf(
      "TraceCallActionRecord" to mapOf(
        "from" to Hex,
        "to" to Hex,
        "gas" to UBigInt,
        "input" to Hex,
        "value" to UBigInt
      ),
      "TraceCreateActionRecord" to mapOf(
        "from" to Hex,
        "gas" to UBigInt,
        "value" to UBigInt,
        "init" to Hex
      ),
      "TraceDestroyActionRecord" to mapOf(
        "address" to Hex,
        "balance" to UBigInt,
        "refundAddress" to Hex
      )
    ),
    "result" to mapOf(
      "address" to Hex,
      "code" to Hex,
      "gasUsed" to UBigInt,
      "output" to Hex
    )
  )

  private val txReceipt = mapOf(
    "root" to Hex,
    "blockHash" to Hex,
    "blockNumber" to UInt64,
    "transactionHash" to Hex,
    "contractAddress" to Hex,
    "gasUsed" to UBigInt,
    "cumulativeGasUsed" to UBigInt,
    "logs" to mapOf(
      "address" to Hex,
      "fixed" to Hex,
      "data" to Hex,
      "topics" to Hex
    ),
    "logsBloom" to Hex,
    "status" to Hex,
    "traces" to com.ethvm.kafka.connect.sinks.mongo.TypeMappings.traces
  )

  private val tx = mapOf(
    "hash" to Hex,
    "nonce" to UBigInt,
    "blockHash" to Hex,
    "blockNumber" to UInt64,
    "transactionIndex" to UBigInt,
    "value" to UBigInt,
    "gasPrice" to UBigInt,
    "gas" to UBigInt,
    "from" to Hex,
    "to" to Hex,
    "input" to Hex,
    "v" to UBigInt,
    "r" to Hex,
    "s" to Hex,
    "creates" to Hex,
    "receipt" to com.ethvm.kafka.connect.sinks.mongo.TypeMappings.txReceipt,
    "raw" to Ignore
  )

  private val blockHeader = mapOf(
    "number" to UInt64,
    "hash" to Hex,
    "parentHash" to Hex,
    "nonce" to Hex,
    "sha3Uncles" to Hex,
    "logsBloom" to Hex,
    "transactionsRoot" to Hex,
    "receiptsRoot" to Hex,
    "stateRoot" to Hex,
    "author" to Hex,
    "difficulty" to UBigInt,
    "extraData" to Hex,
    "gasLimit" to UBigInt,
    "gasUsed" to UBigInt,
    "raw" to Ignore,
    "uncleReward" to UBigInt,
    "blockNumber" to UInt64
  )

  private val mappings = mapOf(
    "transaction" to com.ethvm.kafka.connect.sinks.mongo.TypeMappings.tx,
    "transactionKey" to mapOf(
      "txHash" to Hex
    ),
    "uncleKey" to mapOf(
      "uncleHash" to Hex
    ),
    "blockHeader" to com.ethvm.kafka.connect.sinks.mongo.TypeMappings.blockHeader,
    "block" to mapOf(
      "header" to com.ethvm.kafka.connect.sinks.mongo.TypeMappings.blockHeader,
      "transactions" to com.ethvm.kafka.connect.sinks.mongo.TypeMappings.tx,
      "uncles" to com.ethvm.kafka.connect.sinks.mongo.TypeMappings.blockHeader,
      "rewards" to mapOf(
        "author" to Hex,
        "value" to UBigInt
      ),
      "totalDifficulty" to UBigInt,
      "uncleHashes" to Ignore,
      "numPendingTxs" to Ignore,
      "reverse" to Ignore,
      "sha3Uncles" to Ignore
    ),
    "block-metrics" to mapOf(
      "hash" to Hex,
      "number" to UInt64,
      "difficulty" to UBigInt,
      "totalDifficulty" to UBigInt,
      "totalGasPrice" to UBigInt,
      "avgGasPrice" to UBigInt,
      "totalTxFees" to UBigInt,
      "avgTxFees" to UBigInt,
      "avgGasLimit" to UBigInt
    ),
    "balanceId" to mapOf(
      "contract" to Hex,
      "address" to Hex,
      "tokenId" to UBigInt
    ),
    "balance" to mapOf(
      "amount" to UBigInt,
      "contract" to Hex,
      "address" to Hex,
      "tokenId" to UBigInt
    ),
    "metric" to mapOf(
      "bigInteger" to BigInt
    ),
    "processingMetadata" to mapOf(
      "bigInteger" to BigInt
    ),
    "contract" to mapOf(
      "address" to Hex,
      "blockHash" to Hex,
      "txHash" to Hex,
      "creator" to Hex,
      "fixed" to Hex
    ),
    "tokenTransfer" to mapOf(
      "hash" to Hex,
      "contract" to Hex,
      "blockHash" to Hex,
      "txHash" to Hex,
      "from" to Hex,
      "to" to Hex,
      "amount" to UBigInt,
      "tokenId" to UBigInt
    ),
    "accountTxCountKey" to mapOf(
      "address" to Hex
    ),
    "exchangeRate" to mapOf(
      "id" to Ignore,
      "address" to Hex
    )
  )

  val conversionMap = com.ethvm.kafka.connect.sinks.mongo.TypeMappings.buildConversionMappings(com.ethvm.kafka.connect.sinks.mongo.TypeMappings.mappings).toMap()

  @Suppress("UNCHECKED_CAST")
  private fun buildConversionMappings(conversions: Map<String, Any>, path: String? = null): Set<Pair<String, com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType>> {

    val results = mutableSetOf<Pair<String, com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType>>()

    conversions.entries
      .forEach { (key, value) ->
        when (value) {
          is com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType -> results += Pair(
            com.ethvm.kafka.connect.sinks.mongo.TypeMappings.buildFieldPath(
              path,
              key
            ), value)
          is Map<*, *> -> {
            val map = value as Map<String, Any>
            results += com.ethvm.kafka.connect.sinks.mongo.TypeMappings.buildConversionMappings(
              map,
              com.ethvm.kafka.connect.sinks.mongo.TypeMappings.buildFieldPath(path, key)
            )
          }
          else -> throw IllegalArgumentException("Unexpected type")
        }
      }

    return results
  }

  fun buildFieldPath(vararg component: String?) = component.filterNotNull().joinToString(".")
}

object StructToBsonConverter {

  private val conversionMap = com.ethvm.kafka.connect.sinks.mongo.TypeMappings.conversionMap

  private val BASIC_CONVERTERS = mapOf(
    BOOLEAN to { v: Any -> BsonBoolean(v as Boolean) },
    INT8 to { v: Any -> BsonInt32((v as Byte).toInt()) },
    INT16 to { v: Any -> BsonInt32((v as Short).toInt()) },
    INT32 to { v: Any -> BsonInt32(v as Int) },
    INT64 to { v: Any -> BsonInt64(v as Long) },
    FLOAT32 to { v: Any -> BsonDouble((v as Float).toDouble()) },
    FLOAT64 to { v: Any -> BsonDouble(v as Double) },
    STRING to { v: Any -> BsonString(v as String) },
    BYTES to { v: Any -> BsonBinary((v as ByteBuffer).array()) }
  )

  fun convert(value: Any?, path: String? = null, allowNulls: Boolean = false): BsonDocument =
    Option
      .fromNullable(value)
      .fold(
        { BsonDocument() },
        {

          val schema = when (it) {
            is Struct -> it.schema()
            is SchemaAndValue -> it.schema()
            else -> throw IllegalStateException("Value must be a Struct or a SchemaAndValue")
          }

          val struct = value as Struct
          val doc = BsonDocument()

          schema.fields().forEach { field ->

            val fieldName = field.name()
            val fieldPath = com.ethvm.kafka.connect.sinks.mongo.TypeMappings.buildFieldPath(path, fieldName)

            val conversion = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.conversionMap[fieldPath]
            if (conversion == Ignore) {
              return@forEach
            }

            var bsonValue = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convertField(field.schema(), fieldPath, struct.get(field), allowNulls)

            if (bsonValue != null) {

              if (conversion != null) {
                when {
                  bsonValue.isBinary -> { bsonValue = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.toTypeConversion(conversion, bsonValue)
                  }
                  bsonValue.isArray -> { bsonValue = BsonArray((bsonValue as BsonArray).values.map { v ->
                    com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.toTypeConversion(
                      conversion,
                      v
                    )
                  }) }
                }
              }

              doc.append(fieldName, bsonValue)
            }
          }

          doc
        })

  private fun toTypeConversion(conversion: com.ethvm.kafka.connect.sinks.mongo.TypeMappings.ConversionType, value: BsonValue): BsonValue? {
    if (!value.isBinary) return value
    val bytes = (value as BsonBinary).data
    return when (conversion) {
      Hex -> BsonString(bytes.hex())
      UBigInt -> BsonString(bytes.unsignedBigInteger().toString())
      BigInt -> BsonString(bytes.bigInteger().toString())
      UInt64 -> BsonInt64(bytes.unsignedBigInteger().longValueExact())
      Int64 -> BsonInt64(bytes.bigInteger()!!.longValueExact())
      else -> throw IllegalStateException("Illegal conversion value!")
    }
  }

  private fun convertField(schema: Schema, path: String, value: Any?, allowNulls: Boolean = false): BsonValue? {
    val type = schema.type()
    return when (type) {
      in Schema.Type.values().filterNot { it == STRUCT || it == ARRAY || it == MAP } -> com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convertField(
        value,
        com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.BASIC_CONVERTERS.getValue(type),
        allowNulls
      )
      ARRAY -> com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convertArray(schema, path, value)
      STRUCT -> com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(value, path, allowNulls)
      else -> throw IllegalArgumentException("Unhandled Schema type: $type")
    }
  }

  private fun convertField(value: Any?, bsonFactory: (Any) -> BsonValue?, allowNulls: Boolean = false): BsonValue? =
    Option
      .fromNullable(value)
      .fold(
        { if (allowNulls) BsonNull() else null },
        bsonFactory
      )

  private fun convertArray(schema: Schema, path: String, value: Any?, allowNulls: Boolean = false): BsonValue? {

    val valueSchema = schema.valueSchema()

    val result = Option
      .fromNullable(value)
      .fold(
        { BsonArray() },
        { data ->

          val bsonValues = (data as List<Any?>)
            .map { d ->
              Option.fromNullable(d)
                .fold(
                  { BsonNull() },
                  { com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convertField(valueSchema, path, d, allowNulls) }
                )
            }

          BsonArray(bsonValues)
        }
      )

    return if (result.isEmpty() && !allowNulls) null else result
  }
}
