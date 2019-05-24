package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.common.extensions.getBlockNumberBI
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.ext.toTransactionReceiptRecord
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext

class ParityReceiptsSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val receiptsTopic: String,
  syncStateTopic: String
) : AbstractParityEntitySource(sourceContext, parity, syncStateTopic) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "receipt")

  override val batchSize = 256

  private val chunkSize = batchSize / 4

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    val futures = range
      .chunked(chunkSize)
      .map { chunkedRange ->
        parity.ethvmGetReceiptsByNumber(
          chunkedRange.first().toBigInteger(),
          chunkedRange.last().toBigInteger()
        ).sendAsync()
          .thenApply { resp ->

            val receiptRecordsByNumber = resp.receipts
              .map { it.toTransactionReceiptRecord(TransactionReceiptRecord.newBuilder()).build() }
              .groupBy { it.getBlockNumberBI() }

            chunkedRange.map{ blockNumber ->

              val blockNumberBI = blockNumber.toBigInteger()

              val receiptRecords = receiptRecordsByNumber.getOrDefault(blockNumberBI, emptyList())

              val partitionOffset = mapOf("blockNumber" to blockNumber)

              val receiptKeyRecord = CanonicalKeyRecord
                .newBuilder()
                .setNumberBI(blockNumberBI)
                .build()

              val receiptListRecord = TransactionReceiptListRecord
                .newBuilder()
                .setReceipts(receiptRecords)
                .build()

              val receiptKeySchemaAndValue = AvroToConnect.toConnectData(receiptKeyRecord)
              val receiptValueSchemaAndValue = AvroToConnect.toConnectData(receiptListRecord)

              SourceRecord(
                partitionKey,
                partitionOffset,
                receiptsTopic,
                receiptKeySchemaAndValue.schema(),
                receiptKeySchemaAndValue.value(),
                receiptValueSchemaAndValue.schema(),
                receiptValueSchemaAndValue.value()
              )
            }

          }
      }

    return futures
      .map { it.join() }
      .flatten()
  }

  override fun tombstonesForRange(range: LongRange): List<SourceRecord> =
    range
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val partitionOffset = mapOf("blockNumber" to blockNumber)

        val receiptKeyRecord = CanonicalKeyRecord
          .newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val receiptKeySchemaAndValue = AvroToConnect.toConnectData(receiptKeyRecord)

        SourceRecord(
          partitionKey,
          partitionOffset,
          receiptsTopic,
          receiptKeySchemaAndValue.schema(),
          receiptKeySchemaAndValue.value(),
          AvroToConnect.toConnectSchema(TransactionReceiptListRecord.`SCHEMA$`),
          null
        )
      }
}
