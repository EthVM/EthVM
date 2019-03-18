package io.enkrypt.kafka.connect.sources.web3.sources

import io.enkrypt.avro.capture.CanonicalEtherBalanceKeyRecord
import io.enkrypt.avro.capture.CanonicalKeyRecord
import io.enkrypt.avro.capture.EtherBalanceRecord
import io.enkrypt.avro.capture.TraceCallActionRecord
import io.enkrypt.avro.capture.TraceCreateActionRecord
import io.enkrypt.avro.capture.TraceDestroyActionRecord
import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TraceRecord
import io.enkrypt.avro.capture.TraceRewardActionRecord
import io.enkrypt.kafka.connect.sources.web3.AvroToConnect
import io.enkrypt.kafka.connect.sources.web3.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.sources.web3.toTraceRecord
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.parity.methods.response.Trace
import kotlin.math.log
import java.util.stream.Collectors
import java.util.concurrent.CompletableFuture


class ParityTracesSource(sourceContext: SourceTaskContext,
                         parity: JsonRpc2_0ParityExtended,
                         private val tracesTopic: String,
                         private val balancesTopic: String) : ParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "trace")

  override fun fetchRange(range: ClosedRange<Long>): List<SourceRecord> {

    // force into long for iteration

    val longRange = LongRange(range.start, range.endInclusive)

    return longRange
      .map { blockNumber ->

        val blockParam = DefaultBlockParameter.valueOf(blockNumber.toBigInteger())

        val partitionOffset = mapOf("blockNumber" to blockNumber)

        parity.traceBlock(blockParam).sendAsync()
          .thenCompose { resp ->

            val (traceRecords, touchedAddresses) = toTraceRecords(resp.traces)

            val traceKeyRecord = CanonicalKeyRecord.newBuilder()
              .setNumber(blockNumber.toString())
              .build()

            val traceListRecord = TraceListRecord
              .newBuilder()
              .setTraces(traceRecords)
              .build()

            val traceKeySchemaAndValue = AvroToConnect.toConnectData(traceKeyRecord)
            val traceValueSchemaAndValue = AvroToConnect.toConnectData(traceListRecord)

            val traceSourceRecord = SourceRecord(
              partitionKey, partitionOffset, tracesTopic,
              traceKeySchemaAndValue.schema(), traceKeySchemaAndValue.value(),
              traceValueSchemaAndValue.schema(), traceValueSchemaAndValue.value()
            )

            logger.debug { "Block = $blockNumber, touched = ${touchedAddresses.size}, addresses = $touchedAddresses" }

            val balanceFutures = touchedAddresses
              .map { address ->
                parity.ethGetBalance(address, blockParam).sendAsync()
                  .thenApply { resp ->

                    val balanceKeyRecord = CanonicalEtherBalanceKeyRecord.newBuilder()
                      .setAddress(address)
                      .setBlockNumber(blockNumber.toString())
                      .build()

                    val balanceRecord = EtherBalanceRecord.newBuilder()
                      .setBalance(resp.balance.toString())
                      .build()

                    val balanceKeySchemaAndValue = AvroToConnect.toConnectData(balanceKeyRecord)
                    val balanceValueSchemaAndValue = AvroToConnect.toConnectData(balanceRecord)

                    SourceRecord(
                      partitionKey, partitionOffset, balancesTopic,
                      balanceKeySchemaAndValue.schema(), balanceKeySchemaAndValue.value(),
                      balanceValueSchemaAndValue.schema(), balanceValueSchemaAndValue.value()
                    )

                  }
              }

            allOf(balanceFutures + CompletableFuture.completedFuture(traceSourceRecord))

          }

      }.map { future ->
        // wait for everything to complete
        future.join()
      }.flatten()

  }

  private fun <T> allOf(futuresList: List<CompletableFuture<T>>): CompletableFuture<List<T>> {
    val allFuturesResult = CompletableFuture.allOf(*futuresList.toTypedArray())
    return allFuturesResult.thenApply {
      futuresList.map { it.join() }
    }
  }

  private fun toTraceRecords(traces: List<Trace>): Pair<List<TraceRecord>, Set<String>> =
    traces.map { trace ->

      var touchedAddresses = emptySet<String>()
      val record = trace.toTraceRecord(TraceRecord.newBuilder()).build()

      val action = record.getAction()
      when (action) {
        is TraceCallActionRecord -> {
          if (action.getValue() != null && !(action.getValue() == "" || action.getValue() == "0")) {
            touchedAddresses = touchedAddresses + listOf(action.getFrom(), action.getTo())
          }
        }
        is TraceRewardActionRecord -> {
          touchedAddresses = touchedAddresses + action.getAuthor()
        }
        is TraceCreateActionRecord -> {
          if (trace.result != null && action.getValue() != null && !(action.getValue() == "" || action.getValue() == "0")) {
            touchedAddresses = touchedAddresses + listOf(action.getFrom(), trace.result.address)
          }
        }
        is TraceDestroyActionRecord -> {
          touchedAddresses = touchedAddresses + listOf(action.getAddress(), action.getRefundAddress())
        }
      }

      Pair(record, touchedAddresses)
    }.fold(Pair(emptyList(), emptySet())) { memo, next -> Pair(memo.first + next.first, memo.second + next.second) }

}
