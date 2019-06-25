package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.common.extensions.toFungibleBalanceDeltas
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.TransactionBalanceDelta
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.joda.time.DateTime
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

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder()

    val txDeltas = etherDeltasForTraces(builder)

    toAccountDeltas(txDeltas).toTopic(TransactionBalanceDelta)

    // Generate the topology
    return builder.build()
  }

  /**
   *
   */
  private fun etherDeltasForTraces(builder: StreamsBuilder) =
    withReversals(
      CanonicalTraces.stream(builder)
        .mapValues { _, tracesList ->

          if (tracesList == null) {
            // pass through the tombstone
            null
          } else {

            val blockHash = tracesList.getTraces().firstOrNull()?.getBlockHash()

            when (tracesList) {
              null -> null
              else -> {

                val timestamp = DateTime(tracesList.getTimestamp())

                FungibleBalanceDeltaListRecord.newBuilder()
                  .setTimestamp(timestamp)
                  .setBlockHash(blockHash)
                  .setDeltas(tracesList.toFungibleBalanceDeltas())
                  .build()
              }
            }
          }
        }
    )

}
