package io.enkrypt.bolt.kafka.serdes

import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.capture.BlockSummaryRecord
import io.enkrypt.avro.common.Address
import io.enkrypt.avro.processing.*


object BoltSerdes {

  fun Date() = DateSerde()

  fun BigInteger() = BigIntegerSerde()

  fun Long() = LongSerde()

  fun BlockStatistics() = BlockStatisticsSerde()

  fun BlockSummary() = BlockSummarySerde()

  fun Transaction() = TransactionSerde()

  fun BlockSummaryRecord() = SpecificAvroSerde<BlockSummaryRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), false)
  }

  fun HexString() = HexStringSerde()


  fun FungibleTokenBalanceKey() = SpecificAvroSerde<FungibleTokenBalanceKeyRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), true)
  }

  fun FungibleTokenBalance() = SpecificAvroSerde<FungibleTokenBalanceRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), false)
  }

  fun NonFungibleTokenBalanceKey() = SpecificAvroSerde<NonFungibleTokenBalanceKeyRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), true)
  }

  fun NonFungibleTokenBalance() = SpecificAvroSerde<NonFungibleTokenBalanceRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), false)
  }

  fun MetricKey() = SpecificAvroSerde<MetricKeyRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), true)
  }

  fun Metric() = SpecificAvroSerde<MetricRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), false)
  }

  fun ContractKey() = SpecificAvroSerde<ContractKeyRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), true)
  }

  fun ContractCreation() = SpecificAvroSerde<ContractCreationRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), false)
  }

  fun ContractSuicide() = SpecificAvroSerde<ContractSuicideRecord>().apply {
    configure(mapOf("schema.registry.url" to "http://localhost:8081"), false)
  }
}

