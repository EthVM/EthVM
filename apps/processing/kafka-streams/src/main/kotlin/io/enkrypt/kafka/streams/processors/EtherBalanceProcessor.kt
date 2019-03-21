package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.processing.EtherBalanceDeltaListRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaType
import io.enkrypt.avro.processing.EtherBalanceKeyRecord
import io.enkrypt.avro.processing.EtherBalanceRecord
import io.enkrypt.common.extensions.getAmountBI
import io.enkrypt.common.extensions.getNumberBI
import io.enkrypt.common.extensions.getTransactionFeeBI
import io.enkrypt.common.extensions.hexToBI
import io.enkrypt.common.extensions.hexUBigInteger
import io.enkrypt.common.extensions.reverse
import io.enkrypt.common.extensions.setAmountBI
import io.enkrypt.common.extensions.setBlockNumberBI
import io.enkrypt.common.extensions.toEtherBalanceDeltas
import io.enkrypt.kafka.streams.Serdes
import io.enkrypt.kafka.streams.config.Topics.CanonicalBlockAuthors
import io.enkrypt.kafka.streams.config.Topics.CanonicalBlocks
import io.enkrypt.kafka.streams.config.Topics.CanonicalMinerFeesEtherDeltas
import io.enkrypt.kafka.streams.config.Topics.CanonicalTraces
import io.enkrypt.kafka.streams.config.Topics.CanonicalTracesEtherDeltas
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactionFees
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactionFeesEtherDeltas
import io.enkrypt.kafka.streams.config.Topics.EtherBalanceDeltas
import io.enkrypt.kafka.streams.config.Topics.EtherBalances
import io.enkrypt.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.math.BigInteger
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class EtherBalanceProcessor : AbstractKafkaProcessor() {

  override val id: String = "ether-balance-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
      put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000L)
      put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 2000000000)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {
      addStateStore(OncePerBlockTransformer.canonicalRecordsStore(appConfig.unitTesting))
    }

    syntheticBalanceDeltas(builder)

    balanceDeltasForTraces(builder)
    balanceDeltasForFees(builder)

    aggregateBalances(builder)

    // Generate the topology
    return builder.build()
  }

  private fun aggregateBalances(builder: StreamsBuilder) {

    EtherBalanceDeltas.stream(builder)
      .groupByKey(Grouped.with(Serdes.EtherBalanceKey(), Serdes.EtherBalanceDelta()))
      .aggregate(
        {
          EtherBalanceRecord.newBuilder()
            .setAmountBI(BigInteger.ZERO)
            .build()
        },
        { key, delta, balance ->

          EtherBalanceRecord.newBuilder()
            .setAmountBI(delta.getAmountBI() + balance.getAmountBI())
            .build()
        },
        Materialized.with(Serdes.EtherBalanceKey(), Serdes.EtherBalance())
      )
      .toStream()
      .toTopic(EtherBalances)

    EtherBalances.stream(builder)
      .peek { k, v -> logger.info { "Balance update | ${k.getAddress()} -> ${v.getAmount()}" } }
  }

  /**
   * Premine and other synthetic transfers such as DAO hard fork
   */
  private fun syntheticBalanceDeltas(builder: StreamsBuilder) {

    // add a transformer to guarantee we only emit once per block number so we don't re-introduce synthetic events in the event of a fork

    val canonicalBlocks = CanonicalBlocks.stream(builder)
      .transform(
        TransformerSupplier { OncePerBlockTransformer(appConfig.unitTesting) },
        *OncePerBlockTransformer.STORE_NAMES
      )

    // premine balances

    canonicalBlocks
      .flatMap { k, _ ->

        if (k.getNumberBI() > BigInteger.ZERO)
          emptyList()
        else {

          var deltas =
            netConfig.genesis
              .accounts
              .entries
              .map { (address, premine) ->

                val balance = premine.balance

                EtherBalanceDeltaRecord.newBuilder()
                  .setType(EtherBalanceDeltaType.PREMINE_BALANCE)
                  .setBlockNumberBI(BigInteger.ZERO)
                  .setAddress(address)
                  .setAmount(balance)
                  .build()
              }

          // block reward

          deltas = deltas + EtherBalanceDeltaRecord.newBuilder()
            .setType(EtherBalanceDeltaType.BLOCK_REWARD)
            .setBlockNumberBI(BigInteger.ZERO)
            .setAddress("0x0000000000000000000000000000000000000000")
            .setAmountBI(
              netConfig.chainConfigForBlock(BigInteger.ZERO).constants.blockReward
            ).build()

          deltas.map { delta ->
            KeyValue(
              EtherBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .build(),
              EtherBalanceDeltaRecord.newBuilder(delta)
                .setAddress(null)
                .build()
            )
          }
        }
      }.toTopic(EtherBalanceDeltas)

    //

    canonicalBlocks
      .flatMap { k, _ ->

        val blockNumber = k.getNumberBI()

        netConfig
          .chainConfigForBlock(blockNumber)
          .hardForkEtherDeltas(blockNumber)
          .map { delta ->

            KeyValue(
              EtherBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .build(),
              EtherBalanceDeltaRecord.newBuilder(delta)
                .setType(EtherBalanceDeltaType.HARD_FORK)
                .setBlockNumber(k.getNumber())
                .setAddress(null)
                .build()
            )
          }
      }.toTopic(EtherBalanceDeltas)
  }

  /**
   *
   */
  private fun balanceDeltasForTraces(builder: StreamsBuilder) {

    CanonicalTraces.stream(builder)
      .mapValues { _, tracesList ->

        when (tracesList) {
          null -> null
          else -> {

            EtherBalanceDeltaListRecord.newBuilder()
              .setDeltas(tracesList.toEtherBalanceDeltas())
              .build()
          }
        }
      }.toTopic(CanonicalTracesEtherDeltas)

    CanonicalTracesEtherDeltas.table(builder)
      .groupBy(
        { k, v -> KeyValue(k.getNumber(), v) },
        Grouped.with(KafkaSerdes.String(), Serdes.EtherBalanceDeltaList())
      ).reduce(
        { _, _ ->

          // TODO check that old and new are equal
          EtherBalanceDeltaListRecord.newBuilder()
            .setDeltas(emptyList())
            .build()
        },
        { _, removed -> removed.reverse() },
        Materialized.with(KafkaSerdes.String(), Serdes.EtherBalanceDeltaList())
      ).toStream()
      .flatMap { _, v ->

        v.getDeltas()
          .map { delta ->
            KeyValue(
              EtherBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .build(),
              EtherBalanceDeltaRecord.newBuilder(delta)
                .setAddress(null)
                .build()
            )
          }
      }.toTopic(EtherBalanceDeltas)
  }

  private fun balanceDeltasForFees(builder: StreamsBuilder) {

    val txFeesTable = CanonicalTransactionFees.table(builder)

    txFeesTable
      .mapValues { _, feeList ->
        EtherBalanceDeltaListRecord.newBuilder()
          .setDeltas(feeList.toEtherBalanceDeltas())
          .build()
      }
      .toStream()
      .toTopic(CanonicalTransactionFeesEtherDeltas)

    CanonicalTransactionFeesEtherDeltas.table(builder)
      .groupBy(
        { k, v -> KeyValue(k.getNumber(), v) },
        Grouped.with(KafkaSerdes.String(), Serdes.EtherBalanceDeltaList())
      ).reduce(
        { _, _ ->
          // TODO check that old and new are equal
          EtherBalanceDeltaListRecord.newBuilder()
            .setDeltas(emptyList())
            .build()
        },
        { _, removed -> removed.reverse() },
        Materialized.with(KafkaSerdes.String(), Serdes.EtherBalanceDeltaList())
      ).toStream()
      .flatMap { _, v ->

        v.getDeltas()
          .map { delta ->
            KeyValue(
              EtherBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .build(),
              EtherBalanceDeltaRecord.newBuilder(delta)
                .setAddress(null)
                .build()
            )
          }
      }.toTopic(EtherBalanceDeltas)

    CanonicalBlockAuthors.table(builder)
      .join(
        txFeesTable,
        { left, right ->

          val totalTxFees = right.getTransactionFees()
            .map { it.getTransactionFeeBI() }
            .fold(BigInteger.ZERO) { memo, next -> memo + next }

          EtherBalanceDeltaRecord.newBuilder()
            .setType(EtherBalanceDeltaType.MINER_FEE)
            .setBlockNumber(left.getBlockNumber())
            .setBlockHash(left.getBlockHash())
            .setAddress(left.getAuthor())
            .setAmountBI(totalTxFees)
            .build()
        },
        Materialized.with(Serdes.CanonicalKey(), Serdes.EtherBalanceDelta())
      ).toStream()
      .toTopic(CanonicalMinerFeesEtherDeltas)

    CanonicalMinerFeesEtherDeltas.table(builder)
      .groupBy(
        { k, v -> KeyValue(k.getNumber(), v) },
        Grouped.with(KafkaSerdes.String(), Serdes.EtherBalanceDelta())
      ).reduce(
        { _, new ->
          // TODO check old and new are the same
          EtherBalanceDeltaRecord.newBuilder(new)
            .setAmountBI(BigInteger.ZERO)
            .build()
        },
        { _, removed -> removed.reverse() },
        Materialized.with(KafkaSerdes.String(), Serdes.EtherBalanceDelta())
      )
      .toStream()
      .filter { _, v -> v.getAmount() != "0" }
      .map { _, delta ->

        KeyValue(
          EtherBalanceKeyRecord.newBuilder()
            .setAddress(delta.getAddress())
            .build(),
          EtherBalanceDeltaRecord.newBuilder(delta)
            .setAddress(null)
            .build()
        )
      }.toTopic(EtherBalanceDeltas)
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
