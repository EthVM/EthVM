package io.enkrypt.kafka.connect.utils

import io.confluent.connect.avro.AvroData
import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.CanonicalRecord
import io.enkrypt.avro.capture.ContractMetadataRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TransactionListRecord
import io.enkrypt.avro.capture.TransactionReceiptListRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.processing.EtherBalanceRecord
import org.apache.avro.specific.SpecificRecordBase
import org.apache.kafka.connect.data.SchemaAndValue

object AvroToConnect {

  private val avroData = AvroData(100)

  private val mappings = mapOf(
    ContractMetadataRecord::class to ContractMetadataRecord.`SCHEMA$`,
    TransactionListRecord::class to TransactionListRecord.`SCHEMA$`,
    TransactionReceiptListRecord::class to TransactionReceiptListRecord.`SCHEMA$`,
    EtherBalanceRecord::class to EtherBalanceRecord.`SCHEMA$`,
    CanonicalKeyRecord::class to CanonicalKeyRecord.`SCHEMA$`,
    BlockHeaderRecord::class to BlockHeaderRecord.`SCHEMA$`,
    TransactionRecord::class to TransactionRecord.`SCHEMA$`,
    TransactionReceiptRecord::class to TransactionReceiptRecord.`SCHEMA$`,
    TraceListRecord::class to TraceListRecord.`SCHEMA$`,
    CanonicalRecord::class to CanonicalRecord.`SCHEMA$`
  )

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue = avroData.toConnectData(mappings[record::class], record)

}
