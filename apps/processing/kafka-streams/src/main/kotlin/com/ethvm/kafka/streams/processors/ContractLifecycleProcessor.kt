package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.ContractKeyRecord
import com.ethvm.avro.capture.ContractLifecycleListRecord
import com.ethvm.avro.capture.ContractLifecycleRecord
import com.ethvm.avro.capture.ContractLifecyleType
import com.ethvm.avro.capture.ContractRecord
import com.ethvm.common.extensions.hexBuffer
import com.ethvm.common.extensions.toContractLifecycleRecord
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalContractLifecycle
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.ContractLifecycleEvents
import com.ethvm.kafka.streams.config.Topics.Contract
import com.ethvm.kafka.streams.utils.StandardTokenDetector
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Materialized
import org.joda.time.DateTime
import java.util.Properties

class ContractLifecycleProcessor : AbstractKafkaProcessor() {

  override val id: String = "contract-lifecycle-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    val contractTypes = setOf("create", "suicide")

    CanonicalTraces.stream(builder)
      .mapValues { _, v ->

        when (v) {
          null -> null
          else -> {

            val blockHash = v.getTraces().firstOrNull()?.getBlockHash()

            val timestamp = DateTime(v.getTimestamp())

            // we only want contract related traces
            ContractLifecycleListRecord.newBuilder()
              .setTimestamp(timestamp)
              .setBlockHash(blockHash)
              .setDeltas(
                v.getTraces()
                  .filter { trace -> contractTypes.contains(trace.getType()) }
                  .mapNotNull { it.toContractLifecycleRecord(timestamp) }
                  .map { record ->
                    when (record.type) {

                      ContractLifecyleType.DESTROY -> record

                      ContractLifecyleType.CREATE ->
                        // identify the contract type
                        ContractLifecycleRecord.newBuilder(record)
                          .setContractType(StandardTokenDetector.detect(record.code.hexBuffer()!!).first)
                          .build()
                    }
                  }
              ).build()
          }
        }
      }.toTopic(CanonicalContractLifecycle)

    CanonicalContractLifecycle.stream(builder)
      .groupByKey()
      .reduce(
        { agg, next ->

          if (agg.getBlockHash() == next.getBlockHash()) {

            // an update has been published for a previously seen block
            // we assume no material change and therefore emit an event which will have no impact

            logger.warn { "Update received. Agg = $agg, next = $next" }

            ContractLifecycleListRecord.newBuilder(agg)
              .setTimestamp(next.getTimestamp())
              .setApply(false)
              .build()

          } else {

            ContractLifecycleListRecord.newBuilder()
              .setTimestamp(next.getTimestamp())
              .setBlockHash(next.getBlockHash())
              .setDeltas(next.getDeltas())
              .setReversals(agg.getDeltas())
              .build()
          }
        },
        Materialized.with(Serdes.CanonicalKey(), Serdes.ContractLifecycleList())
      ).toStream()
      .flatMap { _, v ->

        val reversals = v.getReversals()
          .map { event ->

            KeyValue(
              ContractKeyRecord.newBuilder()
                .setAddress(event.getAddress())
                .build(),
              ContractLifecycleRecord.newBuilder(event)
                .setReverse(true)
                .build()
            )
          }

        val deltas = v.getDeltas()
          .map { event ->

            KeyValue(
              ContractKeyRecord.newBuilder()
                .setAddress(event.getAddress())
                .build(),
              event
            )
          }

        reversals + deltas
      }.toTopic(ContractLifecycleEvents)

    ContractLifecycleEvents.stream(builder)
      .groupByKey()
      .aggregate(
        { null },
        { _, next, agg ->

          val record = when (agg) {
            null -> ContractRecord.newBuilder().setTimestamp(next.getTimestamp())
            else -> ContractRecord.newBuilder(agg).setTimestamp(next.getTimestamp())
          }

          when (next.getType()!!) {

            ContractLifecyleType.CREATE -> {

              if (next.getReverse()) {
                null
              } else {
                record
                  .setAddress(next.getAddress())
                  .setCreator(next.getCreator())
                  .setInit(next.getInit())
                  .setCode(next.getCode())
                  .setContractType(next.getContractType())
                  .setTraceCreatedAt(next.getCreatedAt())
                  .build()
              }
            }

            ContractLifecyleType.DESTROY -> {

              if (next.getReverse()) {
                record
                  .setRefundAddress(null)
                  .setRefundBalance(null)
                  .setTraceDestroyedAt(null)
                  .build()
              } else {
                record
                  .setRefundAddress(next.getRefundAddress())
                  .setRefundBalance(next.getRefundBalance())
                  .setTraceDestroyedAt(next.getDestroyedAt())
                  .build()
              }
            }
          }
        },
        Materialized.with(Serdes.ContractKey(), Serdes.Contract())
      ).toStream()
      .toTopic(Contract)

    return builder.build()
  }
}
