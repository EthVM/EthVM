package io.enkrypt.util

import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.serdes.Serdes
import org.apache.kafka.streams.TopologyTestDriver

object KafkaUtil {

  fun readFungibleTokenMovement(testDriver: TopologyTestDriver) =
    testDriver.readOutput(
      Topics.FungibleTokenMovements,
      Serdes.TokenBalanceKey().deserializer(),
      Serdes.TokenBalance().deserializer()
    )

  fun readNonFungibleTokenBalance(testDriver: TopologyTestDriver) =
    testDriver.readOutput(
      Topics.NonFungibleTokenBalances,
      Serdes.TokenBalanceKey().deserializer(),
      Serdes.TokenBalance().deserializer()
    )

  fun readContractCreation(testDriver: TopologyTestDriver) =
    testDriver.readOutput(
      Topics.ContractCreations,
      Serdes.ContractKey().deserializer(),
      Serdes.ContractCreate().deserializer()
    )

  fun readContractDestruction(testDriver: TopologyTestDriver) =
    testDriver.readOutput(
      Topics.ContractDestructions,
      Serdes.ContractKey().deserializer(),
      Serdes.ContractDestroy().deserializer()
    )


}

