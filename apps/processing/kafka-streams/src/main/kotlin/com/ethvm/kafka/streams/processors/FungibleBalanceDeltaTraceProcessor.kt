package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.toFungibleBalanceDeltas
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.TransactionBalanceDelta
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.joda.time.DateTime
import java.lang.IllegalStateException
import java.util.Properties

class FungibleBalanceDeltaTraceProcessor : AbstractFungibleBalanceDeltaProcessor() {

  override val id: String = "fungible-balance-delta-trace-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger = KotlinLogging.logger {}

  private val traceReduceStoreName = "canonical-trace-reduce"

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {
      addStateStore(CanonicalKStreamReducer.store(traceReduceStoreName, Serdes.TraceList(), appConfig.unitTesting))
    }

    val txDeltas = etherDeltasForTraces(builder)

    toAccountDeltas(txDeltas).toTopic(TransactionBalanceDelta)

    // Generate the topology
    return builder.build()
  }

  /**
   *
   */
  private fun etherDeltasForTraces(builder: StreamsBuilder) =

    CanonicalTraces.stream(builder)
      .transform(CanonicalKStreamReducer(traceReduceStoreName), traceReduceStoreName)
      .filter { _, v -> v.newValue != v.oldValue }
      .mapValues { _, change ->

        when {
          change.newValue != null && change.oldValue == null ->
            toDeltaList(change.newValue, false)
          change.newValue == null && change.oldValue != null ->
            toDeltaList(change.oldValue, true)
          else -> throw IllegalStateException("New and old values cannot be unique non null values.")
        }

      }

  private fun toDeltaList(traceList: TraceListRecord, reverse: Boolean): FungibleBalanceDeltaListRecord{

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


}
