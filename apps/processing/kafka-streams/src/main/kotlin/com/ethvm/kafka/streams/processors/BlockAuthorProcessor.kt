package com.ethvm.kafka.streams.processors

import com.ethvm.avro.processing.BlockAuthorRecord
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockAuthor
import com.ethvm.kafka.streams.config.Topics.CanonicalBlockHeader
import com.ethvm.kafka.streams.utils.toTopic
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.joda.time.DateTime
import java.util.Properties

class BlockAuthorProcessor : AbstractKafkaProcessor() {

  override val id: String = "block-author-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 2)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    CanonicalBlockHeader.stream(builder)
      .mapValues { v ->
        when (v) {
          null -> null
          else -> BlockAuthorRecord.newBuilder()
            .setAuthor(v.getAuthor())
            .setBlockNumber(v.getNumber())
            .setBlockHash(v.getHash())
            .setTimestamp(DateTime(v.getTimestamp()))
            .build()
        }
      }.toTopic(CanonicalBlockAuthor)

    return builder.build()
  }
}
