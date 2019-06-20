package com.ethvm.kafka.connect.sources.web3.sources

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
import mu.KotlinLogging
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTaskContext
import org.web3j.protocol.core.methods.response.Transaction
import java.math.BigInteger
import java.util.SortedMap
import java.util.concurrent.Callable
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

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

  override var batchSize = 1

  private val noThreads = 4

  private var targetFetchTimeMs = 3000

  private val maxRequestTraceCount = 1000

  private val initialBatchResizeBackoff = 1000

  private var noBlocksFetched = 0L

  private val executor = Executors.newFixedThreadPool(noThreads)

  override fun fetchRange(range: LongRange): List<SourceRecord> {

    try {

      val chunkSize = when {
        batchSize < noThreads -> 1
        else -> batchSize / noThreads
      }

      val startMs = System.currentTimeMillis()

      val futures = range
        .chunked(chunkSize)
        .filter { it.isNotEmpty() }
        .map { chunk ->
          val chunkedRange = LongRange(chunk.first(), chunk.last())
          executor.submit(FetchTask(chunkedRange, parity, maxRequestTraceCount))
        }

      val fetchResults = futures
        .map { it.get(60, TimeUnit.SECONDS) }

      val (blockTimestamps, blockRecordsList) = fetchResults
        .fold(Pair(sortedMapOf<BigInteger, Long>(), emptyList<BlockRecords>()), { memo, next ->
          Pair(
            (memo.first + next.blockTimestamps).toSortedMap(),
            memo.second + next.blockRecords
          )
        })

      var totalTraceCount = 0
      var totalTxCount = 0

      val records = blockRecordsList.map { blockRecords ->

        val (key, header, txList, receiptList, traceList, uncleList) = blockRecords

        val blockNumber = header.getNumberBI()

        val blockTime = when (val prevTimestamp = blockTimestamps[blockNumber.minus(BigInteger.ONE)]) {
          null -> 0 // should only occur for genesis block
          else -> header.timestamp - prevTimestamp
        }

        val partitionOffset = mapOf("blockNumber" to blockNumber.toLong())

        val blockWithTimestamp = BlockHeaderRecord
          .newBuilder(header)
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

        val txListValueSchemaAndValue = AvroToConnect.toConnectData(txList)

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

        totalTxCount += txList.transactions.size
        totalTraceCount += traceList.traces.size

        listOf(headerSourceRecord, unclesSourceRecord, txsSourceRecord, receiptsSourceRecord, tracesSourceRecord)
      }.flatten()

      cleanTimestamps()

      val elapsedMs = System.currentTimeMillis() - startMs
      val count = (range.last - range.first) + 1 // end is inclusive

      // update overall count
      noBlocksFetched += count

      val avgTraceCount = when {
        totalTxCount > 0 -> totalTraceCount / totalTxCount
        else -> 0
      }

      val percentageOfTargetFetchTime = elapsedMs.toFloat() / targetFetchTimeMs

      // Adjust batch size to try and meet target fetch time in order to present consistent load to parity

      logger.debug { "Total blocks fetched = $noBlocksFetched, fetch count = $count. Elapsed = $elapsedMs ms, target fetch = $targetFetchTimeMs ms, % of target fetch = $percentageOfTargetFetchTime, trace count = $totalTraceCount, avg trace count = $avgTraceCount" }

      // initial back off is to help when we restart as a result of a timeout. It is intended to put less stress on parity for a while
      // whilst allowing forward progress through the chain
      val canResizeBatch = noBlocksFetched > initialBatchResizeBackoff

      if (canResizeBatch) {
        batchSize = when {
          percentageOfTargetFetchTime < 0.7 -> batchSize * 2
          percentageOfTargetFetchTime > 1.5 -> batchSize / 2
          else -> batchSize
        }
      }

      // since we use integer division it's possible we can reach 0
      if (batchSize < 1) {
        batchSize = 1
      }

      return records
    } catch (ex: TimeoutException) {
      // parity is probably under high load
      throw RetriableException(ex)
    }
  }

  private fun cleanTimestamps() {

    while (blockTimestamps.size > 5000) {
      // map is ordered, remove older entries first
      blockTimestamps.remove(blockTimestamps.firstKey())
    }
  }

  override fun tombstone(number: Long): List<SourceRecord> {

    val numberBI = number.toBigInteger()
    val partitionOffset = mapOf("blockNumber" to number)

    val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
      .setNumberBI(numberBI)
      .build()

    val keySchemaAndValue = AvroToConnect.toConnectData(canonicalKeyRecord)

    val headerSourceRecord =
      SourceRecord(
        partitionKey,
        partitionOffset,
        blocksTopic,
        keySchemaAndValue.schema(),
        keySchemaAndValue.value(),
        AvroToConnect.toConnectSchema(BlockHeaderRecord.`SCHEMA$`, true),
        null
      )

    // transactions

    val txsSourceRecord =
      SourceRecord(
        partitionKey,
        partitionOffset,
        txTopic,
        keySchemaAndValue.schema(),
        keySchemaAndValue.value(),
        AvroToConnect.toConnectSchema(TransactionListRecord.`SCHEMA$`, true),
        null
      )

    // receipts

    val receiptsSourceRecord =
      SourceRecord(
        partitionKey,
        partitionOffset,
        receiptsTopic,
        keySchemaAndValue.schema(),
        keySchemaAndValue.value(),
        AvroToConnect.toConnectSchema(TransactionReceiptListRecord.`SCHEMA$`, true),
        null
      )

    // traces

    val tracesSourceRecord =
      SourceRecord(
        partitionKey,
        partitionOffset,
        tracesTopic,
        keySchemaAndValue.schema(),
        keySchemaAndValue.value(),
        AvroToConnect.toConnectSchema(TraceListRecord.`SCHEMA$`, true),
        null
      )

    // uncles

    val unclesSourceRecord =
      SourceRecord(
        partitionKey,
        partitionOffset,
        unclesTopic,
        keySchemaAndValue.schema(),
        keySchemaAndValue.value(),
        AvroToConnect.toConnectSchema(UncleListRecord.`SCHEMA$`, true),
        null
      )

    return listOf(
      headerSourceRecord,
      txsSourceRecord,
      receiptsSourceRecord,
      tracesSourceRecord,
      unclesSourceRecord
    )
  }

  data class BlockRecords(
    val key: CanonicalKeyRecord,
    val blockHeader: BlockHeaderRecord,
    val txList: TransactionListRecord,
    val receiptList: TransactionReceiptListRecord,
    val traceList: TraceListRecord,
    val uncleList: UncleListRecord
  )

  data class FetchResult(
    val blockTimestamps: SortedMap<BigInteger, Long>,
    val blockRecords: List<BlockRecords>
  )

  class FetchTask(
    val range: LongRange,
    val parity: JsonRpc2_0ParityExtended,
    val maxTraceCount: Int
  ) : Callable<FetchResult> {

    protected val logger = KotlinLogging.logger {}

    override fun call(): FetchResult {

      var nextRange: LongRange? = range
      var blockRecords = emptyList<BlockRecords>()

      val blockTimestamps = sortedMapOf<BigInteger, Long>()

      logger.debug { "Fetching range: $range" }

      do {

        logger.debug { "Next = $nextRange" }

        val first = nextRange!!.first
        val last = nextRange.last

        val resp = parity.ethvmGetBlocksByNumber(
          first.toBigInteger(),
          last.toBigInteger(),
          maxTraceCount
        ).send()

        blockRecords = blockRecords + resp.fullBlocks.map { fullBlock ->

          val block = fullBlock.block

          val blockNumber = block.number

          // unix timestamp in seconds since epoch
          val timestamp = block.timestamp.longValueExact() * 1000

          // record timestamp for later
          blockTimestamps[blockNumber] = timestamp

          val canonicalKeyRecord = CanonicalKeyRecord.newBuilder()
            .setNumberBI(blockNumber)
            .build()

          val headerRecord = block
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

          val txListRecord = TransactionListRecord.newBuilder()
            .setBlockHash(headerRecord.getHash())
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

          val traces = fullBlock.traces

          val traceListRecord = TraceListRecord.newBuilder()
            .setTimestamp(timestamp)
            .setTraceCount(traces.size)
            .setTraces(
              traces
                .map { it.toTraceRecord(TraceRecord.newBuilder()).build() }
            ).build()

          BlockRecords(canonicalKeyRecord, headerRecord, txListRecord, receiptListRecord, traceListRecord, uncleListRecord)
        }

        if (blockRecords.isEmpty()) {
          break
        }

        val latestBlockNumber = blockTimestamps.lastKey().longValueExact()

        nextRange = when {
          latestBlockNumber < last -> {
            logger.debug { "Latest block number = $latestBlockNumber, nextRange last = ${nextRange!!.last}" }
            LongRange(latestBlockNumber + 1, last)
          }
          else -> null
        }
      } while (nextRange != null)

      logger.debug { "Finished fetching range: $range" }

      return FetchResult(blockTimestamps, blockRecords)
    }
  }
}
