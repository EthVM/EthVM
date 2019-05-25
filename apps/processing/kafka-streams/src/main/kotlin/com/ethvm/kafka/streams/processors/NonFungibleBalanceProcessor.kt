package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.NonFungibleBalanceKeyRecord
import com.ethvm.avro.processing.NonFungibleBalanceRecord
import com.ethvm.avro.processing.NonFungibleTokenType
import com.ethvm.common.extensions.getBlockNumberBI
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.setTokenIdBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalReceiptErc721Deltas
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.NonFungibleBalanceDelta
import com.ethvm.kafka.streams.config.Topics.NonFungibleBalance
import com.ethvm.kafka.streams.utils.ERC721Abi
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Suppressed
import org.joda.time.DateTime
import java.time.Duration
import java.util.Properties

class NonFungibleBalanceProcessor : AbstractKafkaProcessor() {

  override val id: String = "non-fungible-balance-processor"

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

    val builder = StreamsBuilder()

    erc721DeltasForReceipts(builder)

    aggregateBalances(builder)

    // Generate the topology
    return builder.build()
  }

  private fun aggregateBalances(builder: StreamsBuilder) {

    NonFungibleBalanceDelta.stream(builder)
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
      )
      // only emit unique updates each second
      .suppress(Suppressed.untilTimeLimit(Duration.ofSeconds(1), Suppressed.BufferConfig.unbounded()))
      .toStream()
      .toTopic(NonFungibleBalance)

    NonFungibleBalance.stream(builder)
      .peek { k, v -> logger.debug { "Balance update | ${k.getContract()}, ${k.getTokenId()} -> ${v.getAddress()}" } }
  }

  private fun erc721DeltasForReceipts(builder: StreamsBuilder) {

    CanonicalReceipts.stream(builder)
      .mapValues { _, v ->

        when (v) {
          null -> null
          else -> {

            // filter out receipts with ERC20 related logs

            val blockHash = v.getReceipts().firstOrNull()?.getBlockHash()

            val receiptsWithErc721Logs = v.getReceipts()
              .filter { receipt ->

                val logs = receipt.getLogs()

                when (logs.isEmpty()) {
                  true -> false
                  else ->
                    logs
                      .map { log -> ERC721Abi.matchEventHex(log.getTopics()).isDefined() }
                      .reduce { a, b -> a || b }
                }
              }

            val timestamp = DateTime(v.getTimestamp())

            val deltas = receiptsWithErc721Logs
              .flatMap { receipt ->

                val traceLocation = TraceLocationRecord.newBuilder()
                  .setTimestamp(timestamp)
                  .setBlockNumber(receipt.getBlockNumber())
                  .setBlockHash(receipt.getBlockHash())
                  .setTransactionHash(receipt.getTransactionHash())
                  .setTransactionIndex(receipt.getTransactionIndex())

                receipt.getLogs()
                  .map { log -> ERC721Abi.decodeTransferEventHex(log.getData(), log.getTopics()) }
                  .mapIndexed { idx, transferOpt ->

                    transferOpt.map { transfer ->

                      NonFungibleBalanceDeltaRecord.newBuilder()
                        .setTokenType(NonFungibleTokenType.ERC721)
                        .setTraceLocation(
                          traceLocation
                            .setLogIndex(idx)
                            .build()
                        )
                        .setFrom(transfer.from)
                        .setTo(transfer.to)
                        .setContract(receipt.getTo())
                        .setTokenIdBI(transfer.tokenId)
                        .build()
                    }.orNull()
                  }.filterNotNull()
              }

            NonFungibleBalanceDeltaListRecord.newBuilder()
              .setTimestamp(timestamp)
              .setBlockHash(blockHash)
              .setDeltas(deltas)
              .build()
          }
        }
      }.toTopic(CanonicalReceiptErc721Deltas)

    mapToNonFungibleBalanceDeltas(CanonicalReceiptErc721Deltas.stream(builder))
  }

  private fun mapToNonFungibleBalanceDeltas(stream: KStream<CanonicalKeyRecord, NonFungibleBalanceDeltaListRecord>) {

    stream
      .groupByKey(Grouped.with(Serdes.CanonicalKey(), Serdes.NonFungibleBalanceDeltaList()))
      .reduce(
        { agg, next ->

          if (next.getBlockHash() == agg.getBlockHash()) {

            // an update has been published for a previously seen block
            // we assume no material change and therefore emit an event which will have no impact on the balances

            logger.warn { "Update received. Agg = $agg, next = $next" }

            NonFungibleBalanceDeltaListRecord.newBuilder(agg)
              .setTimestamp(next.getTimestamp())
              .setApply(false)
              .build()
          } else {

            // reverse previous deltas

            NonFungibleBalanceDeltaListRecord.newBuilder()
              .setTimestamp(next.getTimestamp())
              .setBlockHash(next.getBlockHash())
              .setDeltas(next.getDeltas())
              .setReversals(agg.getDeltas().map { it.reverse() })
              .build()
          }
        },
        Materialized.with(Serdes.CanonicalKey(), Serdes.NonFungibleBalanceDeltaList())
      ).toStream()
      .flatMap { _, v ->

        if (v.getApply()) {

          (v.getDeltas() + v.getReversals())
            .map { delta ->
              KeyValue(
                NonFungibleBalanceKeyRecord.newBuilder()
                  .setContract(delta.getContract())
                  .setTokenId(delta.getTokenId())
                  .build(),
                delta
              )
            }
        } else {
          emptyList()
        }
      }.toTopic(NonFungibleBalanceDelta)
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
