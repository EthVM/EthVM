package io.enkrypt.kafka.connect.sources.web3

import io.confluent.connect.avro.AvroData
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import org.web3j.protocol.websocket.WebSocketService
import java.io.IOException
import java.math.BigInteger
import java.net.ConnectException
import java.util.concurrent.ExecutionException
import java.util.concurrent.TimeUnit

class ParitySourceTask : SourceTask() {

  private val logger = KotlinLogging.logger {}

  private lateinit var wsUrl: String
  private lateinit var blocksTopic: String
  private lateinit var startBlockNumber: BigInteger

  private lateinit var avroData: AvroData

  private lateinit var blockKeyConnectSchema: Schema
  private lateinit var blockValueConnectSchema: Schema

  private var connectDelayMs: Long? = null

  @Volatile
  private var parity: JsonRpc2_0ParityExtended? = null

  @Volatile
  private var blockSyncManager: ParityBlockSyncManager? = null

  private lateinit var blockNumberOffset: BigInteger

  override fun version(): String = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    blocksTopic = ParitySourceConnector.Config.blocksTopic(props)
    startBlockNumber = ParitySourceConnector.Config.startBlockNumber(props)

    avroData = AvroData(10)

    blockKeyConnectSchema = avroData.toConnectSchema(BlockKeyRecord.`SCHEMA$`)
    blockValueConnectSchema = avroData.toConnectSchema(BlockRecord.`SCHEMA$`)

    logger.info { "Start block number: $startBlockNumber" }

    wsUrl = ParitySourceConnector.Config.wsUrl(props)
  }

  private fun ensureConnection() {

    try {

      if (parity != null) return

      // stop any previous syncing
      blockSyncManager?.stop()

      // reconnect backoff if necessary

      if (connectDelayMs != null) {
        logger.debug { "Waiting $connectDelayMs ms before connecting" }
        Thread.sleep(connectDelayMs!!)
      }

      // connect

      logger.debug { "Connecting to $wsUrl" }

      val wsService = WebSocketService(wsUrl, false)
      wsService.connect()

      parity = JsonRpc2_0ParityExtended(wsService)

      val blockNumberOffset = blockNumberOffset()
      this.blockNumberOffset = blockNumberOffset

      blockSyncManager = ParityBlockSyncManager(parity!!, blockNumberOffset)

      // reset reconnect logic
      connectDelayMs = null
    } catch (ex: Exception) {

      when (ex) {
        is IOException -> throwRetriable(ex)
        is ConnectException -> throw RetriableException(ex)
        else -> throw ex
      }
    }
  }

  private fun throwRetriable(ex: Exception) {
    var connectDelayMs = (this.connectDelayMs ?: 1000) * 2

    if (connectDelayMs > 30000) {
      connectDelayMs = 30000
    }

    this.connectDelayMs = connectDelayMs

    throw RetriableException(ex)
  }

  private fun blockNumberOffset(): BigInteger {

    val sourcePartition = context
      .offsetStorageReader()
      .offset(mapOf("wsUrl" to wsUrl)) ?: return startBlockNumber

    val number = sourcePartition["number"]

    return when (number) {
      null -> startBlockNumber
      is Long -> {

        // we deduct some blocks in case a fork happened whilst the connector was offline

        val numberMinusForkProtection = number - 1024
        if (numberMinusForkProtection < 0) BigInteger.ZERO else number.toBigInteger()
      }
      else -> throw IllegalStateException("Unexpected value returned: $number")
    }
  }

  override fun stop() {
    logger.debug { "Stopping" }

    blockSyncManager?.stop()

    parity?.shutdown()
    parity = null

    logger.debug { "Stopped" }
  }

  override fun poll(): MutableList<SourceRecord> {

    try {

      logger.debug { "Polling" }

      // ensure we are connected or re-connect if necessary
      ensureConnection()

      val blockRecords = blockSyncManager!!.poll(5, TimeUnit.SECONDS)

      val sourceRecords = blockRecords
        .map { record ->

          val key = avroData.toConnectData(
            BlockKeyRecord.`SCHEMA$`,
            BlockKeyRecord.newBuilder()
              .setNumber(record.getHeader().getNumber())
              .build()
          ).value()

          val source = mapOf("wsUrl" to wsUrl)
          val offset = mapOf("number" to record.getHeader().getNumber().unsignedBigInteger()!!.longValueExact())

          val value = avroData.toConnectData(BlockRecord.`SCHEMA$`, record).value()

          SourceRecord(source, offset, blocksTopic, blockKeyConnectSchema, key, blockValueConnectSchema, value)
        }

      logger.debug { "Polled ${sourceRecords.size} records" }

      return sourceRecords.toMutableList()
    } catch (ex: Exception) {

      blockSyncManager?.stop()
      parity?.shutdown()
      parity = null

      return when (ex) {

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
}
