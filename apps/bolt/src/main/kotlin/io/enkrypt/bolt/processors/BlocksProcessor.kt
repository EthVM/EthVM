package io.enkrypt.bolt.processors

import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.serdes.RLPBlockSummarySerde
import io.enkrypt.bolt.kafka.BlockMongoTransformer
import io.enkrypt.bolt.kafka.BlockSummaryTimestampExtractor
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.ethereum.core.BlockSummary
import org.ethereum.util.ByteUtil
import org.koin.standalone.get
import java.util.*

/**
 * This processor process Blocks and Txs at the same time. It calculates also block stats.
 */
class BlocksProcessor : AbstractBaseProcessor() {

  override val id: String = "blocks-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // RLP Serde
    val blockSerde = RLPBlockSummarySerde()

    // Create stream builder
    val builder = StreamsBuilder()

    val (blocks) = appConfig.topicsConfig

    builder
      .stream(blocks, Consumed.with(Serdes.ByteArray(), blockSerde)
        .withTimestampExtractor(BlockSummaryTimestampExtractor())
      )
      .map { k, v -> KeyValue(ByteUtil.byteArrayToLong(k), v) }
      .transform<Long, BlockSummary>({ get<BlockMongoTransformer>() }, null)    // persist to db
      .mapValues { v -> v.block.hash.toHex() }
      .to(appConfig.topicsConfig.processedBlocks, Produced.with(Serdes.Long(), Serdes.String()))

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }
}




