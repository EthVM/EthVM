package com.ethvm.kafka.connect.sources.exchanges.provider

import com.ethvm.avro.exchange.CoinExchangeRateRecord
import com.ethvm.avro.exchange.TokenExchangeRateRecord
import com.ethvm.kafka.connect.sources.exchanges.utils.AvroToConnect
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.BehaviorSpec
import ir.mirrajabi.okhttpjsonmock.OkHttpMockInterceptor
import ir.mirrajabi.okhttpjsonmock.providers.InputStreamProvider
import okhttp3.OkHttpClient
import org.apache.avro.generic.GenericData

class CoinGeckoExchangeProviderTest : BehaviorSpec() {

  init {
    Given("a CoinGeckoExchangeProvider with default options") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val opts = mapOf(
        "CoinGeckoCurrencyExchangeProvider" to CoinGeckoCurrencyExchangeProvider.DEFAULT_OPTS,
        "CoinGeckoTokenExchangeProvider" to mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "tokenIds" to listOf(
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
          ),
          "perPage" to 10
        )
      )

      val provider = CoinGeckoExchangeProvider(
        options = opts,
        okHttpClient = okHttpClient
      )

      When("we ask for SourceRecords") {

        val records = provider.fetch()

        Then("we should obtain a list of SourceRecords for the different providers") {
          records shouldNotBe null
          records.size shouldBe 15

          val record1 = records[0]
          val coinExchangeRateRecord =
            AvroToConnect.toAvroData(
              AvroToConnect.toConnectSchema(CoinExchangeRateRecord("", "", 0.0, 0.0, 0.0, 0.0, 0)),
              record1.value()
            ) as GenericData.Record

          with(coinExchangeRateRecord) {
            get("id") shouldBe "bitcoin-usd"
          }

          val record2 = records[3]
          val tokenExchangeRateRecord =
            AvroToConnect.toAvroData(
              AvroToConnect.toConnectSchema(TokenExchangeRateRecord()),
              record2.value()
            ) as GenericData.Record

          with(tokenExchangeRateRecord) {
            get("name") shouldBe "Arcblock"
          }
        }
      }
    }

    Given("a CoinGeckoExchangeProvider with only coin exchange rates provider") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val opts = mapOf(
        "CoinGeckoCurrencyExchangeProvider" to CoinGeckoCurrencyExchangeProvider.DEFAULT_OPTS
      )

      val provider = CoinGeckoExchangeProvider(
        options = opts,
        okHttpClient = okHttpClient
      )

      When("we ask for SourceRecords") {

        val records = provider.fetch()

        Then("we should obtain a list of SourceRecords for the different providers") {
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
          }
        }
      }
    }

    Given("a CoinGeckoExchangeProvider with only token exchange rates provider") {

      val inputStreamProvider = InputStreamProvider { path -> javaClass.getResourceAsStream("/$path") }

      val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(OkHttpMockInterceptor(inputStreamProvider, 0))
        .build()

      val opts = mapOf(
        "CoinGeckoTokenExchangeProvider" to mapOf(
          "topic" to "token-exchange-rates",
          "currency" to "usd",
          "tokenIds" to listOf(
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
          ),
          "perPage" to 10
        )
      )

      val provider = CoinGeckoExchangeProvider(
        options = opts,
        okHttpClient = okHttpClient
      )

      When("we ask for SourceRecords") {

        val records = provider.fetch()

        Then("we should obtain a list of SourceRecords for the different providers") {
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
          }
        }
      }
    }
  }
}
