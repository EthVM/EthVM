package io.enkrypt.kafka.connect.sources.web3

import io.enkrypt.kafka.connect.sources.web3.sources.ParityBlockAndTxSource
import io.enkrypt.kafka.connect.sources.web3.sources.ParityEntitySource
import io.enkrypt.kafka.connect.sources.web3.sources.ParityReceiptSource
import io.enkrypt.kafka.connect.sources.web3.sources.ParityTracesSource
import io.enkrypt.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import org.web3j.protocol.websocket.WebSocketService
import java.io.IOException
import java.math.BigInteger
import java.net.ConnectException
import java.util.concurrent.ExecutionException

class ParitySourceTask : SourceTask() {

  private val logger = KotlinLogging.logger {}

  private lateinit var wsUrl: String
  private lateinit var blocksTopic: String
  private lateinit var startBlockNumber: BigInteger
  private lateinit var entitiesList: List<String>

  private var connectDelayMs: Long? = null

  @Volatile
  private var parity: JsonRpc2_0ParityExtended? = null

  private var entitySources = emptyList<ParityEntitySource>()

  override fun version(): String = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    blocksTopic = ParitySourceConnector.Config.blocksTopic(props)
    startBlockNumber = ParitySourceConnector.Config.startBlockNumber(props)
    entitiesList = ParitySourceConnector.Config.entitiesList(props)

    logger.info { "Start block number: $startBlockNumber" }

    wsUrl = ParitySourceConnector.Config.wsUrl(props)
  }

  private fun ensureConnection() {

    try {

      if (parity != null) return

      // stop any previous sources
      entitySources.forEach { it.stop() }

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

      // create sources

      logger.info { "Entities list: $entitiesList" }

      entitySources = entitiesList.map {
        when (it) {
          "blocksAndTransactions" -> ParityBlockAndTxSource(this.context, parity!!, "canonical-blocks", "canonical-transactions")
          "receipts" -> ParityReceiptSource(this.context, parity!!, "canonical-receipts")
          "traces" -> ParityTracesSource(this.context, parity!!, "canonical-traces")
          else -> throw IllegalArgumentException("Unexpected entity: $it")
        }
      }

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

  private fun throwRetriable(ex: Exception): RetriableException {
    var connectDelayMs = (this.connectDelayMs ?: 1000) * 2

    if (connectDelayMs > 30000) {
      connectDelayMs = 30000
    }

    this.connectDelayMs = connectDelayMs

    throw RetriableException(ex)
  }

  override fun stop() {
    logger.debug { "Stopping" }

    entitySources.forEach { it.stop() }

    parity?.shutdown()
    parity = null

    logger.debug { "Stopped" }
  }

  override fun poll(): MutableList<SourceRecord> {

    try {

      logger.debug { "Polling" }

      // ensure we are connected or re-connect if necessary
      ensureConnection()

      val sourceRecords = entitySources
        .map { source -> source.poll() }
        .flatten()

      logger.debug { "Polled ${sourceRecords.size} records" }

      if (sourceRecords.isEmpty()) {
        // sleep 1 second to avoid spinning
        Thread.sleep(1000)
      }

      return sourceRecords.toMutableList()
    } catch (ex: Exception) {

      logger.error(ex) { "Exception detected" }

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
