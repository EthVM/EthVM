package com.ethvm.kafka.connect.sources.exchanges

import com.ethvm.kafka.connect.sources.exchanges.provider.CoinGeckoExchangeProvider
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec

class ExchangeRatesSourceConnectorTest : BehaviorSpec() {

  init {
    Given("a ExchangeRateSourceConnector") {

      val connector = ExchangeRateSourceConnector()

      When("start with an empty map of properties") {

        val empty = mutableMapOf<String, String>()

        val syncInterval = ExchangeRateSourceConnector.Config.syncInterval(empty)
        val provider = ExchangeRateSourceConnector.Config.provider(empty)

        Then("we should obtain default values") {
          syncInterval shouldBe ExchangeRateSourceConnector.Config.SYNC_INTERVAL_DEFAULT
          provider::class shouldBe CoinGeckoExchangeProvider::class
        }
      }

      When("we ask for current version") {

        val version = connector.version()

        Then("we should obtain the correct number") {
          version shouldNotBe null
        }
      }

      When("we ask for curren task class") {

        val taskClass = connector.taskClass()

        Then("we should obtain corresponding task class") {
          taskClass shouldBe ExchangeRatesSourceTask::class
        }
      }

      When("we request one task config") {

        val empty = mutableMapOf<String, String>()
        connector.start(empty)

        val taskConfigs = connector.taskConfigs(1)

        Then("we should obtain a list of current config") {
          taskConfigs shouldNotBe null
        }
      }

//      When("we request more than one task config") {
//
//        val empty = mutableMapOf<String, String>()
//        connector.start(empty)
//
//        Then("we should obtain an exception (only one allowed)") {
//
//        }
//      }
    }
  }
}