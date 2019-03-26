package io.enkrypt.kafka.connect.sources.web3.sources

import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.common.extensions.setNumberBI
import io.enkrypt.kafka.connect.utils.AvroToConnect
import io.enkrypt.kafka.connect.sources.web3.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.sources.web3.toTraceRecord
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter

class ParityTracesSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val tracesTopic: String,
  private val contractTracesTopic: String
) : ParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "trace")

  override fun fetchRange(range: ClosedRange<Long>): List<SourceRecord> {

    // force into long for iteration

    val longRange = LongRange(range.start, range.endInclusive)

    val contractTypes = setOf("create", "suicide")

    return longRange
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val blockParam = DefaultBlockParameter.valueOf(blockNumberBI)

        val partitionOffset = mapOf("blockNumber" to blockNumber)

        parity.traceBlock(blockParam).sendAsync()
          .thenApply { resp ->

            val traceKeyRecord = CanonicalKeyRecord.newBuilder()
              .setNumberBI(blockNumberBI)
              .build()

            var allTraces = emptyList<TraceRecord>()
            var contractTraces = emptyList<TraceRecord>()

            resp.traces.forEach{ trace ->

              val record = trace.toTraceRecord(TraceRecord.newBuilder()).build()
              allTraces = allTraces + record

              if(contractTypes.contains(trace.type)) {
                contractTraces = contractTraces + record
              }
            }

            val traceListRecord = TraceListRecord
              .newBuilder()
              .setTraces(allTraces)
              .build()

            val traceKeySchemaAndValue = AvroToConnect.toConnectData(traceKeyRecord)
            val traceValueSchemaAndValue = AvroToConnect.toConnectData(traceListRecord)

            var result = listOf(
              SourceRecord(
                partitionKey, partitionOffset, tracesTopic,
                traceKeySchemaAndValue.schema(), traceKeySchemaAndValue.value(),
                traceValueSchemaAndValue.schema(), traceValueSchemaAndValue.value()
              )
            )

            // publish a separate entry just for contract lifecycle

            if(contractTraces.isNotEmpty()) {

              val contractTraceListRecord = TraceListRecord
                .newBuilder()
                .setTraces(contractTraces)
                .build()

              val contractTraceValueSchemaAndValue = AvroToConnect.toConnectData(contractTraceListRecord)

              result = result +
                SourceRecord(
                  partitionKey, partitionOffset, contractTracesTopic,
                  traceKeySchemaAndValue.schema(), traceKeySchemaAndValue.value(),
                  contractTraceValueSchemaAndValue.schema(), contractTraceValueSchemaAndValue.value()
                )

            }

            result

          }
      }.map { future ->
        // wait for everything to complete
        future.join()
      }.flatten()
  }
}
