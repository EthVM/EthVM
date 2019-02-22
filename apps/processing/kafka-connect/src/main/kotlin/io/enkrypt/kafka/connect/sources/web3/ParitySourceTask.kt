package io.enkrypt.kafka.connect.sources.web3

import io.confluent.connect.avro.AvroData
import io.confluent.connect.avro.AvroDataConfig
import io.confluent.connect.avro.AvroDataConfig.ENHANCED_AVRO_SCHEMA_SUPPORT_CONFIG
import io.confluent.kafka.schemaregistry.client.CachedSchemaRegistryClient
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.connect.extensions.JsonRpc2_0ParityExtended
import io.enkrypt.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import org.web3j.protocol.websocket.WebSocketService
import java.math.BigInteger
import java.nio.ByteBuffer
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger

// @Alpha - Not ready for prime time
class ParitySourceTask : SourceTask() {

  private val logger = KotlinLogging.logger {}

  private lateinit var wsUrl: String
  private lateinit var blocksTopic: String

  private lateinit var avroData: AvroData

  private lateinit var blockKeyConnectSchema: Schema
  private lateinit var blockValueConnectSchema: Schema

  private lateinit var syncManager: ParitySyncManager

  @Volatile
  private var web3: JsonRpc2_0ParityExtended? = null

  override fun version(): String = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    blocksTopic = ParitySourceConnector.Config.blocksTopic(props)

    avroData = AvroData(
      AvroDataConfig(
        mapOf(
          ENHANCED_AVRO_SCHEMA_SUPPORT_CONFIG to true
        )
      )
    )

    blockKeyConnectSchema = avroData.toConnectSchema(BlockKeyRecord.`SCHEMA$`)
    blockValueConnectSchema = avroData.toConnectSchema(BlockRecord.`SCHEMA$`)

    wsUrl = ParitySourceConnector.Config.wsUrl(props)

    connect()
  }

  private fun connect() {

    logger.debug { "Connecting to $wsUrl" }

    val wsService = WebSocketService(wsUrl, false)
    wsService.connect()

    this.web3 = JsonRpc2_0ParityExtended(wsService)

    val blockNumber = recoverBlockNumber()
    logger.debug { "Recovered block number: $blockNumber" }
    syncManager = ParitySyncManager(web3!!, blockNumber)
  }

  private fun recoverBlockNumber(): BigInteger {

    val sourcePartition = context
      .offsetStorageReader()
      .offset(mapOf("wsUrl" to wsUrl))

    logger.info { "Source partition: $sourcePartition"}

    if(sourcePartition == null) return BigInteger.ZERO

    val number = sourcePartition["number"]

    return when(number) {
      null -> BigInteger.ZERO
      is Long -> number.toBigInteger()
      else -> throw IllegalStateException("Unexpected value returned: $number")
    }

  }

  override fun stop() {
    logger.debug { "Stopping" }

    syncManager.stop()
    web3?.shutdown()

    logger.debug{ "Stopped" }
  }

  override fun poll(): MutableList<SourceRecord> {

    context

    logger.debug { "Polling" }

    val blockRecords = syncManager.poll(10, TimeUnit.SECONDS)

    val sourceRecords = blockRecords
      .map { it.build() }
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

    logger.debug { "Polled ${blockRecords.size} block records" }

    return sourceRecords.toMutableList()
  }
}
