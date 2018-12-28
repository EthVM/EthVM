package io.enkrypt.kafka.connect.sources.web3

import io.confluent.connect.avro.AvroData
import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.enkrypt.kafka.connect.extensions.toStruct
import io.enkrypt.kafka.connect.utils.Versions
import io.reactivex.Flowable
import mu.KotlinLogging
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.methods.response.Transaction
import org.web3j.protocol.websocket.WebSocketService
import java.io.IOException
import java.math.BigInteger
import java.net.ConnectException
import java.util.concurrent.ArrayBlockingQueue

// @Alpha - Not ready for prime time
class Web3SourceTask : SourceTask() {

  private val logger = KotlinLogging.logger {}

  private val queueSize = 1024
  private val pollTimeoutMs = 1000L
  private val queueCheckIntervalMs = 10L

  private lateinit var wsUrl: String
  private lateinit var blocksTopic: String

  private lateinit var blockKeySchema: Schema
  private lateinit var blockValueSchema: Schema

  private lateinit var queue: ArrayBlockingQueue<SourceRecord>

  private var replayBuffer: Int = 0

  @Volatile
  private var error: Throwable? = null
  @Volatile
  private var web3: Web3j? = null

  override fun version(): String = Versions.of("/web3-source-version.properties")

  override fun start(props: MutableMap<String, String>?) {

    queue = ArrayBlockingQueue(queueSize)

    val registryUrl = Web3SourceConnector.Config.schemaRegistryUrl(props!!)
    val blockKeySchemaId = Web3SourceConnector.Config.blockKeySchemaId(props)
    val blockValueSchemaId = Web3SourceConnector.Config.blockValueSchemaId(props)

    val registryClient = CachedSchemaRegistryClient(registryUrl, 10)

    val avroData = AvroData(100)
    blockKeySchema = avroData.toConnectSchema(registryClient.getById(blockKeySchemaId))
    blockValueSchema = avroData.toConnectSchema(registryClient.getById(blockValueSchemaId))

    logger.info { "Block key schema; $blockKeySchema" }
    logger.info { "Block value schema: $blockValueSchema" }

    wsUrl = Web3SourceConnector.Config.wsUrl(props)
    blocksTopic = Web3SourceConnector.Config.blocksTopic(props)
    replayBuffer = Web3SourceConnector.Config.replayBuffer(props)

    connect()
  }

  private fun connect() {

    logger.info { "Connecting" }

    error = null
    web3?.shutdown() // cleanup previous client if there is one

    try {

      val wsService = WebSocketService(wsUrl, false)
      wsService.connect()

      val web3 = Web3j.build(wsService)
      this.web3 = web3

      val sourcePartition = context
        .offsetStorageReader()
        .offset(mapOf("url" to wsUrl))

      // we start replay from 192 blocks before the last one in case we missed a fork
      // TODO use big integer instead
      val lastBlockNumber =
        if (sourcePartition == null) {
          0L
        } else (sourcePartition.getOrDefault("number", 0L) as Long)

      var replayFrom = lastBlockNumber.toBigInteger() - replayBuffer.toBigInteger()
      if (replayFrom < BigInteger.ZERO) {
        replayFrom = BigInteger.ZERO
      }

      logger.info { "Last block published = $lastBlockNumber. Starting replay from block $replayFrom" }

      val replay = web3!!
        .replayPastAndFutureBlocksFlowable(DefaultBlockParameter.valueOf(replayFrom), true)

      replay
        .doOnError {
          when (it) {
            is IOException -> {
              // most likely a disconnection so wait 30 seconds and try to re-establish
              logger.warn { "Disconnect detected, attempting re-connect in 30 seconds" }
              Thread.sleep(30000L)
              connect()
            }
            else -> error = it // capture for re-throw in poll method
          }
        }
        .flatMap { resp ->

          // fetch all receipts

          val blockStruct = resp.block.toStruct(blockValueSchema)
          blockStruct.put("transactions", emptyList<Struct>())

          Flowable.merge(
            resp.block.transactions
              .map { it.get() as Transaction }
              .map { tx ->
                web3
                  .ethGetTransactionReceipt(tx.hash)
                  .flowable()
                  .map { Pair(tx, it.result) }
              }
          )
            .map { (tx, receipt) -> Pair(tx, receipt) }
            .reduce(blockStruct) { memo, (tx, receipt) ->

              var txs: List<Struct> = memo.getArray<Struct>("transactions")
              txs += tx.toStruct(blockValueSchema.field("transactions").schema().valueSchema(), receipt)
              memo.put("transactions", txs)
            }
            .toFlowable()
            .map { Pair(resp.block, it) }
        }.subscribe { (block, blockStruct) ->

          val key = Struct(blockKeySchema)
            .put("number", blockStruct.get("number"))

          val source = mapOf("url" to wsUrl)
          val offset = mapOf("number" to block.number.toLong())

          val record = SourceRecord(source, offset, blocksTopic, blockKeySchema, key, blockValueSchema, blockStruct)

          queue.put(record)
        }
    } catch (e: ConnectException) {
      logger.warn { "Failed to connect, scheduling re-connect in 30 seconds" }
      Thread.sleep(30000)
      connect()
    }
  }

  override fun stop() {
    web3?.shutdown()
  }

  override fun poll(): MutableList<SourceRecord> {

    logger.info { "polling" }

    val startMs = System.currentTimeMillis()

    // either wait up until the pollTimeoutMs or until the queue is full, whichever happens first
    while ((System.currentTimeMillis() - startMs) < pollTimeoutMs && queue.size < queueSize) {
      Thread.sleep(queueCheckIntervalMs)
    }

    if (error != null) throw error!! // re-throw error captured in web3 processing

    val records = mutableListOf<SourceRecord>()
    queue.drainTo(records)

    logger.info { "Returning ${records.size} records" }

    return records
  }
}
