package io.enkrypt.kafka.streams.processors

import io.enkrypt.common.extensions.isValid
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import java.util.Properties

class ExchangeRatesProcessor : AbstractKafkaProcessor() {

  override val id: String = "exchange-rates-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
      put("schema.registry.url", appConfig.kafka.schemaRegistryUrl)
      put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.ExchangeRateKey().javaClass)
      put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ExchangeRate().javaClass)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    // Listen to raw coingecko-exchange-rates topic
    builder
      .stream(
        Topics.CoinGeckoExchangeRates,
        Consumed.with(Serdes.ExchangeRateKey(), Serdes.ExchangeRate())
      )
      .filter { _, v -> v.isValid() }
      .peek { _, v -> logger.info { "Processing ExchangeRate = ${v.getId()}" } }
      .to(Topics.ExchangeRates)

    // Generate the topology
    return builder.build()
  }

}
