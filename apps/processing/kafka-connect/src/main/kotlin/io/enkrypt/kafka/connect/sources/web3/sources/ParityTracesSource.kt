package io.enkrypt.kafka.connect.sources.web3.sources

import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.avro.capture.TransactionKeyRecord
import io.enkrypt.common.extensions.hexBuffer32
import io.enkrypt.kafka.connect.sources.web3.AvroToConnect
import io.enkrypt.kafka.connect.sources.web3.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.sources.web3.toTraceRecord
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter

class ParityTracesSource(sourceContext: SourceTaskContext,
                         parity: JsonRpc2_0ParityExtended,
                         private val rewardTracesTopic: String,
                         private val txTracesTopic: String) : ParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "trace")

  override fun fetchRange(range: ClosedRange<Long>): List<SourceRecord> {

    // force into long for iteration

    val longRange = LongRange(range.start, range.endInclusive)

    return longRange
      .map { blockNumber ->

        val blockParam = DefaultBlockParameter.valueOf(blockNumber.toBigInteger())

        val partitionOffset = mapOf("blockNumber" to blockNumber)

        parity.traceBlock(blockParam).sendAsync()
          .thenApply { resp ->

            resp.traces
              .groupBy { Pair(it.blockHash, it.transactionHash) }
              .toList()
              .map { (key, traces) ->

                if(key.second != null) {
                  // most traces have a tx hash

                  val traceKeyRecord = TransactionKeyRecord.newBuilder()
                    .setTxHash(key.second.hexBuffer32())
                    .build()

                  val traceListRecord = TraceListRecord.newBuilder()
                    .setTraces(
                      traces
                        .filterNot { it.type == "reward" }
                        .map { it.toTraceRecord(TraceRecord.newBuilder()).build() })
                    .build()

                  val traceKeySchemaAndValue = AvroToConnect.toConnectData(traceKeyRecord)
                  val traceValueSchemaAndValue = AvroToConnect.toConnectData(traceListRecord)

                  SourceRecord(
                    partitionKey, partitionOffset, txTracesTopic,
                    traceKeySchemaAndValue.schema(), traceKeySchemaAndValue.value(),
                    traceValueSchemaAndValue.schema(), traceValueSchemaAndValue.value()
                  )
                } else {
                  // reward traces do not contain a tx hash

                  val traceKeyRecord = TransactionKeyRecord.newBuilder()
                    .setTxHash(key.first.hexBuffer32())
                    .build()

                  val traceListRecord = TraceListRecord.newBuilder()
                    .setTraces(
                      traces
                        .filter { it.type == "reward" }
                        .map { it.toTraceRecord(TraceRecord.newBuilder()).build() })
                    .build()

                  val traceKeySchemaAndValue = AvroToConnect.toConnectData(traceKeyRecord)
                  val traceValueSchemaAndValue = AvroToConnect.toConnectData(traceListRecord)

                  SourceRecord(
                    partitionKey, partitionOffset, rewardTracesTopic,
                    traceKeySchemaAndValue.schema(), traceKeySchemaAndValue.value(),
                    traceValueSchemaAndValue.schema(), traceValueSchemaAndValue.value()
                  )

                }

              }

          }

      }.map { future ->
        // wait for everything to complete
        future.join()
      }.flatten()

  }
}
