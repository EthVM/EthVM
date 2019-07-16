package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.ContractEventCreatedRecord
import com.ethvm.avro.capture.ContractEventDestroyedRecord
import com.ethvm.avro.capture.ContractEventListRecord
import com.ethvm.avro.capture.ContractEventRecord
import com.ethvm.avro.capture.ContractEventType
import com.ethvm.avro.capture.ContractKeyRecord
import com.ethvm.avro.capture.TraceCallActionRecord
import com.ethvm.avro.capture.TraceCreateActionRecord
import com.ethvm.avro.capture.TraceDestroyActionRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.BlockMetricKeyRecord
import com.ethvm.avro.processing.BlockMetricsTransactionTraceRecord
import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.TraceKeyRecord
import com.ethvm.common.extensions.getBalanceBI
import com.ethvm.common.extensions.getValueBI
import com.ethvm.common.extensions.hexBuffer
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.toContractEventRecord
import com.ethvm.common.extensions.toFungibleBalanceDeltas
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.ContractCreated
import com.ethvm.kafka.streams.config.Topics.ContractDestroyed
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.StandardTokenDetector
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.KStream
import org.joda.time.DateTime
import java.math.BigInteger
import java.util.Properties

class CanonicalTracesProcessor : AbstractKafkaProcessor() {

  override val id: String = "canonical-traces-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    val canonicalTraces = CanonicalTraces.stream(builder)

    // Block Metrics Transaction Trace

    canonicalTraces
      // genesis block has no traces
      .filter { _, v -> v!!.getTraces().isNotEmpty() }
      .map { _, traceList ->

        var successful = 0
        var failed = 0
        var total = 0
        var internalTxs = 0

        val traces = traceList.getTraces()

        traces
          .filter { it.getTransactionHash() != null } // rewards have no tx hash, only a block hash
          .groupBy { it.getTransactionHash() }
          .forEach { (_, traces) ->

            traces.forEach { trace ->

              when (val action = trace.getAction()) {

                is TraceCallActionRecord -> {

                  if (trace.getTraceAddress().isEmpty()) {

                    // high level parent call is used to determine tx success
                    when (trace.getError()) {
                      null -> successful += 1
                      "" -> successful += 1
                      else -> failed += 1
                    }

                    total += 1
                  }

                  if (trace.getTraceAddress().isNotEmpty() && action.getValueBI() > BigInteger.ZERO) {
                    internalTxs += 1
                  }
                }

                is TraceCreateActionRecord -> {
                  if (action.getValueBI() > BigInteger.ZERO) {
                    internalTxs += 1
                  }
                }

                is TraceDestroyActionRecord -> {
                  if (action.getBalanceBI() > BigInteger.ZERO) {
                    internalTxs += 1
                  }
                }

                else -> {
                }
              }
            }
          }

        // there is always a reward trace even if there is no transactions, except for genesis block
        val blockHash = traces.first { it.blockHash != null }.blockHash

        KeyValue(
          BlockMetricKeyRecord.newBuilder()
            .setBlockHash(blockHash)
            .setTimestamp(DateTime(traceList.getTimestamp()))
            .build(),
          BlockMetricsTransactionTraceRecord.newBuilder()
            .setTimestamp(DateTime(traceList.getTimestamp()))
            .setNumSuccessfulTxs(successful)
            .setNumFailedTxs(failed)
            .setTotalTxs(total)
            .setNumInternalTxs(internalTxs)
            .build()
        )
      }
      .toTopic(Topics.BlockMetricsTransactionTrace)

    // Canonical Contract Lifecycle

    val contractReduceStoreName = "canonical-contract-reduce"

    builder.addStateStore(CanonicalKStreamReducer.store(contractReduceStoreName, Serdes.ContractEventList(), appConfig.unitTesting))

    val contractTypes = setOf("create", "suicide")

    val contractEvents = canonicalTraces
      .mapValues { _, v ->

        val timestamp = DateTime(v.getTimestamp())

        // we only want contract related traces
        ContractEventListRecord.newBuilder()
          .setDeltas(
            v.getTraces()
              .filter { trace -> contractTypes.contains(trace.getType()) }
              .mapNotNull { it.toContractEventRecord(timestamp) }
              .map { record ->
                when (record.type) {

                  ContractEventType.DESTROY -> record

                  ContractEventType.CREATE -> {

                    val created = record.event as ContractEventCreatedRecord

                    // identify the contract type
                    ContractEventRecord.newBuilder(record)
                      .setEvent(
                        ContractEventCreatedRecord.newBuilder(created)
                          .setContractType(StandardTokenDetector.detect(created.code.hexBuffer()!!).first)
                          .build()
                      ).build()
                  }
                }
              }
          ).build()
      }
      .transform(CanonicalKStreamReducer(contractReduceStoreName), contractReduceStoreName)
      .filter { _, change -> change.newValue != change.oldValue }
      .flatMap { _, change ->

        require(change.newValue != null) { "Change newValue cannot be null. A tombstone has been received" }

        val deltas = change.newValue.deltas

        val reversals = change.oldValue
          ?.deltas?.map { delta ->

          // we nullify the trace location fields for reversed events

          when (delta.type) {

            ContractEventType.CREATE -> {

              val event = delta.event as ContractEventCreatedRecord

              ContractEventRecord
                .newBuilder(delta)
                .setEvent(
                  ContractEventCreatedRecord.newBuilder(event)
                    .setTraceLocation(
                      TraceLocationRecord.newBuilder()
                        .setTimestamp(event.traceLocation.timestamp)
                        .build()
                    ).build()
                ).build()
            }

            ContractEventType.DESTROY -> {

              val event = delta.event as ContractEventDestroyedRecord

              ContractEventRecord
                .newBuilder(delta)
                .setEvent(
                  ContractEventDestroyedRecord.newBuilder(event)
                    .setTraceLocation(
                      TraceLocationRecord.newBuilder()
                        .setTimestamp(event.traceLocation.timestamp)
                        .build()
                    ).build()
                ).build()
            }
          }
        } ?: emptyList()

        (reversals + deltas)
          .map { delta ->
            KeyValue(
              ContractKeyRecord.newBuilder()
                .setAddress(delta.address)
                .build(),
              delta
            )
          }
      }

    contractEvents
      .filter { _, v -> v.type == ContractEventType.CREATE }
      .mapValues { _, v -> v.event as ContractEventCreatedRecord }
      .toTopic(ContractCreated)

    contractEvents
      .filter { _, v -> v.type == ContractEventType.DESTROY }
      .mapValues { _, v -> v.event as ContractEventDestroyedRecord }
      .toTopic(ContractDestroyed)

    // Traces count

    canonicalTraces
      .map { k, v ->

        val traces = v.getTraces()

        val rewardTraces = traces.filter { it.transactionHash == null }
        val txTraces = traces.filterNot { it.transactionHash == null }

        var count = 0L

        if (rewardTraces.isNotEmpty()) {
          count += 1
        }

        if (txTraces.isNotEmpty()) {
          count += txTraces
            .groupBy { it.transactionHash }
            .count()
        }

        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("transaction_trace")
            .setNumber(k.number)
            .build(),
          CanonicalCountRecord.newBuilder()
            .setCount(count)
            .build()
        )
      }.toTopic(Topics.CanonicalCountDelta)

    // Flat Map

    canonicalTraces
      .flatMap { _, v ->

        val traces = v!!.getTraces()

        val rewardTraces = traces.filter { it.transactionHash == null }
        val txTraces = traces.filterNot { it.transactionHash == null }

        var records = emptyList<KeyValue<TraceKeyRecord, TraceListRecord>>()

        if (rewardTraces.isNotEmpty()) {
          records = records +
            // block reward and uncle reward traces
            KeyValue(
              TraceKeyRecord.newBuilder()
                .setBlockHash(rewardTraces.map { it.blockHash }.first())
                .build(),
              TraceListRecord.newBuilder()
                .setTraceCount(rewardTraces.size)
                .setTimestamp(v.getTimestamp())
                .setTraces(rewardTraces)
                .build()
            )
        }

        if (txTraces.isNotEmpty()) {

          val blockHash = txTraces.map { it.blockHash }.first()

          records = records + txTraces
            .groupBy { it.transactionHash }
            .map { (transactionHash, tracesForTransaction) ->

              val rootError = tracesForTransaction
                .first { it.traceAddress.isEmpty() }.error

              KeyValue(
                TraceKeyRecord.newBuilder()
                  .setBlockHash(blockHash)
                  .setTransactionHash(transactionHash)
                  .build(),
                TraceListRecord.newBuilder()
                  .setTimestamp(v.getTimestamp())
                  .setRootError(rootError)
                  .setTraceCount(tracesForTransaction.size)
                  .setTraces(tracesForTransaction)
                  .build()
              )
            }
        }

        records
      }
      .toTopic(Topics.TransactionTrace)

    // ether transaction deltas

    val traceReduceStoreName = "canonical-trace-reduce"

    builder.addStateStore(CanonicalKStreamReducer.store(traceReduceStoreName, Serdes.TraceList(), appConfig.unitTesting))

    val etherDeltas = canonicalTraces
      .transform(CanonicalKStreamReducer(traceReduceStoreName), traceReduceStoreName)
      .filter { _, change -> change.newValue != change.oldValue }
      .mapValues { _, change ->

        require(change.newValue != null) { "Change newValue cannot be null. A tombstone has been received" }

        if (change.oldValue == null) {
          toDeltaList(change.newValue, false)
        } else {

          val delta = toDeltaList(change.newValue, false)
          val reversal = toDeltaList(change.oldValue, true)

          FungibleBalanceDeltaListRecord.newBuilder(delta)
            .setDeltas(reversal.deltas + delta.deltas)
            .build()
        }
      }

    toAccountDeltas(etherDeltas).toTopic(Topics.TransactionBalanceDelta)

    return builder.build()
  }

  private fun toDeltaList(traceList: TraceListRecord, reverse: Boolean): FungibleBalanceDeltaListRecord {

    val blockHash = traceList.getTraces().firstOrNull()?.getBlockHash()

    var deltas = traceList.toFungibleBalanceDeltas()

    if (reverse) {
      deltas = deltas.map { it.reverse() }
    }

    val timestamp = DateTime(traceList.getTimestamp())

    return FungibleBalanceDeltaListRecord.newBuilder()
      .setTimestamp(timestamp)
      .setBlockHash(blockHash)
      .setDeltas(deltas)
      .build()
  }

  private fun toAccountDeltas(deltaStream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>) =
    deltaStream
      .flatMap { _, v ->

        v.deltas
          .map { delta ->
            KeyValue(
              FungibleBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .setContract(delta.getContractAddress())
                .build(),
              delta
            )
          }
      }
}
