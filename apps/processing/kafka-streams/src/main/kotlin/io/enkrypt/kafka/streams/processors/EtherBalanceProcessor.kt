package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.EtherBalanceKeyRecord
import io.enkrypt.kafka.streams.config.Topics.CanonicalEtherBalances
import io.enkrypt.kafka.streams.config.Topics.EtherBalances
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import java.util.Properties

class EtherBalanceProcessor : AbstractKafkaProcessor() {

  override val id: String = "ether-balance-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    val balances = CanonicalEtherBalances.stream(builder)
      .map { k, v ->
        KeyValue(
          EtherBalanceKeyRecord.newBuilder()
            .setAddress(k.getAddress())
            .build(),
          v
        )
      }

    EtherBalances.sinkFor(balances)

    return builder.build()
  }
}
