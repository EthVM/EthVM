package io.enkrypt.bolt.processors

import io.enkrypt.bolt.serdes.RLPTransactionReceiptSerde
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.ethereum.core.TransactionReceipt
import org.ethereum.util.ByteUtil
import java.util.Properties

class PendingTransactionsProcessor : AbstractBaseProcessor() {

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, "pending-transactions-processor")
    }

  private val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {
    // Create Serde
    val serde = RLPTransactionReceiptSerde()

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream(appConfig.topicsConfig.pendingTransactions, Consumed.with(Serdes.ByteArray(), serde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .foreach(::persist)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun persist(hash: String, receipt: TransactionReceipt) {}

  override fun start() {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start()
  }

}
