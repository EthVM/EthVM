package com.ethvm.kafka.connect.sources.exchanges.provider

import com.ethvm.avro.exchange.CoinExchangeRateRecord
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

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val provider = CoinGeckoCurrencyExchangeProvider(
        okHttpClient = okHttpClient
      )

      When("we fetch for coin exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse default coin exchanges") {
          records shouldNotBe null
          records.size shouldBe 3

          val record = records[0]
          val coinExchangeRateRecord =
            AvroToConnect.toAvroData(
              AvroToConnect.toConnectSchema(CoinExchangeRateRecord("", "", 0.0, 0.0, 0.0, 0.0, 0)),
              record.value()
            ) as GenericData.Record

          with(coinExchangeRateRecord) {
            get("id") shouldBe "bitcoin-usd"
            get("currency") shouldBe "usd"
            get("price") shouldBe 5533.48
            get("marketCap") shouldBe 97751804938.9725
            get("vol24h") shouldBe 18786140482.468513
            get("change24h") shouldBe 4.121102578709593
            get("lastUpdated") shouldBe 1556016581
          }
        }
      }
    }

    Given("a properly second configured CoinGeckoCurrencyExchangeProvider with tokens ids") {

      val okHttpClient = mockk<OkHttpClient>()

      val mockRequest = Request.Builder()
        .url(CoinGeckoCurrencyExchangeProvider.COINGECKO_API_URL(listOf("ethereum,bitcoin,monero"), "usd"))
        .build()

      val mockResponse = Response.Builder()
        .protocol(Protocol.HTTP_2)
        .request(mockRequest)
        .code(429)
        .message("")
        .build()

      every { okHttpClient.newCall(any()).execute() } returns mockResponse

      val provider = CoinGeckoCurrencyExchangeProvider(
        okHttpClient = okHttpClient,
        jackson = CoinGeckoExchangeProvider.jackson
      )

      When("we fetch for coin exchange rates and we receive 429 (Too many requests)") {

        val exception = shouldThrow<RetriableException> { provider.fetch() }

        Then("we should throw a RetriableException") {
          exception::class shouldBe RetriableException::class
        }
      }
    }

    Given("a properly third configured CoinGeckoCurrencyExchangeProvider with coins ids") {

      val okHttpClient = mockk<OkHttpClient>()

      val mockRequest = Request.Builder()
        .url(CoinGeckoCurrencyExchangeProvider.COINGECKO_API_URL(listOf("ethereum,bitcoin,monero"), "usd"))
        .build()

      val mockResponse = Response.Builder()
        .protocol(Protocol.HTTP_2)
        .request(mockRequest)
        .code(404)
        .message("")
        .build()

      every { okHttpClient.newCall(any()).execute() } returns mockResponse

      val provider = CoinGeckoCurrencyExchangeProvider(
        okHttpClient = okHttpClient,
        jackson = CoinGeckoExchangeProvider.jackson
      )

      When("we fetch for token exchange rates and we receive 404 (Not found)") {

        val exception = shouldThrow<IOException> { provider.fetch() }

        Then("we should throw an IOException") {
          exception::class shouldBe IOException::class
        }
      }
    }
  }
}