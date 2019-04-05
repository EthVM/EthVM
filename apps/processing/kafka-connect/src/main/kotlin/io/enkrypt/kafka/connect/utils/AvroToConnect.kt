package io.enkrypt.kafka.connect.utils

import io.confluent.connect.avro.AvroData
import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.CanonicalRecord
import com.ethvm.avro.capture.ContractMetadataRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
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
    ContractMetadataRecord::class to ContractMetadataRecord.`SCHEMA$`,
    TransactionListRecord::class to TransactionListRecord.`SCHEMA$`,
    TransactionReceiptListRecord::class to TransactionReceiptListRecord.`SCHEMA$`,
    CanonicalKeyRecord::class to CanonicalKeyRecord.`SCHEMA$`,
    BlockHeaderRecord::class to BlockHeaderRecord.`SCHEMA$`,
    TransactionRecord::class to TransactionRecord.`SCHEMA$`,
    TransactionReceiptRecord::class to TransactionReceiptRecord.`SCHEMA$`,
    TraceListRecord::class to TraceListRecord.`SCHEMA$`,
    CanonicalRecord::class to CanonicalRecord.`SCHEMA$`
  )

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue = avroData.toConnectData(mappings[record::class], record)
}
