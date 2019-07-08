package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.processing.AccountKeyRecord
import com.ethvm.avro.processing.BlockMetricKeyRecord
import com.ethvm.avro.processing.BlockMetricsTransactionRecord
import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.avro.processing.TransactionCountDeltaListRecord
import com.ethvm.avro.processing.TransactionCountDeltaRecord
import com.ethvm.avro.processing.TransactionGasPriceListRecord
import com.ethvm.avro.processing.TransactionGasPriceRecord
import com.ethvm.avro.processing.TransactionKeyRecord
import com.ethvm.common.extensions.getGasBI
import com.ethvm.common.extensions.getGasPriceBI
import com.ethvm.common.extensions.reverse
import com.ethvm.common.extensions.setAvgGasLimitBI
import com.ethvm.common.extensions.setAvgGasPriceBI
import com.ethvm.common.extensions.setTotalGasPriceBI
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.processors.transformers.CanonicalKStreamReducer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.KStream
import org.joda.time.DateTime
import java.math.BigInteger
import java.util.Properties

class CanonicalTransactionsProcessor : AbstractKafkaProcessor() {

  override val id: String = "canonical-transactions-processor"

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

    val canonicalTransactions = CanonicalTransactions.stream(builder)

    // Block metrics transactions

    canonicalTransactions
      .map { _, transactionList ->

        val transactions = transactionList.getTransactions()

        var totalGasPrice = BigInteger.ZERO
        var totalGasLimit = BigInteger.ZERO

        transactions.forEach { tx ->
          totalGasLimit += tx.getGasBI()
          totalGasPrice += tx.getGasPriceBI()
        }

        val txCount = transactions.size.toBigInteger()

        val (avgGasPrice, avgGasLimit) = when (txCount) {
          BigInteger.ZERO -> listOf(BigInteger.ZERO, BigInteger.ZERO)
          else -> listOf(
            totalGasPrice / txCount,
            totalGasLimit / txCount
          )
        }

        KeyValue(
          BlockMetricKeyRecord.newBuilder()
            .setBlockHash(transactionList.getBlockHash())
            .setTimestamp(DateTime(transactionList.getTimestamp()))
            .build(),
          BlockMetricsTransactionRecord.newBuilder()
            .setTimestamp(DateTime(transactionList.getTimestamp()))
            .setTotalGasPriceBI(totalGasPrice)
            .setAvgGasPriceBI(avgGasPrice)
            .setAvgGasLimitBI(avgGasLimit)
            .build()
        )
      }
      .toTopic(Topics.BlockMetricsTransaction)

    // counts

    canonicalTransactionCountDeltas(canonicalTransactions)
    addressTransactionCountDeltas(builder, canonicalTransactions)

    // flat map

    canonicalTransactions
      .filter { _, v -> v != null }
      .flatMapValues { _, v ->
        v!!.getTransactions()
          .map {
            TransactionRecord.newBuilder(it)
              .setTimestamp(v.getTimestamp())
              .build()
          }
      }
      .map { _, v ->
        KeyValue(
          TransactionKeyRecord.newBuilder()
            .setTransactionHash(v.getTransactionHash())
            .build(),
          v
        )
      }
      .toTopic(Topics.Transaction)

    // canonical gas prices

    canonicalTransactions
      .mapValues { transactionsList ->

        val blockHash = transactionsList.getTransactions().firstOrNull()?.getBlockHash()

        when (transactionsList) {
          null -> null
          else ->
            TransactionGasPriceListRecord.newBuilder()
              .setBlockHash(blockHash)
              .setTimestamp(DateTime(transactionsList.getTimestamp()))
              .setGasPrices(
                transactionsList.getTransactions()
                  .map { tx ->
                    TransactionGasPriceRecord.newBuilder()
                      .setBlockNumber(tx.getBlockNumber())
                      .setBlockHash(tx.getBlockHash())
                      .setTransactionHash(tx.getTransactionHash())
                      .setTransactionPosition(tx.getTransactionIndex())
                      .setAddress(tx.getFrom())
                      .setGasPrice(tx.getGasPrice())
                      .build()
                  }
              ).build()
        }
      }.toTopic(Topics.CanonicalGasPrices)

    return builder.build()
  }

  private fun canonicalTransactionCountDeltas(canonicalTransactions: KStream<CanonicalKeyRecord, TransactionListRecord>) {

    canonicalTransactions
      .map { k, v ->
        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("transaction")
            .setNumber(k.number)
            .build(),
          CanonicalCountRecord.newBuilder()
            .setCount(v.transactions.size.toLong())
            .build()
        )
      }
      .toTopic(Topics.CanonicalCountDelta)
  }

  private fun addressTransactionCountDeltas(builder: StreamsBuilder, canonicalTransactions: KStream<CanonicalKeyRecord, TransactionListRecord>) {

    val deltas = canonicalTransactions
      .mapValues { v ->

        val txCounts = v.getTransactions()
          .map { tx ->

            var counts = listOf(
              TransactionCountDeltaRecord.newBuilder()
                .setAddress(tx.from)
                .setOut(1)
                .build()
            )

            if (tx.to != null) {
              counts = counts + TransactionCountDeltaRecord.newBuilder()
                .setAddress(tx.to)
                .setIn(1)
                .build()
            }

            counts
          }.flatten()

        TransactionCountDeltaListRecord.newBuilder()
          .setTimestamp(DateTime(v.getTimestamp()))
          .setBlockHash(v.getBlockHash())
          .setCounts(txCounts)
          .build()
      }

    val reduceStoreName = "canonical-tx-count-reduce"
    builder.addStateStore(CanonicalKStreamReducer.store(reduceStoreName, Serdes.TransactionCountDeltaList(), appConfig.unitTesting))

    val deltasWithReversals = deltas
      .transform(CanonicalKStreamReducer(reduceStoreName), reduceStoreName)
      .filter { _, change -> change.newValue != change.oldValue }
      .flatMapValues { _, change ->

        require(change.newValue != null) { "Change newValue cannot be null. A tombstone has been received" }

        val delta = listOf(change.newValue)

        val reversal = if (change.oldValue != null) {
          listOf(
            TransactionCountDeltaListRecord.newBuilder(change.oldValue)
              .setCounts(change.oldValue.counts.map { it.reverse() })
              .build()
          )
        } else {
          emptyList()
        }

        reversal + delta
      }

    val deltasForAddress = deltasWithReversals
      .flatMap { _, v ->

        v.counts
          .map { delta ->
            KeyValue(
              AccountKeyRecord.newBuilder()
                .setAddress(delta.address)
                .build(),
              TransactionCountDeltaRecord.newBuilder(delta)
                .setTimestamp(v.getTimestamp())
                .build()
            )
          }
      }

    deltasForAddress.toTopic(Topics.TransactionCountDelta)
  }
}
