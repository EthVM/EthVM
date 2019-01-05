package io.enkrypt.kafka.streams.util

import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.serdes.Serdes
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.streams.TopologyTestDriver

object KafkaUtil {

  fun <K, V> read(
    testDriver: TopologyTestDriver,
    topic: String,
    keyDeserializer: Deserializer<K>,
    valueDeserializer: Deserializer<V>,
    count: Int = 1
  ): List<ProducerRecord<K, V>> = (1..count).mapNotNull { testDriver.readOutput(topic, keyDeserializer, valueDeserializer) }

  fun <K, V> readOne(
    testDriver: TopologyTestDriver,
    topic: String,
    keyDeserializer: Deserializer<K>,
    valueDeserializer: Deserializer<V>
  ): ProducerRecord<K, V>? = read(testDriver, topic, keyDeserializer, valueDeserializer).firstOrNull()

  fun readFungibleTokenMovements(testDriver: TopologyTestDriver, count: Int) =
    read(
      testDriver,
      Topics.FungibleTokenMovements,
      Serdes.TokenBalanceKey().deserializer(),
      Serdes.TokenBalance().deserializer(),
      count
    )

  fun readFungibleTokenMovement(testDriver: TopologyTestDriver) = readFungibleTokenMovements(testDriver, 1).firstOrNull()

  fun readBalances(testDriver: TopologyTestDriver, count: Int) = read(
    testDriver,
    Topics.Balances,
    Serdes.TokenBalanceKey().deserializer(),
    Serdes.TokenBalance().deserializer(),
    count
  )

  fun readBalance(testDriver: TopologyTestDriver) = readBalances(testDriver, 1).firstOrNull()

  fun readContractCreations(testDriver: TopologyTestDriver, count: Int) = read(
    testDriver,
    Topics.ContractCreations,
    Serdes.ContractKey().deserializer(),
    Serdes.ContractCreate().deserializer(),
    count
  )

  fun readContractCreation(testDriver: TopologyTestDriver) = readContractCreations(testDriver, 1).firstOrNull()

  fun readContractDestructions(testDriver: TopologyTestDriver, count: Int) =
    read(
      testDriver,
      Topics.ContractDestructions,
      Serdes.ContractKey().deserializer(),
      Serdes.ContractCreate().deserializer(),
      count
    )

  fun readContractDestruction(testDriver: TopologyTestDriver) = readContractDestructions(testDriver, 1).firstOrNull()
}
