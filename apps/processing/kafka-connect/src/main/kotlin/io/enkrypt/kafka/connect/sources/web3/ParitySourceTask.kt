package io.enkrypt.kafka.connect.sources.web3

import arrow.core.Tuple3
import io.confluent.connect.avro.AvroData
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.hexUBigInteger
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.kafka.connect.extensions.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.utils.Versions
import io.reactivex.Observable
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import mu.KotlinLogging
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.exceptions.ClientConnectionException
import org.web3j.protocol.websocket.WebSocketService
import java.math.BigInteger
import java.net.ConnectException
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.ExecutionException
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

// @Alpha - Not ready for prime time
class ParitySourceTask : SourceTask() {

  private val logger = KotlinLogging.logger {}

  private lateinit var wsUrl: String
  private lateinit var blocksTopic: String

  private lateinit var avroData: AvroData

  private lateinit var blockKeyConnectSchema: Schema
  private lateinit var blockValueConnectSchema: Schema

  private var connectDelayMs: Long? = null

  @Volatile
  private var parity: JsonRpc2_0ParityExtended? = null

  private val executor = Executors.newSingleThreadExecutor()

  @Volatile
  private var fetchQueue: ArrayBlockingQueue<ClosedRange<BigInteger>>? = null

  private var subscription: Disposable? = null

  private var lastBlockNumber: BigInteger? = null
  private var subscriptionException: Throwable? = null

  override fun version(): String = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    blocksTopic = ParitySourceConnector.Config.blocksTopic(props)

    avroData = AvroData(10)

    blockKeyConnectSchema = avroData.toConnectSchema(BlockKeyRecord.`SCHEMA$`)
    blockValueConnectSchema = avroData.toConnectSchema(BlockRecord.`SCHEMA$`)

    wsUrl = ParitySourceConnector.Config.wsUrl(props)
  }

  private fun ensureConnection() {

    try {

      if (parity != null) return

      // stop any previous subscription
      subscription?.dispose()

      // reconnect backoff if necessary

      if (connectDelayMs != null) {
        logger.debug { "Waiting $connectDelayMs ms before connecting" }
        Thread.sleep(connectDelayMs!!)
      }

      // connect

      logger.debug { "Connecting to $wsUrl" }

      val wsService = WebSocketService(wsUrl, false)
      wsService.connect()

      // create a new work queue
      fetchQueue = ArrayBlockingQueue(20)

      // reset reconnect logic
      connectDelayMs = null

      parity = JsonRpc2_0ParityExtended(wsService)

      lastBlockNumber = blockNumberOffset()
      logger.info { "Block offset $lastBlockNumber" }

      val isSyncing = parity!!.ethSyncing().send().isSyncing

      subscription = when (isSyncing) {
        false -> offlineSync(lastBlockNumber, fetchQueue!!)
        true -> liveSync(lastBlockNumber, fetchQueue!!)
      }

    } catch (ex: Exception) {

      when (ex) {
        is ConnectException -> {

          var connectDelayMs = (this.connectDelayMs ?: 1000) * 2

          if(connectDelayMs > 30000) {
            connectDelayMs = 30000
          }

          this.connectDelayMs = connectDelayMs

          throw RetriableException(ex)
        }
        else -> throw ex
      }

    }

  }

  private fun blockNumberOffset(): BigInteger? {

    val sourcePartition = context
      .offsetStorageReader()
      .offset(mapOf("wsUrl" to wsUrl)) ?: return null

    val number = sourcePartition["number"]

    return when (number) {
      null -> null
      is Long -> {

        // we deduct some blocks in case a fork happened whilst the connector was offline

        val numberMinusForkProtection = number - 256
        if (numberMinusForkProtection < 0) null else number.toBigInteger()

      }
      else -> throw IllegalStateException("Unexpected value returned: $number")
    }

  }

  private fun offlineSync(blockNumberOffset: BigInteger?, rangeQueue: ArrayBlockingQueue<ClosedRange<BigInteger>>) : Disposable {

    val latestBlockNumber = parity!!.ethBlockNumber().send().blockNumber

    logger.info { "offline syncing - block number offset: $blockNumberOffset, latest block number = $latestBlockNumber" }

    val start = blockNumberOffset ?: BigInteger.ZERO

    return Observable
      .fromIterable(rangesFor(start, latestBlockNumber))
      .observeOn(Schedulers.single())
      .subscribe(
        { range -> rangeQueue.put(range) },
        { throwable ->
          subscriptionException = when (throwable) {
            is ClientConnectionException -> RetriableException(throwable)
            else -> throwable
          }
        }
      )

  }

  private fun liveSync(blockNumberOffset: BigInteger?, rangeQueue: ArrayBlockingQueue<ClosedRange<BigInteger>>): Disposable {

    logger.info { "live syncing - block number offset: $blockNumberOffset" }

    var historicFetchComplete = false

    val historicBlockStart = blockNumberOffset ?: BigInteger.ZERO

    return parity!!
      .newHeadsNotifications()
      .observeOn(Schedulers.single())
      .map { it.params.result }
      .map { it.number.hexUBigInteger()!! to it.hash }
      .buffer(1000, TimeUnit.MILLISECONDS, 128)
      .onBackpressureBuffer()
      .subscribe(
        { heads ->

          if (heads.isNotEmpty()) {

            // possible during a fork where older block numbers are re-published so we find the max and min within the batch

            var start = heads.minBy { it.first }!!.first
            val end = heads.maxBy { it.first }!!.first

            if (!historicFetchComplete) {

              // if we have yet to do a historic load we do that first
              // Ranges are inclusive so we add one to the start when we are finished

              rangesFor(historicBlockStart, start)
                .forEach { range -> rangeQueue.put(range) }

              historicFetchComplete = true
              start += BigInteger.ONE

            }

            rangeQueue.put(start.rangeTo(end))
          }
        },
        { throwable ->
          subscriptionException = when (throwable) {
            is ClientConnectionException -> RetriableException(throwable)
            else -> throwable
          }
        }
      )

  }

  override fun stop() {
    logger.debug { "Stopping" }

    executor.shutdown()
    executor.awaitTermination(60, TimeUnit.SECONDS)

    parity?.shutdown()
    parity = null

    logger.debug { "Stopped" }
  }

  override fun poll(): MutableList<SourceRecord> {

    try {

      logger.debug { "Polling" }

      // throw if an error occurred in the subscription
      val subscriptionException = this.subscriptionException
      if (subscriptionException != null) throw subscriptionException

      // ensure we are connected or re-connect if necessary
      ensureConnection()

      val ranges = mutableListOf<ClosedRange<BigInteger>>()

      val timeoutMs = TimeUnit.SECONDS.toMillis(30)
      val startedMs = System.currentTimeMillis()
      var elapsedMs = 0L

      while (elapsedMs < timeoutMs && fetchQueue?.drainTo(ranges) == 0) {
        Thread.sleep(1000)
        elapsedMs = System.currentTimeMillis() - startedMs
      }

      val sourceRecords = ranges
        .map { executor.submit<List<BlockData>> { fetchRange(it) } }
        .map { it.get(30, TimeUnit.SECONDS) }
        .map { blocks ->

          blocks.map { blockData ->

            // we track the sequence of block numbers to identify any gap in retrieval
            val number = blockData.block.number
            val expectedNumber = (lastBlockNumber ?: BigInteger.ONE.negate()) + BigInteger.ONE

            require(number == expectedNumber) { "Sequence gap detected. Expected $expectedNumber, received $number" }

            lastBlockNumber = number

            // convert to block record
            blockData.toBlockRecord().build()

          }

        }.flatten()
        .map { record ->

          val number = record.getHeader().getNumber()

          val key = avroData.toConnectData(
            BlockKeyRecord.`SCHEMA$`,
            BlockKeyRecord.newBuilder()
              .setNumber(number)
              .build()
          ).value()

          val source = mapOf("wsUrl" to wsUrl)
          val offset = mapOf("number" to number.unsignedBigInteger()!!.longValueExact())

          val value = avroData.toConnectData(BlockRecord.`SCHEMA$`, record).value()

          SourceRecord(source, offset, blocksTopic, blockKeyConnectSchema, key, blockValueConnectSchema, value)

        }

      logger.debug { "Polled ${sourceRecords.size} records" }

      return sourceRecords.toMutableList()

    } catch (ex: Exception) {

      parity?.shutdown()
      parity = null

      return when(ex) {

        // return an empty list as we can try another poll
        is RetriableException -> mutableListOf()

        // likely a result of the connection dropping mid fetch
        // TODO apply finer grained exception checks
        is ExecutionException -> mutableListOf()

        // otherwise rethrow
        else -> throw ex
      }

    }

  }

  private fun fetchRange(range: ClosedRange<BigInteger>): List<BlockData> {

    logger.info { "Fetching blocks. Start = ${range.start}, end = ${range.endInclusive}" }

    // force into long for iteration

    val longRange = LongRange(range.start.longValueExact(), range.endInclusive.longValueExact())

    val futures = longRange.map { blockNumber ->

      val blockParam = DefaultBlockParameter.valueOf(blockNumber.toBigInteger())

      val blockFuture = parity!!.ethGetBlockByNumber(blockParam, true).sendAsync()
      val receiptsFuture = parity!!.parityGetBlockReceipts(blockParam).sendAsync()
      val tracesFuture = parity!!.traceBlock(blockParam).sendAsync()

      Tuple3(blockFuture, receiptsFuture, tracesFuture)
    }

    val result = futures.map { (blockFuture, receiptsFuture, tracesFuture) ->

      val block = blockFuture.get().block

      val uncleFutures = block.uncles.mapIndexed { idx, _ ->
        parity!!.ethGetUncleByBlockHashAndIndex(block.hash, idx.toBigInteger()).sendAsync()
      }

      val receipts = receiptsFuture.get().receipts
      val traces = tracesFuture.get().traces

      val uncles = uncleFutures.map { it.get().block }

      BlockData(block, uncles, receipts, traces)
    }

    logger.info { "Finished fetching blocks . Start = ${range.start}, end = ${range.endInclusive}" }

    return result

  }

  private fun rangesFor(syncedUntil: BigInteger, end: BigInteger, batchSize: Int = 128): List<ClosedRange<BigInteger>> {

    val start =
      if (syncedUntil > BigInteger.ZERO)
        syncedUntil + BigInteger.ONE
      else
        syncedUntil

    var ranges = emptyList<ClosedRange<BigInteger>>()

    val batchSizeBigInt = batchSize.toBigInteger()
    var batchStart = start

    while (batchStart < end) {

      var batchEnd = batchStart + batchSizeBigInt
      if (batchEnd > end) batchEnd = end

      ranges = ranges + batchStart.rangeTo(batchEnd)
      batchStart += (batchSizeBigInt + BigInteger.ONE)
    }

    return ranges
  }
}
