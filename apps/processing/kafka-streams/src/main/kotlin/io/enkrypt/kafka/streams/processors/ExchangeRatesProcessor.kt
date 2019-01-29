package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.exchange.SymbolKeyRecord
import io.enkrypt.common.extensions.isValid
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Materialized
import java.util.Properties

class ExchangeRatesProcessor : AbstractKafkaProcessor() {

  override val id: String = "exchange-rates-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)

      put("schema.registry.url", appConfig.kafka.schemaRegistryUrl)
      put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.SymbolKey().javaClass)
      put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.ExchangeRate().javaClass)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    // Listen to raw contract-metadata and convert the key to use symbol
    builder
      .stream(
        "contract-metadata",
        Consumed.with(Serdes.ContractKey(), Serdes.ContractMetadata())
      )
      .selectKey { _, v -> SymbolKeyRecord(v.getSymbol().toLowerCase()) }
      .to("eth-lists-metadata")

    val ethListsMetadataStream = builder
      .table(
        "eth-lists-metadata",
        Consumed.with(Serdes.SymbolKey(), Serdes.ContractMetadata())
      )

    // Listen to raw exchange rates topic and match those with symbol
    builder
      .table<SymbolKeyRecord, ExchangeRateRecord>(
        "raw-exchange-rates",
        Consumed.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )
      .filter { _, v -> v.isValid() }
      .join(
        ethListsMetadataStream,
        { v1, _ -> v1 },
        Materialized.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )
      .toStream()
      .to(Topics.ExchangeRates)

    // Generate the topology
    return builder.build()
  }

}
