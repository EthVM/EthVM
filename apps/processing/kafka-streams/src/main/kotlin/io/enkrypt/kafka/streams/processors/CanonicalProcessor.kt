package io.enkrypt.kafka.streams.processors

import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.nio.ByteBuffer
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class CanonicalProcessor : AbstractKafkaProcessor() {

  private val emptyByteBuffer = ByteBuffer.allocate(0)

  override val id: String = "canonical-processor"

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

    val builder = StreamsBuilder().apply {
      addStateStore(CanonicalTxTransformer.canonicalRecordsStore(appConfig.unitTesting))
    }

    val canonicalTxs = builder
      .stream("canonical-chain", Consumed.with(Serdes.CanonicalKey(), Serdes.Canonical()))
      .transform(
        TransformerSupplier{ CanonicalTxTransformer(appConfig.unitTesting)},
        *CanonicalTxTransformer.STORE_NAMES
      )

    canonicalTxs.to("canonical-transactions", Produced.with(Serdes.TransactionKey(), Serdes.CanonicalApply()))
    canonicalTxs.to("canonical-transactions-concurrent", Produced.with(Serdes.TransactionKey(), Serdes.CanonicalApply()))


    // Generate the topology
    return builder.build()
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
