package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.TraceListRecord
import io.enkrypt.avro.capture.TransactionKeyRecord
import io.enkrypt.avro.processing.CanonicalApplyRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaListRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaRecord
import io.enkrypt.avro.processing.EtherBalanceDeltaType
import io.enkrypt.avro.processing.EtherBalanceKeyRecord
import io.enkrypt.avro.processing.EtherBalanceRecord
import io.enkrypt.avro.processing.TransactionFeeRecord
import io.enkrypt.avro.processing.TransactionGasPriceRecord
import io.enkrypt.avro.processing.TransactionGasUsedRecord
import io.enkrypt.common.extensions.reverse
import io.enkrypt.common.extensions.toEtherBalanceDeltas
import io.enkrypt.kafka.streams.config.Topics.CanonicalBlocks
import io.enkrypt.kafka.streams.config.Topics.CanonicalReceipts
import io.enkrypt.kafka.streams.config.Topics.CanonicalTraces
import io.enkrypt.kafka.streams.config.Topics.CanonicalTracesEtherDeltas
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactionFees
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactionFeesEtherDeltas
import io.enkrypt.kafka.streams.config.Topics.CanonicalTransactions
import io.enkrypt.kafka.streams.config.Topics.EtherBalanceDeltas
import io.enkrypt.kafka.streams.config.Topics.EtherBalances
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Aggregator
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.Initializer
import org.apache.kafka.streams.kstream.KTable
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Suppressed
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.math.BigInteger
import java.time.Duration
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

    val etherBalances = EtherBalanceDeltas.stream(builder)
      .groupByKey(Grouped.with(Serdes.EtherBalanceKey(), Serdes.EtherBalanceDelta()))
      .aggregate(
        {
          EtherBalanceRecord.newBuilder()
            .setAmount(BigInteger.ZERO.toString())
            .build()
        },
        { key, delta, balance ->

          EtherBalanceRecord.newBuilder()
            .setAmount(
              (delta.getAmount().toBigInteger() + balance.getAmount().toBigInteger()).toString()
            ).build()

        },
        Materialized.with(Serdes.EtherBalanceKey(), Serdes.EtherBalance())
      ).suppress(Suppressed.untilTimeLimit(Duration.ofSeconds(30), Suppressed.BufferConfig.unbounded()))
      .toStream()

    EtherBalances.sinkFor(etherBalances)

    EtherBalances.stream(builder)
      .peek { k, v -> logger.info { "Balance update | ${k.getAddress()} -> ${v.getAmount()}, ${v.getAmount().toBigInteger().toString(16)}" } }

  }

  /**
   * Premine and other synthetic transfers such as DAO hard fork
   */
  private fun syntheticBalanceDeltas(builder: StreamsBuilder) {

    // add a transformer to guarantee we only emit once per block number so we don't re-introduce synthetic events in the event of a fork

    val canonicalChain = CanonicalBlocks.stream(builder)
      .transform(
        TransformerSupplier { OncePerBlockTransformer(appConfig.unitTesting) },
        *OncePerBlockTransformer.STORE_NAMES
      )

    // premine balances

    val premineTransfers = canonicalChain
      .flatMap { k, _ ->

        if (k.getNumber().toBigInteger() > BigInteger.ZERO)
          emptyList()
        else {

          var deltas =
            netConfig.genesis
              .alloc
              .entries
              .map { (address, balance) ->

                val amount = when (balance) {
                  "" -> "0"
                  else -> balance
                }

                EtherBalanceDeltaRecord.newBuilder()
                  .setType(EtherBalanceDeltaType.PREMINE_BALANCE)
                  .setAddress(address)
                  .setAmount(amount)
                  .build()

              }

          // block reward

          deltas = deltas + EtherBalanceDeltaRecord.newBuilder()
            .setType(EtherBalanceDeltaType.BLOCK_REWARD)
            .setAddress("0x0000000000000000000000000000000000000000")
            .setAmount(
              netConfig.chainConfigForBlock(BigInteger.ZERO).constants.blockReward.toString()
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

      }

    //

    val hardForkTransfers = canonicalChain
      .flatMap { k, _ ->

        val blockNumber = k.getNumber().toBigInteger()

        netConfig
          .chainConfigForBlock(blockNumber)
          .hardForkEtherDeltas(blockNumber)
          .map { delta ->

            if (delta.getAmount().isEmpty()) {
              logger.info { }
            }

            KeyValue(
              EtherBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .build(),
              EtherBalanceDeltaRecord.newBuilder(delta)
                .setType(EtherBalanceDeltaType.HARD_FORK)
                .setAddress(null)
                .build()
            )
          }

      }

    EtherBalanceDeltas.sinkFor(premineTransfers, hardForkTransfers)

  }

  /**
   *
   */
  private fun balanceDeltasForTraces(builder: StreamsBuilder) {

    val etherBalanceDeltasForBlock = CanonicalTraces.stream(builder)
      .mapValues { _, tracesList ->

        when (tracesList) {
          null -> null
          else -> {

            EtherBalanceDeltaListRecord.newBuilder()
              .setDeltas(tracesList.toEtherBalanceDeltas())
              .build()

          }
        }

      }

    CanonicalTracesEtherDeltas.sinkFor(etherBalanceDeltasForBlock)

    val etherBalanceDeltas = CanonicalTracesEtherDeltas.table(builder)
      .groupBy(
        { k, v -> KeyValue(k.getNumber(), v) },
        Grouped.with(KafkaSerdes.String(), Serdes.EtherBalanceDeltaList())
      ).reduce(
        { _, new ->

          // TODO check that old and new are equal
          EtherBalanceDeltaListRecord.newBuilder()
            .setDeltas(new.getDeltas() + new.reverse().getDeltas())
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

      }

    EtherBalanceDeltas.sinkFor(etherBalanceDeltas)

  }

  private fun balanceDeltasForFees(builder: StreamsBuilder) {

    CanonicalTransactionFeesEtherDeltas.sinkFor(
      CanonicalTransactionFees.stream(builder)
        .mapValues { _, feeList ->

          when (feeList) {
            null -> null
            else -> EtherBalanceDeltaListRecord.newBuilder()
              .setDeltas(feeList.toEtherBalanceDeltas())
              .build()
          }

        }
    )

    val etherBalanceDeltas = CanonicalTransactionFeesEtherDeltas.table(builder)
      .groupBy(
        { k, v -> KeyValue(k.getNumber(), v) },
        Grouped.with(KafkaSerdes.String(), Serdes.EtherBalanceDeltaList())
      ).reduce(
        { _, new ->
          // TODO check that old and new are equal
          EtherBalanceDeltaListRecord.newBuilder()
            .setDeltas(new.getDeltas() + new.reverse().getDeltas())
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

      }

    EtherBalanceDeltas.sinkFor(etherBalanceDeltas)

  }


  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
