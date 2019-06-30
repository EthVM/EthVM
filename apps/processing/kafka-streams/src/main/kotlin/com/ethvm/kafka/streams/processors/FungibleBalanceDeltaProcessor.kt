package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.BlockAuthorRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaType
import com.ethvm.avro.processing.FungibleTokenType
import com.ethvm.common.extensions.bigInteger
import com.ethvm.common.extensions.getNumberBI
import com.ethvm.common.extensions.getTransactionFeeBI
import com.ethvm.common.extensions.hexToBI
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.setAmountBI
import com.ethvm.common.extensions.setBlockNumberBI
import com.ethvm.common.extensions.toEtherBalanceDeltas
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockAuthor
import com.ethvm.kafka.streams.config.Topics.CanonicalMinerFeesEtherDeltas
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactionFees
import com.ethvm.kafka.streams.config.Topics.HardForkBalanceDelta
import com.ethvm.kafka.streams.config.Topics.MinerFeeBalanceDelta
import com.ethvm.kafka.streams.config.Topics.PremineBalanceDelta
import com.ethvm.kafka.streams.config.Topics.TransactionFeeBalanceDelta
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.processors.transformers.OncePerBlockTransformer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.JoinWindows
import org.apache.kafka.streams.kstream.Joined
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.TransformerSupplier
import org.joda.time.DateTime
import java.lang.IllegalStateException
import java.math.BigInteger
import java.time.Duration
import java.util.Properties

class FungibleBalanceDeltaProcessor : AbstractFungibleBalanceDeltaProcessor() {

  override val id: String = "fungible-balance-delta-processor"

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

    val canonicalBlockAuthor = CanonicalBlockAuthor.stream(builder)

    val (premineDeltas, hardForkDeltas) = syntheticEtherDeltas(builder, canonicalBlockAuthor)

    val (txFeeDeltas, minerFeeDeltas) = etherDeltasForFees(builder, canonicalBlockAuthor)

    toAccountDeltas(premineDeltas).toTopic(PremineBalanceDelta)
    toAccountDeltas(hardForkDeltas).toTopic(HardForkBalanceDelta)
    toAccountDeltas(txFeeDeltas).toTopic(TransactionFeeBalanceDelta)
    toAccountDeltas(minerFeeDeltas).toTopic(MinerFeeBalanceDelta)

    // Generate the topology
    return builder.build()
  }

  private fun syntheticEtherDeltas(builder: StreamsBuilder, canonicalBlockAuthor: KStream<CanonicalKeyRecord, BlockAuthorRecord?>): Pair<KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>, KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>> {

    // add a transformer to guarantee we only emit once per block number so we don't re-introduce synthetic events in the event of a fork

    val canonicalBlocks = canonicalBlockAuthor
      .transform(
        TransformerSupplier { OncePerBlockTransformer(appConfig.unitTesting) },
        *OncePerBlockTransformer.STORE_NAMES
      )

    // premine balances

    val premineReduceStateStoreName = "canonical-premine-deltas-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(premineReduceStateStoreName, Serdes.FungibleBalanceDeltaList(), appConfig.unitTesting))

    val premineStream = canonicalBlocks
      .filter { k, _ -> k.getNumberBI() == BigInteger.ZERO }
      .mapValues { _, header ->

        val timestamp = DateTime(0)

        FungibleBalanceDeltaListRecord.newBuilder()
          .setTimestamp(timestamp)
          .setBlockHash(header!!.blockHash)
          .setDeltas(
            netConfig.genesis
              .accounts
              .entries
              .map { (address, premine) ->

                val balance = premine.balance

                FungibleBalanceDeltaRecord.newBuilder()
                  .setTokenType(FungibleTokenType.ETHER)
                  .setDeltaType(FungibleBalanceDeltaType.PREMINE_BALANCE)
                  .setTraceLocation(
                    TraceLocationRecord.newBuilder()
                      .setTimestamp(timestamp)
                      .setBlockNumberBI(BigInteger.ZERO)
                      .build()
                  )
                  .setAddress(address)
                  .setAmountBI(balance.hexToBI())
                  .build()
              }
          )
          .build()
      }
      .transform(CanonicalKStreamReducer(premineReduceStateStoreName), premineReduceStateStoreName)
      .filter { _, v -> v.newValue != v.oldValue }
      .mapValues { k, change ->

        when {
          change.newValue != null && change.oldValue == null ->
            change.newValue
          change.newValue == null && change.oldValue != null -> {
            logger.info { "Tombstone received. Reversing key = ${k.number.bigInteger()}"}
            FungibleBalanceDeltaListRecord.newBuilder(change.oldValue)
              .setDeltas(change.oldValue.deltas.map { it.reverse() })
              .build()
          }
          else -> throw IllegalStateException("New and old values cannot be unique non null values.")
        }

      }


    // hard fork

    val hardForkReduceStateStoreName = "canonical-hard-fork-deltas-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(hardForkReduceStateStoreName, Serdes.FungibleBalanceDeltaList(), appConfig.unitTesting))

    val hardForkStream = canonicalBlocks
      .filter { _, v -> v != null } // short term fix until we can update staging
      .mapValues { k, header ->

        val blockNumber = k.getNumberBI()

        val deltas = netConfig
          .chainConfigForBlock(blockNumber)
          .hardForkFungibleDeltas(blockNumber)

        Pair(header, deltas)
      }
      .filter { _, (_, deltas) -> deltas.isNotEmpty() }
      .mapValues { _, (header, deltas) ->

        val timestamp = DateTime(header!!.getTimestamp())

        FungibleBalanceDeltaListRecord.newBuilder()
          .setTimestamp(timestamp)
          .setBlockHash(header.blockHash)
          .setDeltas(deltas)
          .build()
      }
      .transform(CanonicalKStreamReducer(hardForkReduceStateStoreName), hardForkReduceStateStoreName)
      .filter { _, v -> v.newValue != v.oldValue }
      .mapValues { k, change ->

        when {
          change.newValue != null && change.oldValue == null ->
            change.newValue
          change.newValue == null && change.oldValue != null -> {
            logger.info { "Tombstone received. Reversing key = ${k.number.bigInteger()}"}
            FungibleBalanceDeltaListRecord.newBuilder(change.oldValue)
              .setDeltas(change.oldValue.deltas.map { it.reverse() })
              .build()
          }
          else -> throw IllegalStateException("New and old values cannot be unique non null values.")
        }

      }

    return Pair(premineStream, hardForkStream)
  }

  private fun etherDeltasForFees(builder: StreamsBuilder, canonicalBlockAuthor: KStream<CanonicalKeyRecord, BlockAuthorRecord?>): Pair<KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>, KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>> {

    val txFeesStream = CanonicalTransactionFees.stream(builder)

    val txFeesDeltaReduceStoreName = "canonical-tx-fees-delta-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(txFeesDeltaReduceStoreName, Serdes.TransactionFeeList(), appConfig.unitTesting))

    val txFeeDeltas = txFeesStream
      .transform(CanonicalKStreamReducer(txFeesDeltaReduceStoreName), txFeesDeltaReduceStoreName)
      .filter { _, v -> v.newValue != v.oldValue }
      .mapValues { k, change ->

        val (feeList, reverse) =
          when {
            change.newValue != null && change.oldValue == null ->
              Pair(change.newValue, false)
            change.newValue == null && change.oldValue != null -> {
              logger.info { "Tombstone received. Reversing key = ${k.number.bigInteger()}"}
              Pair(change.oldValue, true)
            }
            else -> throw IllegalStateException("New and old values cannot be unique non null values.")
          }

        val deltas = feeList.toEtherBalanceDeltas()

        FungibleBalanceDeltaListRecord.newBuilder()
          .setTimestamp(feeList.getTimestamp())
          .setBlockHash(feeList.getBlockHash())
          .setDeltas(if (reverse) deltas.map { it.reverse() } else deltas)
          .build()

      }

    canonicalBlockAuthor
      .join(
        txFeesStream,
        { left, right ->

          // null values do no trigger the join, so in a re-org scenario we will only re-emit
          // once the tombstones have arrived and subsequent updates take their place

          if (left!!.getBlockHash() != right!!.getBlockHash()) {

            // We're in the middle of an update/fork so we publish a tombstone
            null
          } else {

            val totalTxFees = right.getTransactionFees()
              .map { it.getTransactionFeeBI() }
              .fold(BigInteger.ZERO) { memo, next -> memo + next }

            FungibleBalanceDeltaRecord.newBuilder()
              .setTokenType(FungibleTokenType.ETHER)
              .setDeltaType(FungibleBalanceDeltaType.MINER_FEE)
              .setTraceLocation(
                TraceLocationRecord.newBuilder()
                  .setTimestamp(left.getTimestamp())
                  .setBlockNumber(left.getBlockNumber())
                  .setBlockHash(left.getBlockHash())
                  .build()
              )
              .setAddress(left.getAuthor())
              .setAmountBI(totalTxFees)
              .build()
          }
        },
        JoinWindows.of(Duration.ofHours(24)),
        Joined.with(Serdes.CanonicalKey(), Serdes.BlockAuthor(), Serdes.TransactionFeeList())
      ).toTopic(CanonicalMinerFeesEtherDeltas)

    val minerFeesDeltaReduceStoreName = "canonical-miner-fees-delta-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(minerFeesDeltaReduceStoreName, Serdes.FungibleBalanceDelta(), appConfig.unitTesting))

    val minerFeeDeltas = CanonicalMinerFeesEtherDeltas.stream(builder)
      .transform(CanonicalKStreamReducer(minerFeesDeltaReduceStoreName), minerFeesDeltaReduceStoreName)
      .filter { _, v -> v.newValue != v.oldValue }
      .mapValues { k, change ->

        val delta = when {
          change.newValue != null && change.oldValue == null ->
            change.newValue
          change.newValue == null && change.oldValue != null -> {
            logger.info { "Tombstone received. Reversing key = ${k.number.bigInteger()}"}
            change.oldValue.reverse()
          }
          else -> throw IllegalStateException("New and old values cannot be unique non null values.")
        }

        FungibleBalanceDeltaListRecord.newBuilder()
          .setTimestamp(delta.getTraceLocation().getTimestamp())
          .setBlockHash(delta.getTraceLocation().getBlockHash())
          .setDeltas(listOf(delta))
          .build()

      }

    return Pair(txFeeDeltas, minerFeeDeltas)
  }

}
