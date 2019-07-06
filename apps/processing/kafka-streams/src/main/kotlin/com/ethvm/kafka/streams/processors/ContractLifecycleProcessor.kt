package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.ContractKeyRecord
import com.ethvm.avro.capture.ContractLifecycleRecord
import com.ethvm.avro.capture.ContractLifecyleType
import com.ethvm.avro.capture.ContractRecord
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalContractLifecycle
import com.ethvm.kafka.streams.config.Topics.Contract
import com.ethvm.kafka.streams.config.Topics.ContractLifecycleEvents
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Materialized
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

    val reduceStoreName = "canonical-contract-lifecycle-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(reduceStoreName, Serdes.ContractLifecycleList(), appConfig.unitTesting))

    CanonicalContractLifecycle.stream(builder)
      .transform(CanonicalKStreamReducer(reduceStoreName), reduceStoreName)
      .filter { _, change -> change.newValue != change.oldValue }
      .flatMapValues { _, change ->

        require(change.newValue != null) { "Change newValue cannot be null. A tombstone has been received" }

        val deltas = change.newValue.deltas!!

        val reversals = change.oldValue?.deltas?.map {
          ContractLifecycleRecord.newBuilder(it)
            .setReverse(true)
            .build()
        } ?: emptyList<ContractLifecycleRecord>()

        reversals + deltas
      }
      // re-key by contract key
      .map { _, v ->
        KeyValue(
          ContractKeyRecord.newBuilder()
            .setAddress(v.address)
            .build(),
          v
        )
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
