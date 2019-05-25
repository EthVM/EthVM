package com.ethvm.kafka.connect.sources.web3.sources

import arrow.core.Tuple6
import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TraceRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleListRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.common.extensions.getNumberBI
import com.ethvm.common.extensions.setHeightBI
import com.ethvm.common.extensions.setNumberBI
import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.ext.toBlockHeaderRecord
import com.ethvm.kafka.connect.sources.web3.ext.toTraceRecord
import com.ethvm.kafka.connect.sources.web3.ext.toTransactionReceiptRecord
import com.ethvm.kafka.connect.sources.web3.ext.toTransactionRecord
import com.ethvm.kafka.connect.sources.web3.ext.toUncleRecord
import com.ethvm.kafka.connect.sources.web3.utils.AvroToConnect
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.joda.time.DateTime
import org.web3j.protocol.core.methods.response.Transaction
import java.math.BigInteger

class ParityFullBlockSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended,
  private val blocksTopic: String,
  private val txTopic: String,
  private val receiptsTopic: String,
  private val unclesTopic: String,
  private val tracesTopic: String,
  syncStateTopic: String
) : AbstractParityEntitySource(sourceContext, parity, syncStateTopic) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "fullBlocks")

  private val blockTimestamps = sortedMapOf<BigInteger, Long>()

  override val batchSize = 512

  private val chunkSize = batchSize / 8

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    val futures = range
      .chunked(chunkSize)
      .map { chunkedRange ->

        parity
          .ethvmGetBlocksByNumber(
            chunkedRange.first().toBigInteger(),
            chunkedRange.last().toBigInteger()
          ).sendAsync()
          .thenApply { resp ->

            resp.fullBlocks
              .map { fullBlock ->

                val block = fullBlock.block

                val blockNumber = block.number

                // unix timestamp in seconds since epoch
                val timestamp = block.timestamp.longValueExact() * 1000

                // record timestamp for later
                blockTimestamps[blockNumber] = timestamp

                val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
                  .setNumberBI(blockNumber)
                  .build()

                val blockRecord = block
                  .toBlockHeaderRecord(BlockHeaderRecord.newBuilder(), 0)
                  .build()

                val uncleListRecord = UncleListRecord.newBuilder()
                  .setTimestamp(timestamp)
                  .setUncles(
                    fullBlock.uncles
                      .mapIndexed { index, uncle ->
                        uncle.toUncleRecord(
                          UncleRecord.newBuilder()
                            .setNephewHash(block.hash)
                            .setHeightBI(block.number)
                            .setIndex(index)
                        ).build()
                      }
                  ).build()

                val transactionListRecord = TransactionListRecord.newBuilder()
                  .setBlockHash(blockRecord.getHash())
                  .setTimestamp(timestamp)
                  .setTransactions(
                    block.transactions
                      .map { txResp -> txResp.get() as Transaction }
                      .map { tx -> tx.toTransactionRecord(TransactionRecord.newBuilder()).build() }
                  ).build()

                val receiptListRecord = TransactionReceiptListRecord.newBuilder()
                  .setTimestamp(timestamp)
                  .setReceipts(
                    fullBlock.receipts
                      .map { it.toTransactionReceiptRecord(TransactionReceiptRecord.newBuilder()).build() }
                  ).build()


                val traceListRecord = TraceListRecord.newBuilder()
                  .setTimestamp(timestamp)
                  .setTraces(
                    fullBlock.traces
                      .map { it.toTraceRecord(TraceRecord.newBuilder()).build() }
                  ).build()

                Tuple6(canonicalKeyRecord, blockRecord, uncleListRecord, transactionListRecord, receiptListRecord, traceListRecord)

              }

          }

      }

    val tuples = futures
      .map { it.join() }
      .flatten()

    val records = tuples.map { (key, block, uncleList, transactionList, receiptList, traceList) ->

      val blockNumber = key.getNumberBI()

      val blockTime = when (val prevTimestamp = blockTimestamps[blockNumber.minus(BigInteger.ONE)]) {
        null -> 0 // should only occur for genesis block
        else -> block.timestamp - prevTimestamp
      }

      val partitionOffset = mapOf("blockNumber" to blockNumber.toLong())

      val blockWithTimestamp = BlockHeaderRecord
        .newBuilder(block)
        .setBlockTime((blockTime / 1000).toInt()) // seconds
        .build()

      val keySchemaAndValue = AvroToConnect.toConnectData(key)
      val valueSchemaAndValue = AvroToConnect.toConnectData(blockWithTimestamp)

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

      val uncleListValueSchemaAndValue = AvroToConnect.toConnectData(uncleList)

      val unclesSourceRecord =
        SourceRecord(
          partitionKey,
          partitionOffset,
          unclesTopic,
          keySchemaAndValue.schema(),
          keySchemaAndValue.value(),
          uncleListValueSchemaAndValue.schema(),
          uncleListValueSchemaAndValue.value()
        )

      val txListValueSchemaAndValue = AvroToConnect.toConnectData(transactionList)

      val txsSourceRecord =
        SourceRecord(
          partitionKey,
          partitionOffset,
          txTopic,
          keySchemaAndValue.schema(),
          keySchemaAndValue.value(),
          txListValueSchemaAndValue.schema(),
          txListValueSchemaAndValue.value()
        )

      val receiptListValueSchemaAndValue = AvroToConnect.toConnectData(receiptList)

      val receiptsSourceRecord =
        SourceRecord(
          partitionKey,
          partitionOffset,
          receiptsTopic,
          keySchemaAndValue.schema(),
          keySchemaAndValue.value(),
          receiptListValueSchemaAndValue.schema(),
          receiptListValueSchemaAndValue.value()
        )


      val traceListValueSchemaAndValue = AvroToConnect.toConnectData(traceList)

      val tracesSourceRecord =
        SourceRecord(
          partitionKey,
          partitionOffset,
          tracesTopic,
          keySchemaAndValue.schema(),
          keySchemaAndValue.value(),
          traceListValueSchemaAndValue.schema(),
          traceListValueSchemaAndValue.value()
        )

      listOf(headerSourceRecord, unclesSourceRecord, txsSourceRecord, receiptsSourceRecord, tracesSourceRecord)
    }.flatten()

    cleanTimestamps()

    return records
  }

  private fun cleanTimestamps() {

    while (blockTimestamps.size > 5000) {
      // map is ordered, remove older entries first
      blockTimestamps.remove(blockTimestamps.firstKey())
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
            txTopic,
            canonicalKeySchemaAndValue.schema(),
            canonicalKeySchemaAndValue.value(),
            AvroToConnect.toConnectSchema(TransactionListRecord.`SCHEMA$`),
            null
          )

        listOf(headerSourceRecord, txsSourceRecord)
      }
      .flatten()
}
