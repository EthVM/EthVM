package com.ethvm.kafka.connect.sources.exchanges.provider

import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec
import ir.mirrajabi.okhttpjsonmock.OkHttpMockInterceptor
import ir.mirrajabi.okhttpjsonmock.providers.InputStreamProvider
import okhttp3.OkHttpClient
import org.apache.kafka.connect.source.SourceRecord

class CoinGeckoExchangeProviderTest : BehaviorSpec() {

  init {

    Given("a CoinGeckoExchangeProvider") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val provider = CoinGeckoExchangeProvider(
        mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "per_page" to 250
        ),
        okHttpClient,
        CoinGeckoExchangeProvider.klaxon
      )

      When("we fetch for token exchange rates") {

        val records: List<SourceRecord> = provider.fetch()

        Then("we should parse and process it correctly") {
          records shouldNotBe null
          records.size shouldBe 254
        }
      }
    }
  }
}
