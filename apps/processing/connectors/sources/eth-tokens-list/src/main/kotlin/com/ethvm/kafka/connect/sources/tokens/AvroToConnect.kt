package com.ethvm.kafka.connect.sources.tokens

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.CanonicalRecord
import com.ethvm.avro.capture.ContractKeyRecord
import com.ethvm.avro.capture.EthListRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import io.confluent.connect.avro.AvroData
import mu.KotlinLogging
import org.apache.avro.specific.SpecificRecordBase
import org.apache.kafka.connect.data.SchemaAndValue

object AvroToConnect {

  private val logger = KotlinLogging.logger {}

  private val avroData = AvroData(100)

  private val mappings = mapOf(
    EthListRecord::class to EthListRecord.`SCHEMA$`,
    ContractKeyRecord::class to ContractKeyRecord.`SCHEMA$`,
    TransactionListRecord::class to TransactionListRecord.`SCHEMA$`,
    TransactionReceiptListRecord::class to TransactionReceiptListRecord.`SCHEMA$`,
    CanonicalKeyRecord::class to CanonicalKeyRecord.`SCHEMA$`,
    BlockHeaderRecord::class to BlockHeaderRecord.`SCHEMA$`,
    TransactionRecord::class to TransactionRecord.`SCHEMA$`,
    TransactionReceiptRecord::class to TransactionReceiptRecord.`SCHEMA$`,
    TraceListRecord::class to TraceListRecord.`SCHEMA$`,
    CanonicalRecord::class to CanonicalRecord.`SCHEMA$`
  )

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue =
    requireNotNull(avroData.toConnectData(mappings[record::class], record)) { "Could not find mapping for ${record::class}" }
}
