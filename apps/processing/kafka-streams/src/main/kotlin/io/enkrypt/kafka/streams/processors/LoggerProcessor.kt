package io.enkrypt.kafka.streams.processors

import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.config.Topics.EtherBalanceDeltas
import io.enkrypt.kafka.streams.config.Topics.EtherBalances
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class LoggerProcessor : AbstractKafkaProcessor() {

  override val id: String = "logger-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
      put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000L)
      put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 2000000000)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    val builder = StreamsBuilder().apply {}

    val addresses = setOf<String>(
//      "0x94628dc2fcf8c450562b75c59ede742586a5c179",
    "0xd490af05bf82ef6c6ba034b22d18c39b5d52cc54"
    )

    val txs = setOf<String>(
    )

//    EtherBalanceDeltas.stream(builder)
//      .filter { k, _ -> addresses.contains(k.getAddress()) }
//      .peek{ k, v -> logger.info { "Key: ${k.getAddress()}, delta: $v"} }

//    TransactionEtherBalanceDeltas.stream(builder)
//      .filter { k, _ -> txs.contains(k.getTxHash()) }
//      .peek{ k, v -> logger.info { "Tx: ${k.getTxHash()}, delta: $v"} }

//    CanonicalTransactionsConcurrent.stream(builder)
//      .filter { k, _ -> txs.contains(k.getTxHash()) }
//      .peek{ k, v -> logger.info { "Tx: ${k.getTxHash()}, canonical: $v"} }

//    TransactionFees.stream(builder)
//      .filter { k, _ -> txs.contains(k.getTxHash()) }
//      .peek{ k, v -> logger.info { "Key: ${k.getTxHash()}, fee: $v"} }

//    EtherBalances.stream(builder)
//      .filter { k, _ -> addresses.contains(k.getAddress()) }
//      .peek{ k, v -> logger.info { "Key: ${k.getAddress()}, balance: $v, balance: ${v.getAmount().toBigInteger().toString(16)}"} }

    // Generate the topology
    return builder.build()
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
