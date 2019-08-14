package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.NonFungibleBalanceKeyRecord
import com.ethvm.avro.processing.SystemMetadataKeyRecord
import com.ethvm.avro.processing.SystemMetadataRecord
import com.ethvm.avro.processing.TransactionKeyRecord
import com.ethvm.kafka.streams.config.Topics.FungibleBalanceDelta
import com.ethvm.kafka.streams.config.Topics.NonFungibleBalanceDelta
import com.ethvm.kafka.streams.config.Topics.SystemMetadata
import com.ethvm.kafka.streams.config.Topics.Transaction
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.GlobalKTable
import org.apache.kafka.streams.kstream.KeyValueMapper
import org.apache.kafka.streams.kstream.ValueJoiner
import java.util.Properties

class PinpointNotifications : AbstractKafkaProcessor() {

  override val id = "pinpoint-notifications-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  private val syncStatusKey = SystemMetadataKeyRecord
    .newBuilder()
    .setKey("sync_status")
    .build()

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder()

    val metadataTable = SystemMetadata.globalTable(builder)

    transactionNotifications(builder, metadataTable)
    fungibleBalanceDeltaNotifications(builder, metadataTable)
    nonFungibleBalanceDeltaNotifications(builder, metadataTable)

    return builder.build()
  }

  private fun transactionNotifications(builder: StreamsBuilder, metadataTable: GlobalKTable<SystemMetadataKeyRecord, SystemMetadataRecord>) {

    val transactionStream = Transaction.stream(builder)
      .leftJoin(
        metadataTable,
        // hardcoded lookup key in the metadata global table
        KeyValueMapper<TransactionKeyRecord, TransactionRecord, SystemMetadataKeyRecord> { _, _ ->
          syncStatusKey
        },
        ValueJoiner<TransactionRecord, SystemMetadataRecord, TransactionRecord?> { tx, metadata ->
          when (metadata.value) {
            "false" -> tx
            else -> null
          }
        }
      )

    transactionStream
      .filterNot { _, v -> v == null }
      .foreach { k, v ->
        // TODO push to Pinpoint
      }

  }

  private fun fungibleBalanceDeltaNotifications(builder: StreamsBuilder, metadataTable: GlobalKTable<SystemMetadataKeyRecord, SystemMetadataRecord>) {

    val fungibleBalanceDeltaStream = FungibleBalanceDelta.stream(builder)
      .leftJoin(
        metadataTable,
        // hardcoded lookup key in the metadata global table
        KeyValueMapper<FungibleBalanceKeyRecord, FungibleBalanceDeltaRecord, SystemMetadataKeyRecord> { _, _ ->
          syncStatusKey
        },
        ValueJoiner<FungibleBalanceDeltaRecord, SystemMetadataRecord, FungibleBalanceDeltaRecord?> { delta, metadata ->
          when (metadata.value) {
            "false" -> delta
            else -> null
          }
        }
      )

    fungibleBalanceDeltaStream
      .filterNot { _, v -> v == null }
      .foreach { k, v ->
        // TODO push to Pinpoint
      }

  }

  private fun nonFungibleBalanceDeltaNotifications(builder: StreamsBuilder, metadataTable: GlobalKTable<SystemMetadataKeyRecord, SystemMetadataRecord>) {

    val nonFungibleBalanceDeltaStream = NonFungibleBalanceDelta.stream(builder)
      .leftJoin(
        metadataTable,
        // hardcoded lookup key in the metadata global table
        KeyValueMapper<NonFungibleBalanceKeyRecord, NonFungibleBalanceDeltaRecord, SystemMetadataKeyRecord> { _, _ ->
          syncStatusKey
        },
        ValueJoiner<NonFungibleBalanceDeltaRecord, SystemMetadataRecord, NonFungibleBalanceDeltaRecord?> { delta, metadata ->
          when (metadata.value) {
            "false" -> delta
            else -> null
          }
        }
      )

    nonFungibleBalanceDeltaStream
      .filterNot { _, v -> v == null }
      .foreach { k, v ->
        // TODO push to Pinpoint
      }
  }

}
