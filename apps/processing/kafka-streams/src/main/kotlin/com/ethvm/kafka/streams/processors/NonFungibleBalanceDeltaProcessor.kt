package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.NonFungibleBalanceKeyRecord
import com.ethvm.avro.processing.NonFungibleTokenType
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.setTokenIdBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.Erc721BalanceDelta
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.ERC721Abi
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Materialized
import org.joda.time.DateTime
import java.util.Properties

class NonFungibleBalanceDeltaProcessor : AbstractKafkaProcessor() {

  override val id: String = "non-fungible-balance-delta-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder()

    val erc721Deltas = erc721DeltasForReceipts(builder)

    toAccountDeltas(erc721Deltas).toTopic(Erc721BalanceDelta)

    // Generate the topology
    return builder.build()
  }

  private fun erc721DeltasForReceipts(builder: StreamsBuilder): KStream<CanonicalKeyRecord, NonFungibleBalanceDeltaListRecord> {

    val reduceStoreName = "canonical-receipts-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(reduceStoreName, Serdes.TransactionCountDeltaList(), appConfig.unitTesting))

    return CanonicalReceipts.stream(builder)
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

                      val contract = when {
                        receipt.to != null -> receipt.to
                        receipt.contractAddress != null -> receipt.contractAddress
                        else -> throw IllegalStateException("Could not determine contract address")
                      }

                      NonFungibleBalanceDeltaRecord.newBuilder()
                        .setTokenType(NonFungibleTokenType.ERC721)
                        .setTraceLocation(
                          traceLocation
                            .setLogIndex(idx)
                            .build()
                        )
                        .setFrom(transfer.from)
                        .setTo(transfer.to)
                        .setContract(contract)
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
      }
      .transform(CanonicalKStreamReducer(reduceStoreName), reduceStoreName)
      .filter { _, v -> v.newValue != v.oldValue }
      .mapValues { _, change ->

        when {
          change.newValue != null && change.oldValue == null ->
            change.newValue
          change.newValue == null && change.oldValue != null ->
            NonFungibleBalanceDeltaListRecord.newBuilder(change.oldValue)
              .setDeltas(change.oldValue.deltas.map { it.reverse() })
              .build()
          else -> throw java.lang.IllegalStateException("New and old values cannot be unique non null values.")
        }

      }
  }

  private fun toAccountDeltas(stream: KStream<CanonicalKeyRecord, NonFungibleBalanceDeltaListRecord>) =
    stream.flatMap { _, v ->
      v.getDeltas()
        .map { delta ->
          KeyValue(
            NonFungibleBalanceKeyRecord.newBuilder()
              .setContract(delta.getContract())
              .setTokenId(delta.getTokenId())
              .build(),
            delta
          )
        }
    }

}
