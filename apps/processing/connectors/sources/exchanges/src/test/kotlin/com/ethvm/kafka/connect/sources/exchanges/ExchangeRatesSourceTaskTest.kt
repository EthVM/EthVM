package com.ethvm.kafka.connect.sources.exchanges

import com.ethvm.kafka.connect.sources.exchanges.provider.CoinGeckoTokenExchangeProvider
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.shouldNotThrowUnit
import io.kotlintest.specs.BehaviorSpec
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkObject
import org.apache.kafka.connect.errors.RetriableException
import java.io.IOException
import java.time.temporal.ChronoUnit
import java.util.concurrent.TimeUnit

class ExchangeRatesSourceTaskTest : BehaviorSpec() {

  init {
    Given("a ExchangeRatesSourceTask") {

      val task = ExchangeRatesSourceTask(TimeUnit.SECONDS.toMillis(1))

      When("we ask for current version") {

        val version = task.version()

        Then("we should obtain the correct number") {
          version shouldNotBe null
        }
      }

      When("we call start") {

        val props = mutableMapOf<String, String>()
        task.start(props)

        Then("it should initialize properly the task") {
          true shouldBe true
        }
      }

      When("we poll for source records for the first time") {

        val mockedProvider = mockk<CoinGeckoTokenExchangeProvider>()
        every { mockedProvider.fetch() } returns listOf()

        mockkObject(ExchangeRatesSourceConnector.Config)
        every { ExchangeRatesSourceConnector.Config.provider(any()) } returns mockedProvider
        every { ExchangeRatesSourceConnector.Config.syncInterval(any()) } returns 5

        val props = mutableMapOf<String, String>()
        task.start(props)

        val poll = task.poll()

        Then("we should directly fetch from the exchange provider for source records") {
          poll shouldNotBe null
          poll.size shouldBe 0
        }
      }

      When("we poll for source records but a recoverable exception happens") {

        val mockedProvider = mockk<CoinGeckoTokenExchangeProvider>()
        every { mockedProvider.fetch() } throws RetriableException("")

        mockkObject(ExchangeRatesSourceConnector.Config)
        every { ExchangeRatesSourceConnector.Config.provider(any()) } returns mockedProvider
        every { ExchangeRatesSourceConnector.Config.syncInterval(any()) } returns 5

        mockkObject(ChronoUnit.MINUTES)
        every { ChronoUnit.MINUTES.between(any(), any()) } returns Long.MAX_VALUE

        val props = mutableMapOf<String, String>()
        task.start(props)

        val poll = task.poll()

        Then("we obtain a empty list of source records") {
          poll shouldNotBe null
          poll.size shouldBe 0
        }
      }

      When("we poll for source records but a non recoverable exception happens") {

        val mockedProvider = mockk<CoinGeckoTokenExchangeProvider>()
        every { mockedProvider.fetch() } throws IOException("")

        mockkObject(ExchangeRatesSourceConnector.Config)
        every { ExchangeRatesSourceConnector.Config.provider(any()) } returns mockedProvider
        every { ExchangeRatesSourceConnector.Config.syncInterval(any()) } returns 5

        mockkObject(ChronoUnit.MINUTES)
        every { ChronoUnit.MINUTES.between(any(), any()) } returns Long.MAX_VALUE

        val props = mutableMapOf<String, String>()
        task.start(props)

        val exception = shouldNotThrowUnit<IOException> { task.poll() }

        Then("we don't handle the exception") {
          exception::class shouldNotBe IOException::class
        }
      }
    }
  }
}
