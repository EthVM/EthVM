package com.ethvm.kafka.connect.sources.exchanges.utils

import com.ethvm.avro.exchange.TokenExchangeRateKeyRecord
import com.ethvm.avro.exchange.TokenExchangeRateRecord
import io.confluent.connect.avro.AvroData
import org.apache.avro.specific.SpecificRecordBase
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.SchemaAndValue

object AvroToConnect {

  private val avroData = AvroData(100)

  private val mappings = mapOf(
    TokenExchangeRateKeyRecord::class to TokenExchangeRateKeyRecord.`SCHEMA$`,
    TokenExchangeRateRecord::class to TokenExchangeRateRecord.`SCHEMA$`
  )

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue = avroData.toConnectData(mappings[record::class], record)

  fun toConnectSchema(record: SpecificRecordBase): Schema = avroData.toConnectData(mappings[record::class], record).schema()

  fun toAvroData(schema: Schema, o: Any) = avroData.fromConnectData(schema, o)
}
