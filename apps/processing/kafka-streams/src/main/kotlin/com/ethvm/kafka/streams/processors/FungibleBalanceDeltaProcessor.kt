package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListsRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaType
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.FungibleBalanceRecord
import com.ethvm.avro.processing.FungibleTokenType
import com.ethvm.common.extensions.getAmountBI
import com.ethvm.common.extensions.getNumberBI
import com.ethvm.common.extensions.getTransactionFeeBI
import com.ethvm.common.extensions.hexToBI
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.setAmountBI
import com.ethvm.common.extensions.setBlockNumberBI
import com.ethvm.common.extensions.toEtherBalanceDeltas
import com.ethvm.common.extensions.toFungibleBalanceDeltas
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockAuthor
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockHeader
import com.ethvm.kafka.streams.config.Topics.CanonicalMinerFeesEtherDeltas
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.CanonicalTraces
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactionFees
import com.ethvm.kafka.streams.config.Topics.Erc20BalanceDelta
import com.ethvm.kafka.streams.config.Topics.HardForkBalanceDelta
import com.ethvm.kafka.streams.config.Topics.MinerFeeBalanceDelta
import com.ethvm.kafka.streams.config.Topics.PremineBalanceDelta
import com.ethvm.kafka.streams.config.Topics.TransactionBalanceDelta
import com.ethvm.kafka.streams.config.Topics.TransactionFeeBalanceDelta
import com.ethvm.kafka.streams.processors.transformers.OncePerBlockTransformer
import com.ethvm.kafka.streams.utils.BlockEventTimestampExtractor
import com.ethvm.kafka.streams.utils.ERC20Abi
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.JoinWindows
import org.apache.kafka.streams.kstream.Joined
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Suppressed
import org.apache.kafka.streams.kstream.TimeWindows
import org.apache.kafka.streams.kstream.TransformerSupplier
import org.joda.time.DateTime
import java.math.BigInteger
import java.time.Duration
import java.util.Properties

class FungibleBalanceDeltaProcessor : AbstractKafkaProcessor() {

  override val id: String = "fungible-balance-delta-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {
      addStateStore(OncePerBlockTransformer.canonicalRecordsStore(appConfig.unitTesting))
    }

    val (premineDeltas, hardForkDeltas) = syntheticEtherDeltas(builder)

    val txDeltas = etherDeltasForTraces(builder)

    val (txFeeDeltas, minerFeeDeltas) = etherDeltasForFees(builder)

    val erc20Deltas = erc20DeltasForReceipts(builder)

    toAccountDeltas(premineDeltas).toTopic(PremineBalanceDelta)
    toAccountDeltas(hardForkDeltas).toTopic(HardForkBalanceDelta)
    toAccountDeltas(txDeltas).toTopic(TransactionBalanceDelta)
    toAccountDeltas(txFeeDeltas).toTopic(TransactionFeeBalanceDelta)
    toAccountDeltas(minerFeeDeltas).toTopic(MinerFeeBalanceDelta)
    toAccountDeltas(erc20Deltas).toTopic(Erc20BalanceDelta)

    // Generate the topology
    return builder.build()
  }

  private fun toAccountDeltas(deltaStream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>) =
    deltaStream
      .flatMap { _, v ->

        // we should not receive any null values, this is just an artifact of the type system

        if (v!!.getApply()) {

          (v.getDeltas() + v.getReversals())
            .map { delta ->
              KeyValue(
                FungibleBalanceKeyRecord.newBuilder()
                  .setAddress(delta.getAddress())
                  .setContract(delta.getContractAddress())
                  .build(),
                delta
              )
            }
        } else {
          emptyList()
        }
      }

  private fun syntheticEtherDeltas(builder: StreamsBuilder): Pair<KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>, KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>> {

    // add a transformer to guarantee we only emit once per block number so we don't re-introduce synthetic events in the event of a fork

    val canonicalBlocks = CanonicalBlockHeader.stream(builder)
      .transform(
        TransformerSupplier { OncePerBlockTransformer(appConfig.unitTesting) },
        *OncePerBlockTransformer.STORE_NAMES
      )

    // premine balances

    val premineStream = canonicalBlocks
      .filter { k, _ -> k.getNumberBI() == BigInteger.ONE }
      .mapValues { _, header ->

        val timestamp = DateTime(0)

        FungibleBalanceDeltaListRecord.newBuilder()
          .setTimestamp(timestamp)
          .setBlockHash(header!!.getParentHash())
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


    // hard fork

    val hardForkStream = canonicalBlocks
      .mapValues { k, header ->

        val blockNumber = k.getNumberBI()

        val timestamp = DateTime(header!!.getTimestamp())

        FungibleBalanceDeltaListRecord.newBuilder()
          .setTimestamp(timestamp)
          .setBlockHash(header.getHash())
          .setDeltas(
            netConfig
              .chainConfigForBlock(blockNumber)
              .hardForkFungibleDeltas(blockNumber)
          )
          .build()

      }

    return Pair(withReversals(premineStream), withReversals(hardForkStream))
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

  private fun etherDeltasForFees(builder: StreamsBuilder): Pair<KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>, KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>> {

    val txFeesStream = CanonicalTransactionFees.stream(builder)

    val txFeeDeltas = txFeesStream
      .mapValues { _, feeList ->

        if (feeList == null) {
          // pass through the tombstone
          null
        } else {
          FungibleBalanceDeltaListRecord.newBuilder()
            .setTimestamp(feeList.getTimestamp())
            .setBlockHash(feeList.getBlockHash())
            .setDeltas(feeList.toEtherBalanceDeltas())
            .build()
        }
      }

    CanonicalBlockAuthor.stream(builder)
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
        JoinWindows.of(Duration.ofHours(2)),
        Joined.with(Serdes.CanonicalKey(), Serdes.BlockAuthor(), Serdes.TransactionFeeList())
      ).toTopic(CanonicalMinerFeesEtherDeltas)

    val minerFeeDeltas = CanonicalMinerFeesEtherDeltas.stream(builder)
      .mapValues { v ->

        if (v == null) {
          // pass through tombstone
          null
        } else {
          FungibleBalanceDeltaListRecord.newBuilder()
            .setTimestamp(v.getTraceLocation().getTimestamp())
            .setBlockHash(v.getTraceLocation().getBlockHash())
            .setDeltas(listOf(v))
            .build()
        }

      }
      .groupByKey()
      .reduce(
        { agg, next ->

          // null values are ignored so in a re-org scenario this reduce will only be triggered
          // when the replacement value arrives

          if (next!!.getBlockHash() == agg!!.getBlockHash()) {

            // an update has been published for a previously seen block
            // we assume no material change and therefore emit an event which will have no impact on the balances

            FungibleBalanceDeltaListRecord.newBuilder(agg)
              .setTimestamp(next.getTimestamp())
              .setApply(false)
              .build()

          } else {

            // reverse previous deltas

            FungibleBalanceDeltaListRecord.newBuilder()
              .setTimestamp(next.getTimestamp())
              .setBlockHash(next.getBlockHash())
              .setApply(true)
              .setDeltas(next.getDeltas())
              .setReversals(agg.getDeltas().map { it.reverse() })
              .build()
          }
        },
        Materialized.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
      )
      .toStream()


    return Pair(withReversals(txFeeDeltas), withReversals(minerFeeDeltas))
  }

  private fun erc20DeltasForReceipts(builder: StreamsBuilder) =
    withReversals(


      CanonicalReceipts.stream(builder)
        .mapValues { _, v ->

          when (v) {
            null -> null
            else -> {

              // filter out receipts with ERC20 related logs

              val blockHash = v.getReceipts().firstOrNull()?.getBlockHash()

              val receiptsWithErc20Logs = v.getReceipts()
                .filter { receipt ->

                  val logs = receipt.getLogs()

                  when (logs.isEmpty()) {
                    true -> false
                    else ->
                      logs
                        .map { log -> ERC20Abi.matchEventHex(log.getTopics()).isDefined() }
                        .reduce { a, b -> a || b }
                  }
                }

              val timestamp = DateTime(v.getTimestamp())

              val deltas = receiptsWithErc20Logs
                .flatMap { receipt ->

                  val traceLocation = TraceLocationRecord.newBuilder()
                    .setBlockNumber(receipt.getBlockNumber())
                    .setBlockHash(receipt.getBlockHash())
                    .setTransactionHash(receipt.getTransactionHash())
                    .setTimestamp(timestamp)
                    .build()

                  receipt.getLogs()
                    .map { log -> ERC20Abi.decodeTransferEventHex(log.getData(), log.getTopics()) }
                    .mapNotNull { transferOpt -> transferOpt.orNull() }
                    .flatMap { transfer ->

                      val contractAddress =
                        if (receipt.getTo() != null)
                          receipt.getTo()
                        else
                          receipt.getContractAddress()

                      listOf(
                        FungibleBalanceDeltaRecord.newBuilder()
                          .setTokenType(FungibleTokenType.ERC20)
                          .setDeltaType(FungibleBalanceDeltaType.TOKEN_TRANSFER)
                          .setTraceLocation(traceLocation)
                          .setAddress(transfer.from)
                          .setContractAddress(contractAddress)
                          .setCounterpartAddress(transfer.to)
                          .setAmountBI(transfer.amount.negate())
                          .build(),
                        FungibleBalanceDeltaRecord.newBuilder()
                          .setTokenType(FungibleTokenType.ERC20)
                          .setDeltaType(FungibleBalanceDeltaType.TOKEN_TRANSFER)
                          .setTraceLocation(traceLocation)
                          .setAddress(transfer.to)
                          .setCounterpartAddress(transfer.from)
                          .setContractAddress(contractAddress)
                          .setAmountBI(transfer.amount)
                          .build()
                      )
                    }
                }

              FungibleBalanceDeltaListRecord.newBuilder()
                .setTimestamp(timestamp)
                .setBlockHash(blockHash)
                .setDeltas(deltas)
                .build()
            }
          }
        }
    )

  private fun withReversals(stream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord?>) =
    stream
      .groupByKey(Grouped.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList()))
      .reduce(
        { agg, next ->

          // null values does not trigger this reduce, so in the case of a reorg we will only trigger
          // when the updated value is available

          if (next!!.getBlockHash() == agg!!.getBlockHash()) {

            // an update has been published for a previously seen block
            // we assume no material change and therefore emit an event which will have no impact on the balances

            logger.warn { "Update received. Agg = $agg, next = $next" }

            FungibleBalanceDeltaListRecord.newBuilder(agg)
              .setTimestamp(next.getTimestamp())
              .setApply(false)
              .build()

          } else {

            // reverse previous deltas

            FungibleBalanceDeltaListRecord.newBuilder()
              .setTimestamp(next.getTimestamp())
              .setBlockHash(next.getBlockHash())
              .setDeltas(next.getDeltas())
              .setReversals(agg.getDeltas().map { it.reverse() })
              .build()
          }
        },
        Materialized.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
      )
      .toStream()


  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
