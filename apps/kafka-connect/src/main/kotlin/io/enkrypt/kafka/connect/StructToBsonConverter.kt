package io.enkrypt.kafka.connect

import arrow.core.Option
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Schema.Type.*
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.sink.SinkRecord
import org.bson.*
import org.bson.types.Decimal128
import java.math.BigDecimal
import java.math.BigInteger
import java.math.MathContext
import java.nio.ByteBuffer

typealias BsonFactory = (Any) -> BsonValue?

object StructToBsonConverter {

  private val hexFields = setOf(
    "hash", "parentHash", "unclesHash", "coinbase", "stateRoot", "txTrieRoot", "receiptTrieRoot",
    "logsBloom", "mixHash", "nonce", "extraData", "from", "to", "data", "postTxState", "bloomFilter",
    "contract", "tokenId", "address", "txHash", "creator", "blockHash", "miner", "sha3Uncles", "transactionsRoot",
    "receiptsRoot", "input", "r", "s", "author"
  )

  private val bigIntegerFields = setOf(
    "difficulty", "totalDifficulty", "cumulativeGas", "bigIntegerValue", "gasPrice", "gasLimit", "gasUsed",
    "gasLeftover", "gasRefund", "reward", "value", "amount", "blockNumber", "transactionIndex", "gas", "balance", "blockNumber"
  )

  private val basicConverters = mapOf<Schema.Type, BsonFactory>(
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

  fun convert(struct: Struct, allowNulls: Boolean = true): BsonDocument = convertStruct(struct, allowNulls)

  private fun convertStruct(value: Any?, allowNulls: Boolean = true): BsonDocument =
    Option.fromNullable(value)
      .fold({ BsonDocument() }, {

        val struct = (it as Struct)
        val schema = struct.schema()

        val doc = BsonDocument()

        schema.fields().forEach { field ->

          // TODO make field conversion more generic and respect object structure

          var bsonValue = convertField(field.schema(), struct.get(field), allowNulls)

          if (bsonValue != null) {

            val fieldName = field.name()

            if (bsonValue.isBinary) {

              val bytes = (bsonValue as BsonBinary).data

              if (hexFields.contains(fieldName)) {
                bsonValue = BsonString(bytes.toHex())
              } else if (bigIntegerFields.contains(fieldName)) {

                val bigDecimal =
                  if (bytes.isEmpty())
                    BigDecimal.ZERO
                  else
                    BigInteger(bytes).toBigDecimal(0, MathContext.DECIMAL128)

                bsonValue = BsonDecimal128(Decimal128(bigDecimal))
              }

            }

            doc.append(fieldName, bsonValue)
          }

        }

        doc

      })


  private fun convertField(schema: Schema, value: Any?, allowNulls: Boolean): BsonValue? =
    when (schema.type()) {
      BOOLEAN -> convertField(value, allowNulls, basicConverters[BOOLEAN]!!)
      INT8 -> convertField(value, allowNulls, basicConverters[INT8]!!)
      INT16 -> convertField(value, allowNulls, basicConverters[INT16]!!)
      INT32 -> convertField(value, allowNulls, basicConverters[INT32]!!)
      INT64 -> convertField(value, allowNulls, basicConverters[INT64]!!)
      FLOAT32 -> convertField(value, allowNulls, basicConverters[FLOAT32]!!)
      FLOAT64 -> convertField(value, allowNulls, basicConverters[FLOAT64]!!)
      STRING -> convertField(value, allowNulls, basicConverters[STRING]!!)
      BYTES -> convertField(value, allowNulls, basicConverters[BYTES]!!)
      ARRAY -> convertArray(schema, value)
      STRUCT -> convertStruct(value, allowNulls)
      else -> throw IllegalArgumentException("Unhandled contractMetadataSchema type: " + schema.type())
    }


  private fun convertField(value: Any?, allowNulls: Boolean, bsonFactory: (Any) -> BsonValue?): BsonValue? =
    Option
      .fromNullable(value)
      .fold(
        { if (allowNulls) BsonNull() else null },
        bsonFactory
      )


  private fun convertArray(schema: Schema, value: Any?): BsonValue {

    val valueSchema = schema.valueSchema()

    return Option
      .fromNullable(value)
      .fold(
        { BsonArray() },
        { data ->

          val bsonValues = (data as List<Any?>)
            .map {
              Option.fromNullable(it)
                .fold({ BsonNull() }, { convertField(valueSchema, it, true) })
            }

          BsonArray(bsonValues)

        }
      )
  }


}
