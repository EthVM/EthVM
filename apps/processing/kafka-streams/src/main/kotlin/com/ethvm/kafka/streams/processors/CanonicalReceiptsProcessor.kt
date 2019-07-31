package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaType
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.FungibleTokenType
import com.ethvm.avro.processing.NonFungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.NonFungibleBalanceKeyRecord
import com.ethvm.avro.processing.NonFungibleTokenType
import com.ethvm.avro.processing.TransactionGasUsedListRecord
import com.ethvm.avro.processing.TransactionGasUsedRecord
import com.ethvm.avro.processing.TransactionReceiptKeyRecord
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.setAmountBI
import com.ethvm.common.extensions.setTokenIdBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.ERC20Abi
import com.ethvm.kafka.streams.utils.ERC721Abi
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.KStream
import org.joda.time.DateTime
import java.util.Properties

class CanonicalReceiptsProcessor : AbstractKafkaProcessor() {

  override val id: String = "canonical-receipts-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    val canonicalReceipts = CanonicalReceipts.stream(builder)

    // Count

    canonicalReceipts
      .map { k, v ->
        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("transaction_receipt")
            .setNumber(k.number)
            .build(),
          CanonicalCountRecord.newBuilder()
            .setCount(v.receipts.size.toLong())
            .build()
        )
      }.toTopic(Topics.CanonicalCountDelta)

    // flat map

    canonicalReceipts
      .flatMapValues { _, v ->
        v!!.getReceipts()
          .map {
            TransactionReceiptRecord.newBuilder(it)
              .setTimestamp(v.getTimestamp())
              .build()
          }
      }
      .map { _, v ->
        KeyValue(
          TransactionReceiptKeyRecord.newBuilder()
            .setTransactionHash(v.getTransactionHash())
            .build(),
          v
        )
      }
      .toTopic(Topics.TransactionReceipt)

    // erc20 deltas

    val receiptReduceStoreName = "canonical-receipt-reduce"

    builder.addStateStore(CanonicalKStreamReducer.store(receiptReduceStoreName, Serdes.ReceiptList(), appConfig.unitTesting))

    val erc20Deltas = canonicalReceipts
      .transform(CanonicalKStreamReducer(receiptReduceStoreName), receiptReduceStoreName)
      .filter { _, change -> change.newValue != change.oldValue }
      .filter { _, change -> change.newValue != null } //
      .mapValues { _, change ->

        require(change.newValue != null) { "Change newValue cannot be null. A tombstone has been received" }

        if (change.oldValue == null) {
          toDeltaList(change.newValue, false)
        } else {

          val delta = toDeltaList(change.newValue, false)
          val reversal = toDeltaList(change.oldValue, true)

          FungibleBalanceDeltaListRecord.newBuilder(delta)
            .setDeltas(reversal.deltas + delta.deltas)
            .build()
        }
      }

    toFungibleAccountDeltas(erc20Deltas).toTopic(Topics.Erc20BalanceDelta)

    // erc721 deltas

    val erc721Deltas = erc721DeltasForReceipts(builder, canonicalReceipts)

    toNonFungibleAccountDeltas(erc721Deltas).toTopic(Topics.Erc721BalanceDelta)

    // Gas used

    canonicalReceipts
      .filter { _, receiptsList -> receiptsList.getReceipts().firstOrNull()?.getBlockHash() != null }
      .mapValues { receiptsList ->

        val blockHash = receiptsList.getReceipts().firstOrNull()?.getBlockHash()!!

        TransactionGasUsedListRecord.newBuilder()
          .setTimestamp(DateTime(receiptsList.getTimestamp()))
          .setBlockHash(blockHash)
          .setGasUsed(
            receiptsList.getReceipts()
              .map { receipt ->
                TransactionGasUsedRecord.newBuilder()
                  .setGasUsed(receipt.getGasUsed())
                  .build()
              }
          ).build()
      }.toTopic(Topics.CanonicalGasUsed)

    return builder.build()
  }

  private fun toDeltaList(receiptList: TransactionReceiptListRecord, reverse: Boolean): FungibleBalanceDeltaListRecord {

    val receipts = receiptList.getReceipts()

    val blockHash = receipts.firstOrNull()?.getBlockHash()

    val receiptsWithErc20Logs = receipts
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

    val timestamp = DateTime(receiptList.getTimestamp())

    val deltas = receiptsWithErc20Logs
      .flatMap { receipt ->

        val traceLocation = TraceLocationRecord.newBuilder()
          .setBlockNumber(receipt.getBlockNumber())
          .setBlockHash(receipt.getBlockHash())
          .setTransactionHash(receipt.getTransactionHash())
          .setTransactionIndex(receipt.getTransactionIndex())
          .setTimestamp(timestamp)
          .build()

        receipt.getLogs()
          .map { log -> ERC20Abi.decodeTransferEventHex(log.getData(), log.getTopics()) }
          .mapNotNull { transferOpt -> transferOpt.orNull() }
          .flatMap { transfer ->

            val contractAddress = when {
              receipt.to != null -> receipt.to
              receipt.contractAddress != null -> receipt.contractAddress
              else -> throw IllegalStateException("Could not determine contract address")
            }

            listOf(
              FungibleBalanceDeltaRecord.newBuilder()
                .setTokenType(FungibleTokenType.ERC20)
                .setDeltaType(FungibleBalanceDeltaType.TOKEN_TRANSFER)
                .setIsReceiving(false)
                .setTraceLocation(traceLocation)
                .setAddress(transfer.from)
                .setContractAddress(contractAddress)
                .setCounterpartAddress(transfer.to)
                .setAmountBI(transfer.amount.negate())
                .build(),
              FungibleBalanceDeltaRecord.newBuilder()
                .setTokenType(FungibleTokenType.ERC20)
                .setDeltaType(FungibleBalanceDeltaType.TOKEN_TRANSFER)
                .setIsReceiving(true)
                .setTraceLocation(traceLocation)
                .setAddress(transfer.to)
                .setCounterpartAddress(transfer.from)
                .setContractAddress(contractAddress)
                .setAmountBI(transfer.amount)
                .build()
            )
          }
      }

    return FungibleBalanceDeltaListRecord.newBuilder()
      .setTimestamp(timestamp)
      .setBlockHash(blockHash)
      .setDeltas(if (reverse) deltas.map { it.reverse() } else deltas)
      .build()
  }

  private fun toFungibleAccountDeltas(deltaStream: KStream<CanonicalKeyRecord, FungibleBalanceDeltaListRecord>) =
    deltaStream
      .flatMap { _, v ->

        v.deltas
          .map { delta ->
            KeyValue(
              FungibleBalanceKeyRecord.newBuilder()
                .setAddress(delta.getAddress())
                .setContract(delta.getContractAddress())
                .build(),
              delta
            )
          }
      }

  private fun erc721DeltasForReceipts(builder: StreamsBuilder, canonicalReceipts: KStream<CanonicalKeyRecord, TransactionReceiptListRecord>): KStream<CanonicalKeyRecord, NonFungibleBalanceDeltaListRecord> {

    val reduceStoreName = "canonical-receipts-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(reduceStoreName, Serdes.TransactionCountDeltaList(), appConfig.unitTesting))

    return canonicalReceipts
      .mapValues { _, v ->

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
      .transform(CanonicalKStreamReducer(reduceStoreName), reduceStoreName)
      .filter { _, change -> change.newValue != change.oldValue }
      .mapValues { _, change ->

        require(change.newValue != null) { "Change newValue cannot be null. A tombstone has been received" }

        val deltas = change.newValue.deltas!!
        val reversals = change.oldValue?.deltas?.map { it.reverse() } ?: emptyList<NonFungibleBalanceDeltaRecord>()

        NonFungibleBalanceDeltaListRecord.newBuilder(change.newValue)
          .setDeltas(reversals + deltas)
          .build()
      }
  }

  private fun toNonFungibleAccountDeltas(stream: KStream<CanonicalKeyRecord, NonFungibleBalanceDeltaListRecord>) =
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
