package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.common.TraceLocationRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaType
import com.ethvm.avro.processing.FungibleTokenType
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.setAmountBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.Erc20BalanceDelta
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.ERC20Abi
import com.ethvm.kafka.streams.utils.toTopic
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.joda.time.DateTime
import java.util.Properties

class FungibleBalanceDeltaReceiptProcessor : AbstractFungibleBalanceDeltaProcessor() {

  override val id: String = "fungible-balance-delta-receipt-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger = KotlinLogging.logger {}

  private val receiptReduceStoreName = "canonical-receipt-reduce"

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {
      addStateStore(CanonicalKStreamReducer.store(receiptReduceStoreName, Serdes.ReceiptList(), appConfig.unitTesting))
    }

    val erc20Deltas = erc20DeltasForReceipts(builder)

    toAccountDeltas(erc20Deltas).toTopic(Erc20BalanceDelta)

    // Generate the topology
    return builder.build()
  }

  private fun erc20DeltasForReceipts(builder: StreamsBuilder) =
    CanonicalReceipts.stream(builder)
      .transform(CanonicalKStreamReducer(receiptReduceStoreName), receiptReduceStoreName)
      .filter { _, change -> change.newValue != change.oldValue }
      .mapValues { k, change ->

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

    return FungibleBalanceDeltaListRecord.newBuilder()
      .setTimestamp(timestamp)
      .setBlockHash(blockHash)
      .setDeltas(if (reverse) deltas.map { it.reverse() } else deltas)
      .build()
  }
}
