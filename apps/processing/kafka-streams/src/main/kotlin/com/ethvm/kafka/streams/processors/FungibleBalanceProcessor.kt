package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.FungibleBalanceRecord
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
import com.ethvm.kafka.streams.utils.BlockEventTimestampExtractor
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Suppressed
import org.apache.kafka.streams.kstream.TimeWindows
import java.math.BigInteger
import java.time.Duration
import java.util.Properties

class FungibleBalanceProcessor : AbstractKafkaProcessor() {

  override val id: String = "fungible-balance-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
      put(StreamsConfig.DEFAULT_TIMESTAMP_EXTRACTOR_CLASS_CONFIG, BlockEventTimestampExtractor::class.java)
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

//
//  /**
//   * Premine and other synthetic transfers such as DAO hard fork
//   */
//  private fun syntheticEtherDeltas(builder: StreamsBuilder) {
//
//    // add a transformer to guarantee we only emit once per block number so we don't re-introduce synthetic events in the event of a fork
//
//    val canonicalBlocks = CanonicalBlockHeader.stream(builder)
//      .transform(
//        TransformerSupplier { OncePerBlockTransformer(appConfig.unitTesting) },
//        *OncePerBlockTransformer.STORE_NAMES
//      )
//
//    // premine balances
//
//    canonicalBlocks
//      .flatMap { k, _ ->
//
//        if (k.getNumberBI() > BigInteger.ZERO)
//          emptyList()
//        else {
//
//          var deltas =
//            netConfig.genesis
//              .accounts
//              .entries
//              .map { (address, premine) ->
//
//                val balance = premine.balance
//
//                FungibleBalanceDeltaRecord.newBuilder()
//                  .setTokenType(FungibleTokenType.ETHER)
//                  .setDeltaType(FungibleBalanceDeltaType.PREMINE_BALANCE)
//                  .setTraceLocation(
//                    TraceLocationRecord.newBuilder()
//                      .setTimestamp(DateTime(0))
//                      .setBlockNumberBI(BigInteger.ZERO)
//                      .build()
//                  )
//                  .setAddress(address)
//                  .setAmountBI(balance.hexToBI())
//                  .build()
//              }
//
//          deltas.map { delta ->
//            KeyValue(
//              FungibleBalanceKeyRecord.newBuilder()
//                .setAddress(delta.getAddress())
//                .setContract(delta.getContractAddress())
//                .build(),
//              delta
//            )
//          }
//        }
//      }
//      .filter { _, v -> v.getAmount() != null && v.getAmountBI() != BigInteger.ZERO }
//      .toTopic(FungibleBalanceDelta)
//
//    //
//
//    canonicalBlocks
//      .flatMap { k, _ ->
//
//        val blockNumber = k.getNumberBI()
//
//        netConfig
//          .chainConfigForBlock(blockNumber)
//          .hardForkFungibleDeltas(blockNumber)
//          .map { delta ->
//
//            KeyValue(
//              FungibleBalanceKeyRecord.newBuilder()
//                .setAddress(delta.getAddress())
//                .setContract(delta.getContractAddress())
//                .build(),
//              delta
//            )
//          }
//      }
//      .filter { _, v -> v.getAmount() != null && v.getAmountBI() != BigInteger.ZERO }
//      .toTopic(FungibleBalanceDelta)
//  }
//
//  /**
//   *
//   */
//  private fun etherDeltasForTraces(builder: StreamsBuilder) {
//
//    CanonicalTraces.stream(builder)
//      .mapValues { _, tracesList ->
//
//        val blockHash = tracesList.getTraces().firstOrNull()?.getBlockHash()
//
//        when (tracesList) {
//          null -> null
//          else -> {
//
//            val timestamp = DateTime(tracesList.getTimestamp())
//
//            FungibleBalanceDeltaListRecord.newBuilder()
//              .setTimestamp(timestamp)
//              .setBlockHash(blockHash)
//              .setDeltas(tracesList.toFungibleBalanceDeltas())
//              .build()
//          }
//        }
//      }.toTopic(CanonicalTracesEtherDeltas)
//
//    mapToFungibleBalanceDeltas(CanonicalTracesEtherDeltas.stream(builder))
//  }
//
//  private fun etherDeltasForFees(builder: StreamsBuilder) {
//
//    val txFeesStream = CanonicalTransactionFees.stream(builder)
//
//    txFeesStream
//      .mapValues { _, feeList ->
//
//        if (feeList != null) {
//          FungibleBalanceDeltaListRecord.newBuilder()
//            .setTimestamp(feeList.getTimestamp())
//            .setBlockHash(feeList.getBlockHash())
//            .setDeltas(feeList.toEtherBalanceDeltas())
//            .build()
//        } else {
//          // pass along the tombstone
//          null
//        }
//      }.toTopic(CanonicalTransactionFeesEtherDeltas)
//
//    mapToFungibleBalanceDeltas(CanonicalTransactionFeesEtherDeltas.stream(builder))
//
//    CanonicalBlockAuthor.stream(builder)
//      .join(
//        txFeesStream,
//        { left, right ->
//
//          if (left.getBlockHash() != right.getBlockHash()) {
//
//            // We're in the middle of an update/fork so we publish a tombstone
//            null
//          } else {
//
//            val totalTxFees = right.getTransactionFees()
//              .map { it.getTransactionFeeBI() }
//              .fold(BigInteger.ZERO) { memo, next -> memo + next }
//
//            FungibleBalanceDeltaRecord.newBuilder()
//              .setTokenType(FungibleTokenType.ETHER)
//              .setDeltaType(FungibleBalanceDeltaType.MINER_FEE)
//              .setTraceLocation(
//                TraceLocationRecord.newBuilder()
//                  .setTimestamp(left.getTimestamp())
//                  .setBlockNumber(left.getBlockNumber())
//                  .setBlockHash(left.getBlockHash())
//                  .build()
//              )
//              .setAddress(left.getAuthor())
//              .setAmountBI(totalTxFees)
//              .build()
//          }
//        },
//        JoinWindows.of(Duration.ofHours(2)),
//        Joined.with(Serdes.CanonicalKey(), Serdes.BlockAuthor(), Serdes.TransactionFeeList())
//      ).toTopic(CanonicalMinerFeesEtherDeltas)
//
//    CanonicalMinerFeesEtherDeltas.stream(builder)
//      .mapValues { v ->
//
//        if (v != null) {
//          FungibleBalanceDeltaListRecord.newBuilder()
//            .setTimestamp(v.getTraceLocation().getTimestamp())
//            .setBlockHash(v.getTraceLocation().getBlockHash())
//            .setDeltas(listOf(v))
//            .build()
//        } else {
//          null
//        }
//      }
//      .groupByKey()
//      .reduce(
//        { agg, next ->
//
//          if (next!!.getBlockHash() == agg!!.getBlockHash()) {
//
//            // an update has been published for a previously seen block
//            // we assume no material change and therefore emit an event which will have no impact on the balances
//
//            FungibleBalanceDeltaListRecord.newBuilder(agg)
//              .setTimestamp(next.getTimestamp())
//              .setApply(false)
//              .build()
//          } else {
//
//            // reverse previous deltas
//
//            FungibleBalanceDeltaListRecord.newBuilder()
//              .setTimestamp(next.getTimestamp())
//              .setBlockHash(next.getBlockHash())
//              .setApply(true)
//              .setDeltas(next.getDeltas())
//              .setReversals(agg.getDeltas().map { it.reverse() })
//              .build()
//          }
//        },
//        Materialized.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
//      )
//      .toStream()
//      .flatMap { _, v ->
//
//        if (v!!.getApply()) {
//
//          (v.getDeltas() + v.getReversals())
//            .map { delta ->
//              KeyValue(
//                FungibleBalanceKeyRecord.newBuilder()
//                  .setAddress(delta.getAddress())
//                  .build(),
//                delta
//              )
//            }
//        } else {
//          emptyList()
//        }
//      }.toTopic(FungibleBalanceDelta)
//  }
//
//  private fun erc20DeltasForReceipts(builder: StreamsBuilder) {
//
//    CanonicalReceipts.stream(builder)
//      .mapValues { _, v ->
//
//        when (v) {
//          null -> null
//          else -> {
//
//            // filter out receipts with ERC20 related logs
//
//            val blockHash = v.getReceipts().firstOrNull()?.getBlockHash()
//
//            val receiptsWithErc20Logs = v.getReceipts()
//              .filter { receipt ->
//
//                val logs = receipt.getLogs()
//
//                when (logs.isEmpty()) {
//                  true -> false
//                  else ->
//                    logs
//                      .map { log -> ERC20Abi.matchEventHex(log.getTopics()).isDefined() }
//                      .reduce { a, b -> a || b }
//                }
//              }
//
//            val timestamp = DateTime(v.getTimestamp())
//
//            val deltas = receiptsWithErc20Logs
//              .flatMap { receipt ->
//
//                val traceLocation = TraceLocationRecord.newBuilder()
//                  .setBlockNumber(receipt.getBlockNumber())
//                  .setBlockHash(receipt.getBlockHash())
//                  .setTransactionHash(receipt.getTransactionHash())
//                  .setTimestamp(timestamp)
//                  .build()
//
//                receipt.getLogs()
//                  .map { log -> ERC20Abi.decodeTransferEventHex(log.getData(), log.getTopics()) }
//                  .mapNotNull { transferOpt -> transferOpt.orNull() }
//                  .flatMap { transfer ->
//
//                    val contractAddress =
//                      if (receipt.getTo() != null)
//                        receipt.getTo()
//                      else
//                        receipt.getContractAddress()
//
//                    listOf(
//                      FungibleBalanceDeltaRecord.newBuilder()
//                        .setTokenType(FungibleTokenType.ERC20)
//                        .setDeltaType(FungibleBalanceDeltaType.TOKEN_TRANSFER)
//                        .setTraceLocation(traceLocation)
//                        .setAddress(transfer.from)
//                        .setContractAddress(contractAddress)
//                        .setCounterpartAddress(transfer.to)
//                        .setAmountBI(transfer.amount.negate())
//                        .build(),
//                      FungibleBalanceDeltaRecord.newBuilder()
//                        .setTokenType(FungibleTokenType.ERC20)
//                        .setDeltaType(FungibleBalanceDeltaType.TOKEN_TRANSFER)
//                        .setTraceLocation(traceLocation)
//                        .setAddress(transfer.to)
//                        .setCounterpartAddress(transfer.from)
//                        .setContractAddress(contractAddress)
//                        .setAmountBI(transfer.amount)
//                        .build()
//                    )
//                  }
//              }
//
//            FungibleBalanceDeltaListRecord.newBuilder()
//              .setTimestamp(timestamp)
//              .setBlockHash(blockHash)
//              .setDeltas(deltas)
//              .build()
//          }
//        }
//      }.toTopic(CanonicalReceiptErc20Deltas)
//
//    mapToFungibleBalanceDeltas(CanonicalReceiptErc20Deltas.stream(builder))
//  }
//
//  private fun mapToFungibleBalanceDeltas(stream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>) {
//
//    stream
//      .groupByKey(Grouped.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList()))
//      .reduce(
//        { agg, next ->
//
//          if (next.getBlockHash() == agg.getBlockHash()) {
//
//            // an update has been published for a previously seen block
//            // we assume no material change and therefore emit an event which will have no impact on the balances
//
//            logger.warn { "Update received. Agg = $agg, next = $next" }
//
//            FungibleBalanceDeltaListRecord.newBuilder(agg)
//              .setTimestamp(next.getTimestamp())
//              .setApply(false)
//              .build()
//          } else {
//
//            // reverse previous deltas
//
//            FungibleBalanceDeltaListRecord.newBuilder()
//              .setTimestamp(next.getTimestamp())
//              .setBlockHash(next.getBlockHash())
//              .setDeltas(next.getDeltas())
//              .setReversals(agg.getDeltas().map { it.reverse() })
//              .build()
//          }
//        },
//        Materialized.with(Serdes.CanonicalKey(), Serdes.FungibleBalanceDeltaList())
//      )
//      .toStream()
//      .flatMap { _, v ->
//
//        if (v.getApply()) {
//
//          (v.getDeltas() + v.getReversals())
//            .map { delta ->
//              KeyValue(
//                FungibleBalanceKeyRecord.newBuilder()
//                  .setAddress(delta.getAddress())
//                  .setContract(delta.getContractAddress())
//                  .build(),
//                delta
//              )
//            }
//        } else {
//          emptyList()
//        }
//      }.toTopic(FungibleBalanceDelta)
//  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
