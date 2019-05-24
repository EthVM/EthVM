package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TraceRecord
import com.ethvm.common.extensions.getBlockNumberBI
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.ext.toTraceRecord
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter

class ParityTracesSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val tracesTopic: String,
  syncStateTopic: String
) : AbstractParityEntitySource(sourceContext, parity, syncStateTopic) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "trace")

  override val batchSize = 256

  private val chunkSize = batchSize / 4

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    val futures = range
      .chunked(chunkSize)
      .map{ chunkedRange ->

        parity.ethvmGetTracesByNumber(
          chunkedRange.first().toBigInteger(),
          chunkedRange.last().toBigInteger()
        ).sendAsync()
          .thenApply { resp ->

            val traceRecordsByBlockNumber = resp.traces
              .map { it.toTraceRecord(TraceRecord.newBuilder()).build() }
              .groupBy { it.getBlockNumberBI() }

            chunkedRange.map { blockNumber ->

              val blockNumberBI = blockNumber.toBigInteger()

              val traceRecords = traceRecordsByBlockNumber
                .getOrDefault(blockNumberBI, emptyList())

              val partitionOffset = mapOf("blockNumber" to blockNumber)

              val traceKeyRecord = CanonicalKeyRecord.newBuilder()
                .setNumberBI(blockNumberBI)
                .build()

              val traceListRecord = TraceListRecord
                .newBuilder()
                .setTraces(traceRecords)
                .build()

              val traceKeySchemaAndValue = AvroToConnect.toConnectData(traceKeyRecord)
              val traceValueSchemaAndValue = AvroToConnect.toConnectData(traceListRecord)

              SourceRecord(
                partitionKey,
                partitionOffset,
                tracesTopic,
                traceKeySchemaAndValue.schema(),
                traceKeySchemaAndValue.value(),
                traceValueSchemaAndValue.schema(),
                traceValueSchemaAndValue.value()
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

        val traceKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val traceKeySchemaAndValue = AvroToConnect.toConnectData(traceKeyRecord)

        SourceRecord(
          partitionKey,
          partitionOffset,
          tracesTopic,
          traceKeySchemaAndValue.schema(),
          traceKeySchemaAndValue.value(),
          AvroToConnect.toConnectSchema(TraceListRecord.`SCHEMA$`),
          null
        )
      }
}
