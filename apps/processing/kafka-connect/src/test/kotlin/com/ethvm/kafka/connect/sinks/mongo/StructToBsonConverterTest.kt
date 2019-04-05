package com.ethvm.kafka.connect.sinks.mongo

import io.confluent.connect.avro.AvroConverter
import io.confluent.kafka.schemaregistry.client.MockSchemaRegistryClient
import io.confluent.kafka.serializers.KafkaAvroSerializer
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.SchemaBuilder
import org.apache.kafka.connect.data.Struct
import org.bson.BsonArray
import org.bson.BsonBinary
import org.bson.BsonBoolean
import org.bson.BsonDocument
import org.bson.BsonDouble
import org.bson.BsonInt32
import org.bson.BsonInt64
import org.bson.BsonString
import java.nio.ByteBuffer

class StructToBsonConverterTest : BehaviorSpec() {

  private val schemaRegistryClient = MockSchemaRegistryClient().apply {

//    val subjectsWithSchemas = listOf(
//      Pair("blocks", BlockRecord.`SCHEMA$`),
//      Pair("blocks-key", BlockKeyRecord.`SCHEMA$`),
//
//      Pair("block-statistics", MetricRecord.`SCHEMA$`),
//      Pair("block-statistics-key", MetricKeyRecord.`SCHEMA$`),
//
//      Pair("balances", TokenBalanceKeyRecord.`SCHEMA$`),
//      Pair("balances-key", TokenBalanceRecord.`SCHEMA$`),
//
//      Pair("contract-creations", ContractCreateRecord.`SCHEMA$`),
//      Pair("contract-creations-key", ContractKeyRecord.`SCHEMA$`),
//
//      Pair("contract-destructions", ContractDestroyRecord.`SCHEMA$`),
//      Pair("contract-destructions-key", ContractKeyRecord.`SCHEMA$`),
//
//      Pair("transactions-key", TransactionKeyRecord.`SCHEMA$`),
//      Pair("transactions", TransactionRecord.`SCHEMA$`)
//    )

    val subjectsWithSchemas = emptyList<Pair<String, org.apache.avro.Schema>>()
    subjectsWithSchemas.forEach { (subject, schema) -> register(subject, schema) }
  }

  val avroSerializer = KafkaAvroSerializer(schemaRegistryClient).apply {
    configure(mapOf("schema.registry.url" to "http//foo.com"), false)
  }

  val avroConverter = AvroConverter(schemaRegistryClient).apply {
    configure(mapOf("schema.registry.url" to "http//foo.com"), false)
  }

  val avroKeyConverter = AvroConverter(schemaRegistryClient).apply {
    configure(mapOf("schema.registry.url" to "http//foo.com"), true)
  }

  init {

    given("a null value") {

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(null)
        val bsonDocument2 = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(null, allowNulls = true)

        then("we obtain the value converted successfully") {
          bsonDocument shouldBe BsonDocument()
          bsonDocument2 shouldBe BsonDocument()
        }
      }
    }

    given("a raw struct boolean value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.BOOLEAN_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", true)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonBoolean(true)
        }
      }
    }

    given("a raw struct byte value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.INT8_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", Byte.MAX_VALUE)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonInt32(Byte.MAX_VALUE.toInt())
        }
      }
    }

    given("a raw struct short value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.INT16_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", Short.MAX_VALUE)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonInt32(Short.MAX_VALUE.toInt())
        }
      }
    }

    given("a raw struct int value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.INT32_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", Int.MAX_VALUE)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonInt32(Int.MAX_VALUE)
        }
      }
    }

    given("a raw struct long value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.INT64_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", Long.MAX_VALUE)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonInt64(Long.MAX_VALUE)
        }
      }
    }

    given("a raw struct float value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.FLOAT32_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", Float.MAX_VALUE)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonDouble(Float.MAX_VALUE.toDouble())
        }
      }
    }

    given("a raw struct double value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.FLOAT64_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", Double.MAX_VALUE)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonDouble(Double.MAX_VALUE)
        }
      }
    }

    given("a raw struct string value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result1", Schema.STRING_SCHEMA)
        .field("result2", Schema.STRING_SCHEMA)
        .field("result3", Schema.OPTIONAL_STRING_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result1", "test")
        put("result2", "")
        put("result3", null)
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result1"] shouldBe BsonString("test")
          bsonDocument["result2"] shouldBe BsonString("")
          bsonDocument.get("result3") shouldBe null
        }
      }
    }

    given("a raw struct byte array value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", Schema.BYTES_SCHEMA)
        .build()
      val struct = Struct(schema).apply {
        put("result", ByteBuffer.allocate(0))
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonBinary(ByteBuffer.allocate(0).array())
        }
      }
    }

    given("a raw struct array value") {

      val schema = SchemaBuilder(Schema.Type.STRUCT)
        .field("result", SchemaBuilder.array(Schema.BOOLEAN_SCHEMA).build())
        .build()
      val struct = Struct(schema).apply {
        put("result", listOf(true, false))
      }

      `when`("we perform a conversion") {

        val bsonDocument = com.ethvm.kafka.connect.sinks.mongo.StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonArray(listOf(BsonBoolean(true), BsonBoolean(false)))
        }
      }
    }

//    given("a block statistic with a sample value for each type") {
//
//      val intValue = 12
//      val longValue = 146L
//      val floatValue = 134.56f
//      val doubleValue = 1237568.123819237
//      val bigIntegerValue = 14239384537412981.toBigInteger()
//
//      val record = MetricRecord.newBuilder()
//        .`setInt$`(intValue)
//        .`setLong$`(longValue)
//        .`setFloat$`(floatValue)
//        .`setDouble$`(doubleValue)
//        .setBigInteger(bigIntegerValue.unsignedByteBuffer())
//        .build()
//
//      `when`("we convert it to bson") {
//
//        val avro = avroSerializer.serialize("block-statistics", record)
//        val struct = avroConverter.toConnectData("block-statistics", avro).value()
//        val bson = StructToBsonConverter.convert(struct, "metric")
//
//        then("all primitive values should be converted to their BSON counterparts") {
//          bson.getInt32("int").value shouldBe intValue
//          bson.getInt64("long").value shouldBe longValue
//          bson.getDouble("float").value shouldBe floatValue
//          bson.getDouble("double").value shouldBe doubleValue
//        }
//
//        then("then the bigInteger field should be converted to Decimal128") {
//          bson.getDecimal128("bigInteger").value shouldBe bigIntegerValue.toDecimal128()
//        }
//      }
//    }

//    given("a token balance record") {
//
//      val address = "689c56aef474df92d44a1b70850f808488f9769c"
//      val amount = 123814982.toBigInteger()
//
//      val record = TokenBalanceRecord.newBuilder()
//        .setAddress(address.hexBuffer20())
//        .setAmount(amount.unsignedByteBuffer())
//        .build()
//
//      `when`("we convert it to bson") {
//
//        val avro = avroSerializer.serialize("balance", record)
//        val struct = avroConverter.toConnectData("balance", avro).value()
//        val bson = StructToBsonConverter.convert(struct, "balance")
//
//        then("the relevant fields should be converted to hex") {
//          bson.getString("address").value shouldBe address
//        }
//
//        then("the relevant fields should be converted to Decimal128") {
//          bson.getDecimal128("amount").value shouldBe amount.toDecimal128()
//        }
//      }
//    }

//    given("a token balance key record") {
//
//      val address = "689c56aef474df92d44a1b70850f808488f9769c"
//      val contract = "123c56aef474df92d44a1b70850f808488f9233c"
//      val tokenId = 12381298.toBigInteger()
//
//      val record = TokenBalanceKeyRecord.newBuilder()
//        .setAddress(address.hexBuffer20())
//        .setContract(contract.hexBuffer20())
//        .setTokenId(tokenId.unsignedByteBuffer())
//        .build()
//
//      `when`("we convert it to bson") {
//
//        val avro = avroSerializer.serialize("balance-key", record)
//        val struct = avroConverter.toConnectData("balance-key", avro).value()
//        val bson = StructToBsonConverter.convert(struct, "balanceId")
//
//        then("the relevant fields should be converted to hex") {
//          bson.getString("address").value shouldBe address
//          bson.getString("contract").value shouldBe contract
//        }
//
//        then("the relevant fields should be converted to Decimal128") {
//          bson.getDecimal128("tokenId").value shouldBe tokenId.toDecimal128()
//        }
//      }
//    }

//    given("a tx record") {
//
//      val hash = "3a1fba5abd9d41457944e91ed097e039b7b12d3d7ba324a3f422db2277a48e28"
//      val address = "689c56aef474df92d44a1b70850f808488f9769c"
//      val data = "123c56aef474df92d44a1b70850f808488f9233c7c1ab412354b"
//      val topic = "123c56aef474df92d44a1b70850f808488f9233c123456bac"
//
//      val logs = mutableListOf<LogRecord>(
//        LogRecord.newBuilder()
//          .setAddress(address.hexBuffer20())
//          .setData(data.hexBuffer())
//          .setTopics(mutableListOf(topic.hexBuffer()))
//          .build()
//      )
//
//      val receipt = TransactionReceiptRecord.newBuilder()
//        .setBlockHash(hash.hexBuffer())
//        .setTransactionHash(hash.hexBuffer())
//        .setLogs(logs)
//        .setGasUsed(123.toBigInteger().unsignedByteBuffer())
//        .setCumulativeGasUsed(123.toBigInteger().unsignedByteBuffer())
//        .setLogsBloom(data.hexBuffer())
//        .build()
//
//      val record = TransactionRecord.newBuilder()
//        .setHash(hash.hexBuffer())
//        .setNonce(123.toBigInteger().unsignedByteBuffer())
//        .setFrom(address.hexBuffer20())
//        .setValue(123.toBigInteger().unsignedByteBuffer())
//        .setGasPrice(123.toBigInteger().unsignedByteBuffer())
//        .setGas(123.toBigInteger().unsignedByteBuffer())
//        .setV(1L)
//        .setR(123.toBigInteger().unsignedByteBuffer())
//        .setS(123.toBigInteger().unsignedByteBuffer())
//        .setReceipt(receipt)
//        .build()
//
//      `when`("we convert it to bson") {
//
//        val avro = avroSerializer.serialize("transactions", record)
//        val struct = avroConverter.toConnectData("transactions", avro).value()
//        val bson = StructToBsonConverter.convert(struct, "transaction")
//
//        then("the relevant fields should be converted to hex") {
//          bson["receipt"] shouldNotBe null
//        }
//      }
//    }
  }
}
