package io.enkrypt.kafka.connect.sinks.mongo

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
import org.bson.BsonNull
import org.bson.BsonString
import java.nio.ByteBuffer

class StructToBsonConverterTest : BehaviorSpec() {

  init {

    given("a null value") {

      `when`("we perform a conversion") {

        val bsonDocument = StructToBsonConverter.convert(null)
        val bsonDocument2 = StructToBsonConverter.convert(null, allowNulls = true)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result1"] shouldBe BsonString("test")
          bsonDocument["result2"] shouldBe BsonString("")
          bsonDocument["result3"] shouldBe BsonNull()
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

        val bsonDocument = StructToBsonConverter.convert(struct)

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

        val bsonDocument = StructToBsonConverter.convert(struct)

        then("we obtain the value converted successfully") {
          bsonDocument shouldNotBe null
          bsonDocument["result"] shouldBe BsonArray(listOf(BsonBoolean(true), BsonBoolean(false)))
        }
      }
    }
  }
}
