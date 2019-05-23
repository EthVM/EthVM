package com.ethvm.kafka.connect.sources.web3

import com.ethvm.kafka.connect.sources.web3.ext.JsonRpc2_0ParityExtended
import com.ethvm.kafka.connect.sources.web3.sources.AbstractParityEntitySource
import com.ethvm.kafka.connect.sources.web3.sources.ParityBlockHeadersAndTxsSource
import com.ethvm.kafka.connect.sources.web3.sources.ParityReceiptsSource
import com.ethvm.kafka.connect.sources.web3.sources.ParityTracesSource
import com.ethvm.kafka.connect.sources.web3.sources.ParityUnclesSource
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
  private lateinit var startBlockNumber: BigInteger
  private lateinit var entitiesList: List<String>

  private var connectDelayMs: Long = -1

  @Volatile
  private var parity: JsonRpc2_0ParityExtended? = null

  private var entitySources = emptyList<AbstractParityEntitySource>()

  override fun version(): String = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    startBlockNumber = ParitySourceConnector.Config.startBlockNumber(props)
    entitiesList = ParitySourceConnector.Config.entitiesList(props)
    wsUrl = ParitySourceConnector.Config.wsUrl(props)

    logger.info { "Starting ParitySourceTask - Start Block #: $startBlockNumber / Entities: $entitiesList / WS Url: $wsUrl" }
  }

  override fun stop() {
    logger.debug { "Stopping ParitySourceTask" }

    entitySources.forEach { it.stop() }

    parity?.shutdown()
    parity = null

    logger.debug { "Stopped ParitySourceTask" }
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

      logger.error(ex) { "ParitySourceTask - Exception detected" }

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

  private fun ensureConnection() {

    try {

      if (parity != null) {
        return
      }

      // stop any previous sources

      entitySources.forEach { it.stop() }

      // reconnect backoff if necessary

      if (connectDelayMs != -1L) {
        logger.debug { "Waiting $connectDelayMs ms before connecting again!" }
        Thread.sleep(connectDelayMs)
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
          "headers_and_txs" -> ParityBlockHeadersAndTxsSource(context, parity!!, "canonical_block_header", "canonical_transactions", "parity_sync_state")
          "uncles" -> ParityUnclesSource(context, parity!!, "canonical_uncles",  "parity_sync_state")
          "receipts" -> ParityReceiptsSource(context, parity!!, "canonical_receipts", "parity_sync_state")
          "traces" -> ParityTracesSource(context, parity!!, "canonical_traces", "parity_sync_state")
          else -> throw IllegalArgumentException("Unexpected entity: $it")
        }
      }

      // reset reconnect logic
      connectDelayMs = -1
    } catch (ex: Exception) {

      when (ex) {
        is IOException -> throwRetriable(ex)
        is ConnectException -> throw RetriableException(ex)
        else -> throw ex
      }
    }
  }

  private fun throwRetriable(ex: Exception): RetriableException {
    val delay =
      when {
        connectDelayMs == -1L -> 1000
        connectDelayMs >= 30000 -> 30000
        else -> connectDelayMs * 2
      }

    this.connectDelayMs = delay

    throw RetriableException(ex)
  }
}
