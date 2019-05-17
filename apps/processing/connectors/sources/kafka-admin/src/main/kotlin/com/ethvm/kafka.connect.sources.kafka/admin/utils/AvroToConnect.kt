package com.ethvm.kafka.connect.sources.kafka.admin.utils

import com.ethvm.avro.processing.KafkaOffsetInfoKeyRecord
import com.ethvm.avro.processing.KafkaOffsetInfoRecord
import io.confluent.connect.avro.AvroData
import org.apache.avro.Schema
import org.apache.avro.specific.SpecificRecordBase
import org.apache.kafka.connect.data.SchemaAndValue

object AvroToConnect {

  private val avroData = AvroData(100)

  private val mappings = mapOf(
    KafkaOffsetInfoKeyRecord::class to KafkaOffsetInfoKeyRecord.`SCHEMA$`,
    KafkaOffsetInfoRecord::class to KafkaOffsetInfoRecord.`SCHEMA$`
  )

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue = avroData.toConnectData(mappings[record::class], record)

  fun toConnectSchema(schema: Schema) = avroData.toConnectSchema(schema)
}
