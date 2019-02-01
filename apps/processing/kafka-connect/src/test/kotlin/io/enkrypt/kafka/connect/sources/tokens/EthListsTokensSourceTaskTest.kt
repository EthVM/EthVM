package io.enkrypt.kafka.connect.sources.tokens

import io.enkrypt.avro.common.Data20
import io.enkrypt.common.codec.Hex
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.SchemaBuilder
import org.apache.kafka.connect.data.Struct

class EthListsTokensSourceTaskTest : BehaviorSpec() {

  init {
    given("a EthListsTokenSource") {
      val sink = Struct(EthListsTokensSourceTask.EthTokenKeySchema).apply {
        val address = Data20(Hex.decode("f9d9702d031407f425a4412682fdc56b07d05262"))
        val value = SchemaBuilder(Schema.Type.STRUCT)
          .name("io.enkrypt.avro.common.Data20")
          .defaultValue(address)
          .build()
        put("address", value)
      }

      `when`("we ask for its version number") {
        then("we obtain a concrete value") {
          true shouldNotBe true
        }
      }
    }
  }
}
