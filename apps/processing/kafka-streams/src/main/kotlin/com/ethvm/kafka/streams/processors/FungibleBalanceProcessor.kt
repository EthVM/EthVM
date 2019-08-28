package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.FungibleBalanceRecord
import com.ethvm.common.extensions.getAmountBI
import com.ethvm.common.extensions.setAmountBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.FungibleBalance
import com.ethvm.kafka.streams.config.Topics.FungibleBalanceDelta
import com.ethvm.kafka.streams.processors.transformers.OncePerBlockTransformer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import java.math.BigInteger
import java.util.Properties

class FungibleBalanceProcessor : AbstractKafkaProcessor() {

  override val id: String = "fungible-balance-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 2)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {
      addStateStore(OncePerBlockTransformer.canonicalRecordsStore(appConfig.unitTesting))
    }

    aggregate(FungibleBalanceDelta.stream(builder)).toTopic(FungibleBalance)

    // Generate the topology
    return builder.build()
  }

  private fun aggregate(deltaStream: KStream<FungibleBalanceKeyRecord, FungibleBalanceDeltaRecord>): KStream<FungibleBalanceKeyRecord, FungibleBalanceRecord> {

    val agg = deltaStream
      .groupByKey(Grouped.with(Serdes.FungibleBalanceKey(), Serdes.FungibleBalanceDelta()))
      .aggregate(
        {
          FungibleBalanceRecord.newBuilder()
            .setAmountBI(BigInteger.ZERO)
            .build()
        },
        { _, delta, balance ->

          FungibleBalanceRecord.newBuilder()
            .setTimestamp(delta.getTraceLocation().getTimestamp())
            .setAmountBI(delta.getAmountBI() + balance.getAmountBI())
            .setAddress(delta.getAddress())
            .setContract(delta.getContractAddress())
            .build()
        },
        Materialized.with(Serdes.FungibleBalanceKey(), Serdes.FungibleBalance())
      )

    return agg.toStream()
  }
}
