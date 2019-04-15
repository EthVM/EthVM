package com.ethvm.kafka.connect.sources.exchanges.utils

import com.ethvm.avro.exchange.SymbolKeyRecord
import com.ethvm.avro.exchange.TokenExchangeRateRecord
import io.confluent.connect.avro.AvroData
import org.apache.avro.specific.SpecificRecordBase
import org.apache.kafka.connect.data.SchemaAndValue

object AvroToConnect {

  private val avroData = AvroData(100)

  private val mappings = mapOf(
    SymbolKeyRecord::class to SymbolKeyRecord.`SCHEMA$`,
    TokenExchangeRateRecord::class to TokenExchangeRateRecord.`SCHEMA$`
  )

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue = avroData.toConnectData(mappings[record::class], record)
}
