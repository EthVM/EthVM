package com.ethvm.kafka.connect.sources.web3.sources

import com.ethvm.avro.capture.BlockHeaderRecord
import com.ethvm.avro.capture.BlockRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.capture.TraceRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionReceiptRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.capture.UncleListRecord
import com.ethvm.avro.capture.UncleRecord
import com.ethvm.common.config.ChainId
import com.ethvm.common.extensions.byteBuffer
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
import java.nio.ByteBuffer
import java.util.concurrent.Callable
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

class ParityFullBlockSource(
  sourceContext: SourceTaskContext,
  parity: JsonRpc2_0ParityExtended
) : AbstractParityEntitySource(sourceContext, parity) {

  override val partitionKey: Map<String, Any> = mapOf("model" to "fullBlocks")

  private val blockTimestamps = sortedMapOf<BigInteger, Long>()

  override var batchSize = 1

  private val noThreads = 4

  private var targetFetchTimeMs = 3000

  private val maxRequestTraceCount = 1000

  private val initialBatchResizeBackoff = 1000

  private var noBlocksFetched = 0L

  private val executor = Executors.newFixedThreadPool(noThreads)

  private val chainId: ChainId = parity
    .ethChainId()
    .sendAsync()
    .thenApply { response -> ChainId.forHex(response.chainId) }
    .join()!!

  private val topicBlocks = "${chainId.name.toLowerCase()}_blocks"

  private val topicTraces = "${chainId.name.toLowerCase()}_traces"

  override val topicSyncState = "${chainId.name.toLowerCase()}_parity_sync_state"

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
        .flatten()

      var totalTraceCount = 0
      var totalTxCount = 0

      val records = fetchResults.map { blockRecords ->

        val (key, header, txList, receiptList, traceList, uncleList) = blockRecords

        val blockNumber = header.getNumberBI()
        val timestamp = header.timestamp

        val partitionOffset = mapOf("blockNumber" to blockNumber.toLong())

        val keySchemaAndValue = AvroToConnect.toConnectData(key)
        val valueSchemaAndValue = AvroToConnect.toConnectData(
          BlockRecord.newBuilder()
            .setHeader(header)
            .setUncles(uncleList.uncles)
            .setTransactions(txList.transactions)
            .setReceipts(receiptList.receipts)
            .build()
        )

        val blockRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            topicBlocks,
            0,
            keySchemaAndValue.schema(),
            keySchemaAndValue.value(),
            valueSchemaAndValue.schema(),
            valueSchemaAndValue.value(),
            timestamp
          )

        val traceListValueSchemaAndValue = AvroToConnect.toConnectData(traceList)

        val tracesSourceRecord =
          SourceRecord(
            partitionKey,
            partitionOffset,
            topicTraces,
            0,
            keySchemaAndValue.schema(),
            keySchemaAndValue.value(),
            traceListValueSchemaAndValue.schema(),
            traceListValueSchemaAndValue.value(),
            timestamp
          )

        totalTxCount += txList.transactions.size
        totalTraceCount += traceList.traces.size

        listOf(blockRecord, tracesSourceRecord)
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

  data class BlockRecords(
    val key: CanonicalKeyRecord,
    val blockHeader: BlockHeaderRecord,
    val txList: TransactionListRecord,
    val receiptList: TransactionReceiptListRecord,
    val traceList: TraceListRecord,
    val uncleList: UncleListRecord
  )

  class FetchTask(
    val range: LongRange,
    val parity: JsonRpc2_0ParityExtended,
    val maxTraceCount: Int
  ) : Callable<List<BlockRecords>> {

    protected val logger = KotlinLogging.logger {}

    override fun call(): List<BlockRecords> {

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

          var gasPrices = mapOf<String, ByteBuffer>()

          val txListRecord = TransactionListRecord.newBuilder()
            .setBlockHash(headerRecord.getHash())
            .setTimestamp(timestamp)
            .setTransactions(
              block.transactions
                .map { txResp -> txResp.get() as Transaction }
                .map { tx ->

                  // gather gas prices for inclusion with traces list which provides all the data we need to
                  // determine balance deltas
                  gasPrices = gasPrices + (tx.hash to tx.gasPrice.byteBuffer())

                  tx.toTransactionRecord(TransactionRecord.newBuilder()).build()
                }
            ).build()

          var gasUsed = mapOf<String, ByteBuffer>()

          val receiptListRecord = TransactionReceiptListRecord.newBuilder()
            .setTimestamp(timestamp)
            .setReceipts(
              fullBlock.receipts
                .map { receipt ->

                  gasUsed = gasUsed + (receipt.transactionHash to receipt.gasUsed.byteBuffer())

                  receipt.toTransactionReceiptRecord(
                    TransactionReceiptRecord.newBuilder()
                  ).build()
                }
            ).build()

          val traceRecords =
            fullBlock
              .traces
              .map {
                it.toTraceRecord(
                  TraceRecord.newBuilder()
                    .setBlockNumber(fullBlock.block.number.byteBuffer())
                    .setBlockHash(fullBlock.block.hash)
                ).build()
              }

          val traceListRecord = TraceListRecord.newBuilder()
            .setAuthor(fullBlock.block.author)
            .setTimestamp(timestamp)
            .setBlockNumber(fullBlock.block.number.byteBuffer())
            .setBlockHash(fullBlock.block.hash)
            .setTraceCount(traceRecords.size)
            .setRootError(fullBlock.traces.firstOrNull()?.error)
            .setGasPrices(gasPrices)
            .setGasUsed(gasUsed)
            .setTraces(traceRecords)
            .build()

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

      return blockRecords
    }
  }
}
