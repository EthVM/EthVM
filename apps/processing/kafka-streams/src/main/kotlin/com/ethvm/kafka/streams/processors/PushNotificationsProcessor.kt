package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TransactionListRecord
import com.ethvm.avro.capture.TransactionReceiptListRecord
import com.ethvm.avro.capture.TransactionRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.FungibleBalanceDeltaRecord
import com.ethvm.avro.processing.FungibleBalanceKeyRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaListRecord
import com.ethvm.avro.processing.NonFungibleBalanceDeltaRecord
import com.ethvm.avro.processing.NonFungibleBalanceKeyRecord
import com.ethvm.avro.processing.SystemMetadataKeyRecord
import com.ethvm.avro.processing.SystemMetadataRecord
import com.ethvm.avro.processing.TransactionKeyRecord
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics.CanonicalReceipts
import com.ethvm.kafka.streams.config.Topics.CanonicalTransactions
import com.ethvm.kafka.streams.config.Topics.FungibleBalanceDelta
import com.ethvm.kafka.streams.config.Topics.NonFungibleBalanceDelta
import com.ethvm.kafka.streams.config.Topics.SystemMetadata
import com.ethvm.kafka.streams.config.Topics.Transaction
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.GlobalKTable
import org.apache.kafka.streams.kstream.Grouped
import org.apache.kafka.streams.kstream.KeyValueMapper
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Suppressed
import org.apache.kafka.streams.kstream.Suppressed.BufferConfig.unbounded
import org.apache.kafka.streams.kstream.TimeWindows
import org.apache.kafka.streams.kstream.ValueJoiner
import java.time.Duration
import java.util.Properties

class PushNotificationsProcessor : AbstractKafkaProcessor() {

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
    receiptNotifications(builder, metadataTable)

    fungibleBalanceDeltaNotifications(builder, metadataTable)
    nonFungibleBalanceDeltaNotifications(builder, metadataTable)

    return builder.build()
  }

  private fun transactionNotifications(builder: StreamsBuilder, metadataTable: GlobalKTable<SystemMetadataKeyRecord, SystemMetadataRecord>) {

    val transactionStream = CanonicalTransactions.stream(builder)
      .leftJoin(
        metadataTable,
        // hardcoded lookup key in the metadata global table
        KeyValueMapper<CanonicalKeyRecord, TransactionListRecord, SystemMetadataKeyRecord> { _, _ ->
          syncStatusKey
        },
        ValueJoiner<TransactionListRecord, SystemMetadataRecord?, TransactionListRecord?> { tx, metadata ->
          when (metadata?.value) {
            "false" -> tx
            else -> null
          }
        }
      )

    transactionStream
      .filterNot { _, v -> v == null }
      .foreach{ _, txList ->
        logger.info { "Sending transaction batch of size ${txList!!.transactions.size}"}
        // TODO integrated with push notification system
      }

  }

  private fun receiptNotifications(builder: StreamsBuilder, metadataTable: GlobalKTable<SystemMetadataKeyRecord, SystemMetadataRecord>) {

    val transactionStream = CanonicalReceipts.stream(builder)
      .leftJoin(
        metadataTable,
        // hardcoded lookup key in the metadata global table
        KeyValueMapper<CanonicalKeyRecord, TransactionReceiptListRecord, SystemMetadataKeyRecord> { _, _ ->
          syncStatusKey
        },
        ValueJoiner<TransactionReceiptListRecord, SystemMetadataRecord?, TransactionReceiptListRecord?> { tx, metadata ->
          when (metadata?.value) {
            "false" -> tx
            else -> null
          }
        }
      )

    transactionStream
      .filterNot { _, v -> v == null }
      .foreach{ _, receiptList ->
        logger.info { "Sending receipt batch of size ${receiptList!!.receipts.size}"}
        // TODO integrated with push notification system
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
        ValueJoiner<FungibleBalanceDeltaRecord, SystemMetadataRecord?, FungibleBalanceDeltaRecord?> { delta, metadata ->
          when (metadata?.value) {
            "false" -> delta
            else -> null
          }
        }
      )

    fungibleBalanceDeltaStream
      .filterNot { _, v -> v == null }
      .groupBy(
        { _, v -> v!!.traceLocation.blockHash },
        Grouped.with(KafkaSerdes.String(), Serdes.FungibleBalanceDelta())
      )
      // batch up every 5 seconds or so
      .windowedBy(TimeWindows.of(Duration.ofSeconds(5)).grace(Duration.ZERO))
      .aggregate(
        {
          FungibleBalanceDeltaListRecord.newBuilder()
            .build()
        },
        { _, next, agg ->
          FungibleBalanceDeltaListRecord.newBuilder()
            .setDeltas(agg.deltas + next)
            .build()
        },
        Materialized.with(KafkaSerdes.String(), Serdes.FungibleBalanceDeltaList())
      )
      .suppress(Suppressed.untilWindowCloses(unbounded()))
      .toStream()
      .foreach{ windowedKey, deltaList ->
        logger.info { "Sending fungible balance deltas, block hash = ${windowedKey.key()}, size = ${deltaList.deltas.size}"}
        // TODO integrated with push notification system
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
        ValueJoiner<NonFungibleBalanceDeltaRecord, SystemMetadataRecord?, NonFungibleBalanceDeltaRecord?> { delta, metadata ->
          when (metadata?.value) {
            "false" -> delta
            else -> null
          }
        }
      )

    nonFungibleBalanceDeltaStream
      .filterNot { _, v -> v == null }
      .groupBy(
        { _, v -> v!!.traceLocation.blockHash },
        Grouped.with(KafkaSerdes.String(), Serdes.NonFungibleBalanceDelta())
      )
      // batch up every 5 seconds or so
      .windowedBy(TimeWindows.of(Duration.ofSeconds(5)).grace(Duration.ZERO))
      .aggregate(
        {
          NonFungibleBalanceDeltaListRecord.newBuilder()
            .build()
        },
        { _, next, agg ->
          NonFungibleBalanceDeltaListRecord.newBuilder()
            .setDeltas(agg.deltas + next)
            .build()
        },
        Materialized.with(KafkaSerdes.String(), Serdes.NonFungibleBalanceDeltaList())
      )
      .suppress(Suppressed.untilWindowCloses(unbounded()))
      .toStream()
      .foreach{ windowedKey, deltaList ->
        logger.info { "Sending non fungible balance deltas, block hash = ${windowedKey.key()}, size = ${deltaList.deltas.size}"}
        // TODO integrated with push notification system
      }
  }

}
