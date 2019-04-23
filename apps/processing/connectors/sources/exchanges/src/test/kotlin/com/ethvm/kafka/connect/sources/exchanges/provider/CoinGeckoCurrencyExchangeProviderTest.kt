package com.ethvm.kafka.connect.sources.exchanges.provider

import com.ethvm.avro.exchange.TokenExchangeRateRecord
import com.ethvm.kafka.connect.sources.exchanges.utils.AvroToConnect
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.shouldThrow
import io.kotlintest.specs.BehaviorSpec
import io.mockk.every
import io.mockk.mockk
import ir.mirrajabi.okhttpjsonmock.OkHttpMockInterceptor
import ir.mirrajabi.okhttpjsonmock.providers.InputStreamProvider
import okhttp3.OkHttpClient
import okhttp3.Protocol
import okhttp3.Request
import okhttp3.Response
import org.apache.avro.generic.GenericData
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import java.io.IOException

class CoinGeckoCurrencyExchangeProviderTest : BehaviorSpec() {

  init {

    Given("an empty CoinGeckoCurrencyExchangeProvider") {

      val provider = CoinGeckoCurrencyExchangeProvider()

      When("we fetch for coin exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse default coin exchanges") {
          records shouldNotBe null
          records.size shouldBe 3
        }
      }
    }

    Given("a configured CoinGeckoCurrencyExchangeProvider but without coins ids") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val provider = CoinGeckoCurrencyExchangeProvider(
        mapOf(
          "topic" to "coin-exchange-rates",
          "currency" to "usd",
          "coinIds" to emptyList<TokenIdEntry>()
        ),
        okHttpClient,
        CoinGeckoExchangeProvider.jackson
      )

      When("we fetch for coin exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse empty coin exchanges") {
          records shouldNotBe null
          records.size shouldBe 0
        }
      }
    }

    Given("a properly configured CoinGeckoCurrencyExchangeProvider with coins ids") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val tokensIds = listOf(
        TokenIdEntry("hurify", "0xcdb7ecfd3403eef3882c65b761ef9b5054890a47")
      )

      val provider = CoinGeckoCurrencyExchangeProvider(
        mapOf(
          "topic" to "coin-exchange-rates",
          "currency" to "usd",
          "coinIds" to tokensIds
        ),
        okHttpClient,
        CoinGeckoExchangeProvider.jackson
      )

      When("we fetch for coin exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse correctly coin exchanges rates") {
          records shouldNotBe null
          records.size shouldBe 12

          val record = records[0]
          val tokenExchangeRateRecord =
            AvroToConnect.toAvroData(
              AvroToConnect.toConnectSchema(TokenExchangeRateRecord()),
              record.value()
            ) as GenericData.Record

          with(tokenExchangeRateRecord) {
            get("name") shouldBe "Arcblock"
            get("address") shouldBe "0xb98d4c97425d9908e66e53a6fdf673acca0be986"
          }
        }
      }
    }

    Given("a properly second configured CoinGeckoCurrencyExchangeProvider with tokens ids") {

      val okHttpClient = mockk<OkHttpClient>()

      val mockRequest = Request.Builder()
        .url(CoinGeckoTokenExchangeProvider.COINGECKO_API_URL(listOf("hurify"), "usd", 10, 1))
        .build()

      val mockResponse = Response.Builder()
        .protocol(Protocol.HTTP_2)
        .request(mockRequest)
        .code(429)
        .message("")
        .build()

      every { okHttpClient.newCall(any()).execute() } returns mockResponse

      val tokensIds = listOf(
        TokenIdEntry("hurify", "0xcdb7ecfd3403eef3882c65b761ef9b5054890a47")
      )

      val provider = CoinGeckoCurrencyExchangeProvider(
        mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "tokenIds" to tokensIds
        ),
        okHttpClient,
        CoinGeckoExchangeProvider.jackson
      )

      When("we fetch for token exchange rates and we receive 429 (Too many requests)") {

        val exception = shouldThrow<RetriableException> { provider.fetch() }

        Then("we should receive a RetriableException") {
          exception::class shouldBe RetriableException::class
        }
      }
    }

    Given("a properly third configured CoinGeckoCurrencyExchangeProvider with coins ids") {

      val okHttpClient = mockk<OkHttpClient>()

      val mockRequest = Request.Builder()
        .url(CoinGeckoTokenExchangeProvider.COINGECKO_API_URL(listOf("hurify"), "usd", 10, 1))
        .build()

      val mockResponse = Response.Builder()
        .protocol(Protocol.HTTP_2)
        .request(mockRequest)
        .code(429)
        .message("")
        .build()

      every { okHttpClient.newCall(any()).execute() } returns mockResponse

      val tokensIds = listOf(
        TokenIdEntry("hurify", "0xcdb7ecfd3403eef3882c65b761ef9b5054890a47")
      )

      val provider = CoinGeckoCurrencyExchangeProvider(
        mapOf(
          "topic" to "coin-exchange-rates",
          "currency" to "usd",
          "coinIds" to tokensIds
        ),
        okHttpClient,
        CoinGeckoExchangeProvider.jackson
      )

      When("we fetch for token exchange rates and we receive 429 (Too many requests)") {

        val exception = shouldThrow<IOException> { provider.fetch() }

        Then("we should receive a IOException") {
          exception::class shouldBe IOException::class
        }
      }
    }
  }
}