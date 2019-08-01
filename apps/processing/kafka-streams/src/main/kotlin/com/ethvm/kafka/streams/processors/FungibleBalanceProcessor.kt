package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaType
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.FungibleBalanceRecord
import com.ethvm.avro.processing.FungibleTokenType
import com.ethvm.common.extensions.getAmountBI
import com.ethvm.common.extensions.setAmountBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.Erc20BalanceDelta
import com.ethvm.kafka.streams.config.Topics.Erc20BalanceLog
import com.ethvm.kafka.streams.config.Topics.FungibleBalance
import com.ethvm.kafka.streams.config.Topics.FungibleBalanceDelta
import com.ethvm.kafka.streams.config.Topics.HardForkBalanceDelta
import com.ethvm.kafka.streams.config.Topics.HardForkBalanceLog
import com.ethvm.kafka.streams.config.Topics.MinerFeeBalanceDelta
import com.ethvm.kafka.streams.config.Topics.MinerFeeBalanceLog
import com.ethvm.kafka.streams.config.Topics.PremineBalanceDelta
import com.ethvm.kafka.streams.config.Topics.PremineBalanceLog
import com.ethvm.kafka.streams.config.Topics.TransactionBalanceDelta
import com.ethvm.kafka.streams.config.Topics.TransactionBalanceLog
import com.ethvm.kafka.streams.config.Topics.TransactionFeeBalanceDelta
import com.ethvm.kafka.streams.config.Topics.TransactionFeeBalanceLog
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
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {
      addStateStore(OncePerBlockTransformer.canonicalRecordsStore(appConfig.unitTesting))
    }

    val premineDeltas = PremineBalanceDelta.stream(builder)
    val hardForkDeltas = HardForkBalanceDelta.stream(builder)

    val transactionDeltas = TransactionBalanceDelta.stream(builder)
    val transactionFeeDeltas = TransactionFeeBalanceDelta.stream(builder)
    val minerFeeDeltas = MinerFeeBalanceDelta.stream(builder)
    val erc20Deltas = Erc20BalanceDelta.stream(builder)

    aggregate(premineDeltas).toTopic(PremineBalanceLog)
    aggregate(hardForkDeltas).toTopic(HardForkBalanceLog)
    aggregate(transactionDeltas).toTopic(TransactionBalanceLog)
    aggregate(transactionFeeDeltas).toTopic(TransactionFeeBalanceLog)
    aggregate(minerFeeDeltas).toTopic(MinerFeeBalanceLog)
    aggregate(erc20Deltas).toTopic(Erc20BalanceLog)

    val allDeltas = premineDeltas
      .merge(hardForkDeltas)
      .merge(transactionDeltas)
      .merge(transactionFeeDeltas)
      .merge(minerFeeDeltas)
      .merge(erc20Deltas)

    aggregate(allDeltas).toTopic(FungibleBalance)

    allDeltas.toTopic(FungibleBalanceDelta)

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
