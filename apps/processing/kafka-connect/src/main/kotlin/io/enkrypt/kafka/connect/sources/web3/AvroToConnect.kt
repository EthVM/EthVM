package io.enkrypt.kafka.connect.sources.web3

import io.confluent.connect.avro.AvroData
import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.CanonicalRecord
import io.enkrypt.avro.capture.CompositeKeyRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TransactionKeyRecord
import io.enkrypt.avro.capture.TransactionListRecord
import io.enkrypt.avro.capture.TransactionReceiptListRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.processing.EtherBalanceRecord
import org.apache.avro.specific.SpecificRecordBase
import org.apache.kafka.connect.data.SchemaAndValue

object AvroToConnect {

  val avroData = AvroData(100)

  fun toConnectData(record: SpecificRecordBase): SchemaAndValue = when(record) {
    is TransactionListRecord -> avroData.toConnectData(TransactionListRecord.`SCHEMA$`, record)
    is TransactionReceiptListRecord -> avroData.toConnectData(TransactionReceiptListRecord.`SCHEMA$`, record)
    is EtherBalanceRecord -> avroData.toConnectData(EtherBalanceRecord.`SCHEMA$`, record)
    is CompositeKeyRecord -> avroData.toConnectData(CompositeKeyRecord.`SCHEMA$`, record)
    is BlockKeyRecord -> avroData.toConnectData(BlockKeyRecord.`SCHEMA$`, record)
    is TransactionKeyRecord -> avroData.toConnectData(TransactionKeyRecord.`SCHEMA$`, record)
    is CanonicalKeyRecord -> avroData.toConnectData(CanonicalKeyRecord.`SCHEMA$`, record)
    is BlockHeaderRecord -> avroData.toConnectData(BlockHeaderRecord.`SCHEMA$`, record)
    is TransactionRecord -> avroData.toConnectData(TransactionRecord.`SCHEMA$`, record)
    is TransactionReceiptRecord -> avroData.toConnectData(TransactionReceiptRecord.`SCHEMA$`, record)
    is TraceListRecord -> avroData.toConnectData(TraceListRecord.`SCHEMA$`, record)
    is CanonicalRecord -> avroData.toConnectData(CanonicalRecord.`SCHEMA$`, record)
    else -> throw IllegalArgumentException()
  }

}
