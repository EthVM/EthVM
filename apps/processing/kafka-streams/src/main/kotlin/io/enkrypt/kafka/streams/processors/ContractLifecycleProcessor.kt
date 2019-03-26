package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.ContractKeyRecord
import io.enkrypt.avro.capture.ContractLifecycleListRecord
import io.enkrypt.avro.capture.ContractLifecycleRecord
import io.enkrypt.avro.capture.ContractLifecyleType
import io.enkrypt.avro.capture.ContractRecord
import io.enkrypt.common.extensions.toContractLifecycleRecord
import io.enkrypt.kafka.streams.Serdes
import io.enkrypt.kafka.streams.config.Topics.CanonicalContractLifecycle
import io.enkrypt.kafka.streams.config.Topics.CanonicalContractTraces
import io.enkrypt.kafka.streams.config.Topics.ContractLifecycleEvents
import io.enkrypt.kafka.streams.config.Topics.Contracts
import io.enkrypt.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.Materialized
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class ContractLifecycleProcessor : AbstractKafkaProcessor() {

  override val id: String = "contract-lifecycle-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder().apply {}

    CanonicalContractTraces.stream(builder)
      .mapValues { k, v ->
        when (v) {
          null -> null
          else -> {

            ContractLifecycleListRecord.newBuilder()
              .setBlockNumber(k.getNumber())
              .setReverse(false)
              .setLifecycleRecords(
                v.getTraces().mapNotNull { it.toContractLifecycleRecord() }
              ).build()

          }
        }
      }.toTopic(CanonicalContractLifecycle)

    CanonicalContractLifecycle.table(builder)
      .groupBy(
        { k, v -> KeyValue(k.getNumber(), v) },
        Grouped.with(KafkaSerdes.String(), Serdes.ContractLifecycleList())
      ).reduce(
        { _, new ->
          // We should only see an update that contains no change in info. Any real update should be preceeded with a tombstone first
          // so we emit an empty update
          ContractLifecycleListRecord.newBuilder(new)
            .setLifecycleRecords(emptyList())
            .build()
        },
        { _, old ->
          // a tombstone has been received, likely fork scenario. Need to undo
          ContractLifecycleListRecord.newBuilder(old)
            .setReverse(true)
            .build()
        },
        Materialized.with(KafkaSerdes.String(), Serdes.ContractLifecycleList())
      ).toStream()
      .flatMap { _, v ->

        v.getLifecycleRecords()
          .map { record ->
            ContractLifecycleRecord.newBuilder(record)
              .setReverse(v.getReverse())
              .build()
          }.map { record ->
            KeyValue(
              ContractKeyRecord.newBuilder()
                .setAddress(record.getAddress())
                .build(),
              record
            )
          }

      }.toTopic(ContractLifecycleEvents)

    ContractLifecycleEvents.stream(builder)
      .groupByKey()
      .aggregate(
        { ContractRecord.newBuilder().build() },
        { _, new, agg ->

          when (new.getType()) {
            ContractLifecyleType.CREATE -> {

              if (new.getReverse()) {
                ContractRecord.newBuilder(agg)
                  .setAddress(null)
                  .setCreator(null)
                  .setInit(null)
                  .setCode(null)
                  .setCreatedAt(null)
                  .build()
              } else {
                ContractRecord.newBuilder(agg)
                  .setAddress(new.getAddress())
                  .setCreator(new.getCreator())
                  .setInit(new.getInit())
                  .setCode(new.getCode())
                  .setCreatedAt(new.getCreatedAt())
                  .build()
              }

            }

            ContractLifecyleType.DESTROY -> {

              if (new.getReverse()) {
                ContractRecord.newBuilder(agg)
                  .setRefundAddress(null)
                  .setRefundBalance(null)
                  .setDestroyedAt(null)
                  .build()
              } else {
                ContractRecord.newBuilder(agg)
                  .setRefundAddress(new.getRefundAddress())
                  .setRefundBalance(new.getRefundBalance())
                  .setDestroyedAt(new.getDestroyedAt())
                  .build()
              }

            }

            ContractLifecyleType.METADATA -> {

              if (new.getReverse()) {
                ContractRecord.newBuilder(agg)
                  .setMetadata(null)
                  .build()
              } else {
                ContractRecord.newBuilder(agg)
                  .setMetadata(new.getMetadata())
                  .build()
              }

            }

          }
        },
        Materialized.with(Serdes.ContractKey(), Serdes.Contract())
      ).toStream()
      .mapValues { v ->

        if (v.getCreatedAt() == null) {
          // send tombstone to remove the key altogether
          null
        } else {
          v
        }

      }.toTopic(Contracts)

    return builder.build()
  }
}
