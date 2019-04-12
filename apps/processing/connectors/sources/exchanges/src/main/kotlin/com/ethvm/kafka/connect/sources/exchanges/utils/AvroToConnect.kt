package com.ethvm.kafka.connect.sources.exchanges.utils

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.exchange.ExchangeRateRecord
import com.ethvm.avro.exchange.SymbolKeyRecord
import io.confluent.connect.avro.AvroData
import mu.KotlinLogging
import org.apache.avro.specific.SpecificRecordBase
import org.apache.kafka.connect.data.SchemaAndValue

object AvroToConnect {

  private val logger = KotlinLogging.logger {}

  private val avroData = AvroData(100)

  init {
    val schema = avroData.toConnectSchema(CanonicalKeyRecord.`SCHEMA$`)
    logger.info { "######### Canonical schema: ${schema.field("number")}" }
  }

  private val mappings = mapOf(
    SymbolKeyRecord::class to SymbolKeyRecord.`SCHEMA$`,
    ExchangeRateRecord::class to ExchangeRateRecord.`SCHEMA$`
  )

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue = avroData.toConnectData(mappings[record::class], record)
}
