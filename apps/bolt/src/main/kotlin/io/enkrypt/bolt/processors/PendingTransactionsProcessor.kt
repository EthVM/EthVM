package io.enkrypt.bolt.processors

import io.enkrypt.bolt.kafka.processors.PendingTransactionMongoProcessor
import io.enkrypt.bolt.kafka.serdes.RLPTransactionSerde
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.ethereum.util.ByteUtil
import org.koin.standalone.get
import java.util.Properties

/**
 * This processor process Pending Txs in the node.
 */
class PendingTransactionsProcessor : AbstractBaseProcessor() {

  override val id: String = "pending-transactions-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // Create Serde
    val serde = RLPTransactionSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.pendingTransactions, Consumed.with(Serdes.ByteArray(), serde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .process({ get<PendingTransactionMongoProcessor>() }, null)

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
