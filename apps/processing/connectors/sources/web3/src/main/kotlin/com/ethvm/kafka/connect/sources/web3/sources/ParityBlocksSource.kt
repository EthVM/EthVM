package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleListRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.ext.toBlockHeaderRecord
import com.ethvm.kafka.connect.sources.web3.ext.toTransactionRecord
import com.ethvm.kafka.connect.sources.web3.ext.toUncleRecord
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import mu.KotlinLogging
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.methods.response.Transaction
import java.math.BigInteger
import java.util.concurrent.CompletableFuture
import java.util.concurrent.atomic.AtomicBoolean

class ParityBlocksSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val blocksTopic: String,
  private val txsBlockTopic: String,
  private val unclesTopic: String
) : AbstractParityEntitySource(sourceContext, parity) {

  private val logger = KotlinLogging.logger {}

  override val partitionKey: Map<String, Any> = mapOf("model" to "block")

  private val blockTimestamps = sortedMapOf<BigInteger, Int>()
  private val timestampsLock = AtomicBoolean(false)

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    val components = range
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val blockParam = DefaultBlockParameter.valueOf(blockNumberBI)

        parity
          .ethGetBlockByNumber(blockParam, true).sendAsync()
          .thenCompose { resp ->

            val block = resp.block

            // record timestamp

            val blockTimestamp = block.timestamp.toInt()
            blockTimestamps[blockNumberBI] = blockTimestamp

            // uncles

            val unclesFuture = parity
              .ethGetUncleCountByBlockNumber(blockParam)
              .sendAsync()
              .thenCompose { uncleResp ->

                val uncleCount = uncleResp.uncleCount.toLong()

                return@thenCompose if (uncleCount > 0) {

                  val uncleFutures = 0.until(uncleCount)
                    .map { pos ->
                      parity
                        .ethGetUncleByBlockHashAndIndex(block.hash, pos.toBigInteger())
                        .sendAsync()
                    }

                  CompletableFuture.allOf(*uncleFutures.toTypedArray())
                    .thenApply { uncleFutures.map { uncleFuture -> uncleFuture.join() } }
                } else {
                  CompletableFuture.completedFuture(emptyList())
                }
              }

            return@thenCompose unclesFuture.thenApply { uncles ->
              Pair(block, uncles)
            }
          }
      }.map { f -> f.join() }

    //
    tryCleanTimestamps()

    //

    return components.map { (block, uncles) ->

      val blockNumber = block.number

      val partitionOffset = mapOf("blockNumber" to blockNumber.toLong())

      val blockKeyRecord = CanonicalKeyRecord.newBuilder()
        .setNumberBI(blockNumber)
        .build()

      val blockTime = when (val prevTimestamp = blockTimestamps[blockNumber.minus(BigInteger.ONE)]) {
        null -> null
        else -> block.timestamp.toInt() - prevTimestamp
      }

      val blockRecord = block
        .toBlockHeaderRecord(BlockHeaderRecord.newBuilder(), blockTime)
        .build()

      val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)
      val valueSchemaAndValue = AvroToConnect.toConnectData(blockRecord)

      val headerSourceRecord =
        SourceRecord(
          partitionKey,
          partitionOffset,
          blocksTopic,
          keySchemaAndValue.schema(),
          keySchemaAndValue.value(),
          valueSchemaAndValue.schema(),
          valueSchemaAndValue.value()
        )

      // transactions

      val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
        .setNumberBI(blockNumber)
        .build()

      val canonicalKeySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)

      val transactionListRecord = TransactionListRecord.newBuilder()
        .setBlockHash(blockRecord.getHash())
        .setTransactions(
          block.transactions
            .map { txResp -> txResp.get() as Transaction }
            .map { tx ->
              tx.toTransactionRecord(
                TransactionRecord
                  .newBuilder()
                  .setTimestamp(block.timestamp.longValueExact())
              ).build()
            }
        ).build()

      val txListValueSchemaAndValue = AvroToConnect.toConnectData(transactionListRecord)

      val txsSourceRecord =
        SourceRecord(
          partitionKey,
          partitionOffset,
          txsBlockTopic,
          canonicalKeySchemaAndValue.schema(),
          canonicalKeySchemaAndValue.value(),
          txListValueSchemaAndValue.schema(),
          txListValueSchemaAndValue.value()
        )

      val uncleListRecord = UncleListRecord.newBuilder()
        .setUncles(uncles.mapIndexed { index, u -> u.block.toUncleRecord(index, block.hash, blockNumber, UncleRecord.newBuilder()).build() })
        .build()

      val uncleKeySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)
      val uncleValueSchemaAndValue = AvroToConnect.toConnectData(uncleListRecord)

      val unclesSourceRecord = SourceRecord(
        partitionKey,
        partitionOffset,
        unclesTopic,
        uncleKeySchemaAndValue.schema(),
        uncleKeySchemaAndValue.value(),
        uncleValueSchemaAndValue.schema(),
        uncleValueSchemaAndValue.value()
      )

      listOf(headerSourceRecord, txsSourceRecord, unclesSourceRecord)
    }.flatten()
  }

  private fun tryCleanTimestamps() {

    if (timestampsLock.compareAndSet(false, true)) {

      while (blockTimestamps.size > 5000) {
        // map is ordered, remove older entries first
        blockTimestamps.remove(blockTimestamps.firstKey())
      }

      timestampsLock.set(false)
    }
  }

  override fun tombstonesForRange(range: LongRange): List<SourceRecord> =
    range
      .map { blockNumber ->

        val blockNumberBI = blockNumber.toBigInteger()
        val partitionOffset = mapOf("blockNumber" to blockNumber)

        val blockKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val keySchemaAndValue = AvroToConnect.toConnectData(blockKeyRecord)

        val headerSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            blocksTopic,
            keySchemaAndValue.schema(),
            keySchemaAndValue.value(),
            AvroToConnect.toConnectSchema(BlockHeaderRecord.`SCHEMA$`),
            null
          )

        // transactions

        val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
          .setNumberBI(blockNumberBI)
          .build()

        val canonicalKeySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)

        val txsSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            txsBlockTopic,
            canonicalKeySchemaAndValue.schema(),
            canonicalKeySchemaAndValue.value(),
            AvroToConnect.toConnectSchema(TransactionListRecord.`SCHEMA$`),
            null
          )

        listOf(headerSourceRecord, txsSourceRecord)
      }
      .flatten()
}
