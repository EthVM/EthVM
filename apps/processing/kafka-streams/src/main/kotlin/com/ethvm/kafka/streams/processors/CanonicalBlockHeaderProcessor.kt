package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.BlockAuthorRecord
import com.ethvm.avro.processing.BlockMetricKeyRecord
import com.ethvm.avro.processing.BlockMetricsHeaderRecord
import com.ethvm.avro.processing.BlockTimeRecord
import com.ethvm.avro.processing.CanonicalCountKeyRecord
import com.ethvm.avro.processing.CanonicalCountRecord
import com.ethvm.kafka.streams.config.Topics
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockAuthor
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockHeader
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockTime
import com.ethvm.kafka.streams.transformers.BlockTimeTransformer
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.TransformerSupplier
import org.joda.time.DateTime
import java.util.Properties

class CanonicalBlockHeaderProcessor : AbstractKafkaProcessor() {

  override val id: String = "canonical-block-header-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder().apply {
      addStateStore(BlockTimeTransformer.blockHeaderStore(appConfig.unitTesting))
    }

    val blockHeader = CanonicalBlockHeader.stream(builder)

    blockHeader
      // calculate block time first
      .transform(TransformerSupplier { BlockTimeTransformer(appConfig.unitTesting) }, *BlockTimeTransformer.STORE_NAMES)
      .mapValues { _, v ->
        BlockTimeRecord.newBuilder()
          .setBlockHash(v.hash)
          .setTimestamp(v.timestamp)
          .setBlockTime(v.blockTime)
          .build()
      }
      .toTopic(CanonicalBlockTime)

    // Canonical Block Author

    blockHeader
      .mapValues { v ->
        BlockAuthorRecord.newBuilder()
          .setAuthor(v.getAuthor())
          .setBlockNumber(v.getNumber())
          .setBlockHash(v.getHash())
          .setTimestamp(DateTime(v.getTimestamp()))
          .build()
      }.toTopic(CanonicalBlockAuthor)

    // Block Metrics Header

    blockHeader.map { _, header ->
      KeyValue(
        BlockMetricKeyRecord.newBuilder()
          .setBlockHash(header.getHash())
          .setTimestamp(DateTime(header.getTimestamp()))
          .build(),
        BlockMetricsHeaderRecord.newBuilder()
          .setNumber(header.getNumber())
          .setBlockTime(header.getBlockTime())
          .setNumUncles(header.getUncleHashes().size)
          .setDifficulty(header.getDifficulty())
          .setTotalDifficulty(header.getTotalDifficulty())
          .setTimestamp(DateTime(header.getTimestamp()))
          .build()
      )
    }.toTopic(Topics.BlockMetricsHeader)

    // Block Header Count Deltas

    blockHeader
      .map { k, _ ->
        KeyValue(
          CanonicalCountKeyRecord.newBuilder()
            .setEntity("block_header")
            .setNumber(k.number)
            .build(),
          CanonicalCountRecord.newBuilder()
            .setCount(1)
            .build()
        )
      }.toTopic(Topics.CanonicalCountDelta)

    return builder.build()
  }
}
