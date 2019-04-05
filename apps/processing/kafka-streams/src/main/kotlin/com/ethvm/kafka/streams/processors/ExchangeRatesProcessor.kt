package com.ethvm.kafka.streams.processors

import com.ethvm.avro.capture.ContractMetadataRecord
import com.ethvm.avro.exchange.ExchangeRateRecord
import com.ethvm.avro.exchange.SymbolKeyRecord
import com.ethvm.common.extensions.hexBuffer
import com.ethvm.common.extensions.isValid
import com.ethvm.kafka.streams.Serdes
import com.ethvm.kafka.streams.config.Topics
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import java.util.Properties

class ExchangeRatesProcessor : AbstractKafkaProcessor() {

  override val id: String = "exchange-rates-processor"

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

    // Listen to raw contract-metadata and convert the key to use symbol
    val ethTokensStream = builder
      .table<SymbolKeyRecord, ContractMetadataRecord>(
        Topics.EthTokensListBySymbol,
        Consumed.with(Serdes.SymbolKey(), Serdes.ContractMetadata())
      )

    // Listen to raw exchange rates topic and match those with symbol and write to tokens-exchange-rate
    builder
      .table<SymbolKeyRecord, ExchangeRateRecord>(
        Topics.RawExchangeRates,
        Consumed.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )
      .filter { _, v -> v.isValid() }
      .join(
        ethTokensStream,
        { rate, token -> rate.apply { if (token.getAddress() != null) setAddress(token.getAddress().hexBuffer()) } },
        Materialized.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )
      .toStream()
      .filter { _, v -> v.getAddress() != null }
      .to(
        Topics.TokenExchangeRates,
        Produced.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )

    // Generate the topology
    return builder.build()
  }
}
