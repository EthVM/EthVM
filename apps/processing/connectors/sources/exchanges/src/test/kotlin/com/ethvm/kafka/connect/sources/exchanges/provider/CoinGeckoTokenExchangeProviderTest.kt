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

class CoinGeckoTokenExchangeProviderTest : BehaviorSpec() {

  init {

    Given("an empty CoinGeckoTokenExchangeProvider") {

      val provider = CoinGeckoTokenExchangeProvider()

      When("we fetch for token exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse empty token exchanges") {
          records shouldNotBe null
          records.size shouldBe 0
        }
      }
    }

    Given("a configured CoinGeckoTokenExchangeProvider but without tokens ids") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val provider = CoinGeckoTokenExchangeProvider(
        mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "per_page" to 10
        ),
        okHttpClient,
        CoinGeckoTokenExchangeProvider.jackson
      )

      When("we fetch for token exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse empty token exchanges") {
          records shouldNotBe null
          records.size shouldBe 0
        }
      }
    }

    Given("a properly configured CoinGeckoTokenExchangeProvider with tokens ids") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val tokensIds = listOf(
        TokenIdEntry("hurify", "0xcdb7ecfd3403eef3882c65b761ef9b5054890a47"),
        TokenIdEntry("iqeon", "0x0db8d8b76bc361bacbb72e2c491e06085a97ab31"),
        TokenIdEntry("1sg", "0x0f72714b35a366285df85886a2ee174601292a17"),
        TokenIdEntry("oxbitcoin", "0xB6eD7644C69416d67B522e20bC294A9a9B405B31"),
        TokenIdEntry("first-blood", "0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7"),
        TokenIdEntry("parkgene", "0x6dd4e4aad29a40edd6a409b9c1625186c9855b4d"),
        TokenIdEntry("1world", "0xfdbc1adc26f0f8f8606a5d63b7d3a3cd21c22b23"),
        TokenIdEntry("accelerator-network", "0x13f1b7fdfbe1fc66676d56483e21b1ecb40b58e2"),
        TokenIdEntry("arcblock", "0xb98d4c97425d9908e66e53a6fdf673acca0be986"),
        TokenIdEntry("the-abyss", "0x0e8d6b471e332f140e7d9dbb99e5e3822f728da6"),
        TokenIdEntry("adelphoi", "0x660e71483785f66133548b10f6926dc332b06e61"),
        TokenIdEntry("adbank", "0x2baac9330cf9ac479d819195794d79ad0c7616e3")
      )

      val provider = CoinGeckoTokenExchangeProvider(
        mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "per_page" to 10,
          "tokens_ids" to tokensIds
        ),
        okHttpClient,
        CoinGeckoTokenExchangeProvider.jackson
      )

      When("we fetch for token exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse correctly token exchanges rates") {
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

    Given("a properly second configured CoinGeckoTokenExchangeProvider with tokens ids") {

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

      val provider = CoinGeckoTokenExchangeProvider(
        mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "per_page" to 10,
          "tokens_ids" to tokensIds
        ),
        okHttpClient,
        CoinGeckoTokenExchangeProvider.jackson
      )

      When("we fetch for token exchange rates and we receive 429 (Too many requests)") {

        val exception = shouldThrow<RetriableException> { provider.fetch() }

        Then("we should receive a RetriableException") {
          exception::class shouldBe RetriableException::class
        }
      }
    }

    Given("a properly third configured CoinGeckoTokenExchangeProvider with tokens ids") {

      val okHttpClient = mockk<OkHttpClient>()

      val mockRequest = Request.Builder()
        .url(CoinGeckoTokenExchangeProvider.COINGECKO_API_URL(listOf("hurify"), "usd", 10, 1))
        .build()

      val mockResponse = Response.Builder()
        .protocol(Protocol.HTTP_2)
        .request(mockRequest)
        .code(404)
        .message("")
        .build()

      every { okHttpClient.newCall(any()).execute() } returns mockResponse

      val tokensIds = listOf(
        TokenIdEntry("hurify", "0xcdb7ecfd3403eef3882c65b761ef9b5054890a47")
      )

      val provider = CoinGeckoTokenExchangeProvider(
        mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "per_page" to 10,
          "tokens_ids" to tokensIds
        ),
        okHttpClient,
        CoinGeckoTokenExchangeProvider.jackson
      )

      When("we fetch for token exchange rates and we receive 404 (Too many requests)") {

        val exception = shouldThrow<IOException> { provider.fetch() }

        Then("we should receive a IOException") {
          exception::class shouldBe IOException::class
        }
      }
    }
  }
}
