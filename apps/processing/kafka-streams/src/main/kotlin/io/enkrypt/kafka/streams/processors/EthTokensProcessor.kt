package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.exchange.SymbolKeyRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.ContractMetadataRecord
import io.enkrypt.avro.tokens.EthTokenListsKeyRecord
import io.enkrypt.common.extensions.fixed20
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import java.util.Properties

class EthTokensProcessor : AbstractKafkaProcessor() {

  override val id: String = "eth-tokens-processor"

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

    // Send directly to contract-metadata topic to be processed in contracts
    val ethTokensStream = builder
      .stream<EthTokenListsKeyRecord, ContractMetadataRecord>(
        Topics.EthTokensList,
        Consumed.with(Serdes.EthTokenListsKey(), Serdes.ContractMetadata())
      )

    // Send directly to contract-metadata topic to be processed in contracts
    ethTokensStream
      .selectKey { k, _ -> ContractKeyRecord(k.getAddress().fixed20()) }
      .to(
        Topics.ContractMetadata,
        Produced.with(Serdes.ContractKey(), Serdes.ContractMetadata())
      )

    // Send directly to eth-lists-metadata topic to be processed by ExchangeRateProcessor
    ethTokensStream
      .selectKey { _, v -> SymbolKeyRecord(v.getSymbol().toUpperCase()) }
      .to(
        Topics.EthTokensListBySymbol,
        Produced.with(Serdes.SymbolKey(), Serdes.ContractMetadata())
      )

    return builder.build()
  }
}
