package com.ethvm.kafka.streams.processors

import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.NonFungibleBalanceKeyRecord
import com.ethvm.avro.processing.NonFungibleBalanceRecord
import com.ethvm.common.extensions.getBlockNumberBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.Erc721BalanceDelta
import com.ethvm.kafka.streams.config.Topics.NonFungibleBalance
import com.ethvm.kafka.streams.config.Topics.Erc721BalanceLog
import com.ethvm.kafka.streams.utils.BlockEventTimestampExtractor
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import java.util.Properties

class NonFungibleBalanceProcessor : AbstractKafkaProcessor() {

  override val id: String = "non-fungible-balance-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
      put(StreamsConfig.DEFAULT_TIMESTAMP_EXTRACTOR_CLASS_CONFIG, BlockEventTimestampExtractor::class.java)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder()

    val erc721Deltas = Erc721BalanceDelta.stream(builder)

    // only one stream to aggregate for now
    val erc721Balances = aggregateBalances(erc721Deltas)

    erc721Balances.toTopic(Erc721BalanceLog)
    erc721Balances.toTopic(NonFungibleBalance)

    // Generate the topology
    return builder.build()
  }

  private fun aggregateBalances(deltaStream: KStream<NonFungibleBalanceKeyRecord, NonFungibleBalanceDeltaRecord>) =
    deltaStream
      .groupByKey(Grouped.with(Serdes.NonFungibleBalanceKey(), Serdes.NonFungibleBalanceDelta()))
      .aggregate(
        {
          NonFungibleBalanceRecord.newBuilder()
            .setTraceLocation(
              TraceLocationRecord.newBuilder()
                .build()
            )
            .setAddress("0x0")
            .build()
        },
        { _, delta, balance ->

          val balanceLocation = balance.getTraceLocation()
          val deltaLocation = delta.getTraceLocation()

          val newBalance = NonFungibleBalanceRecord.newBuilder()
            .setTraceLocation(deltaLocation)
            .setAddress(delta.getTo())
            .setContract(delta.getContract())
            .setTokenId(delta.getTokenId())
            .build()

          /**
           * We only update the balance if the delta has occurred later than or in the exact same position in the chain as the
           * balance. When the delta is later it's obvious. When the delta has the same trace location it means we have published a
           * reversal due to a fork
           */

          if (
            (balanceLocation.getBlockNumber() == null) ||
            (balanceLocation.getBlockNumberBI() <= deltaLocation.getBlockNumberBI()) ||
            (balanceLocation.getTransactionIndex() <= deltaLocation.getTransactionIndex()) ||
            (balanceLocation.getLogIndex() <= deltaLocation.getLogIndex())
          ) {
            newBalance
          } else
            balance
        },
        Materialized.with(Serdes.NonFungibleBalanceKey(), Serdes.NonFungibleBalance())
      ).toStream()

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
