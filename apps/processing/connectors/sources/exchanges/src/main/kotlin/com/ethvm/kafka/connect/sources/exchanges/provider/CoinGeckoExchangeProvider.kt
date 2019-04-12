package com.ethvm.kafka.connect.sources.exchanges.provider

import com.beust.klaxon.Klaxon
import com.beust.klaxon.PropertyStrategy
import com.ethvm.avro.exchange.ExchangeRateRecord
import com.ethvm.avro.exchange.SymbolKeyRecord
import com.ethvm.kafka.connect.sources.exchanges.model.ExchangeRate
import com.ethvm.kafka.connect.sources.exchanges.utils.AvroToConnect
import mu.KotlinLogging
import okhttp3.HttpUrl
import okhttp3.OkHttpClient
import okhttp3.Request
import org.apache.kafka.connect.source.SourceRecord
import java.io.BufferedReader
import kotlin.reflect.KProperty

class CoinGeckoExchangeProvider(
  private val topic: String,
  private val currency: String = "usd",
  private val okHttpClient: OkHttpClient = CoinGeckoExchangeProvider.okHttpClient,
  private val klaxon: Klaxon = CoinGeckoExchangeProvider.klaxon
) : ExchangeProvider {

  private val logger = KotlinLogging.logger {}

  override fun fetch(): List<SourceRecord> {

    val sourcePartition = mapOf("id" to "coingecko")
    val sourceOffset = emptyMap<String, Any>()

    val records = mutableListOf<SourceRecord>()
    var page = 1
    do {
      val url = COINGECKO_API_URL(currency, page)

      logger.debug { "Fetching from: $url" }

      val request = Request.Builder()
        .url(url)
        .build()

      val response = okHttpClient
        .newCall(request)
        .execute()

      if (!response.isSuccessful) {
        logger.error { "Unsuccessful response - Error Code: ${response.code()}" }
        // TODO: Check exception type an analyze properly if we should retry or not
      }

      val body = response.body()
      val reader = BufferedReader(body?.charStream())

      logger.debug { "Parsing result for page $page into rates" }

      val rates = klaxon.parseArray<ExchangeRate>(reader) ?: emptyList()

      // Filter
      rates
        .filter { it.isValid() }
        .mapTo(records) { rate ->

          val keyRecord = SymbolKeyRecord.newBuilder()
            .setSymbol(rate.symbol!!.trim().toUpperCase())
            .build()

          val valueRecord = rate
            .toExchangeRateRecord(ExchangeRateRecord.newBuilder())
            .build()

          val key = AvroToConnect.toConnectData(keyRecord)
          val value = AvroToConnect.toConnectData(valueRecord)

          SourceRecord(
            sourcePartition,
            sourceOffset,
            topic,
            key.schema(),
            key.value(),
            value.schema(),
            value.value()
          )

        }

      page = page.inc()
    } while (rates.isNotEmpty())

    return records

//      val rates2 = mutableListOf<ExchangeRate>()
//
//      // Filter by symbol (NOTE: There are repeating symbols, we need to ensure we have an unique id to properly filter)
//      // Temporary solution: Remove repeating symbols
//      val filteredRates = rates2
//        .filterNot { rate ->
//          rates2
//            .groupBy { it.symbol }
//            .filterValues { it.size > 1 }
//            .flatMap { it.value }
//            .contains(rate)
//        }
  }

  companion object {

    @Suppress("FunctionName")
    fun COINGECKO_API_URL(currency: String = "usd", page: Int = 1): HttpUrl =
      HttpUrl.Builder()
        .scheme("https")
        .host("api.coingecko.com")
        .addPathSegment("api")
        .addPathSegment("v3")
        .addPathSegment("coins")
        .addPathSegment("markets")
        .addQueryParameter("vs_currency", currency)
        .addQueryParameter("order", "market_cap_desc")
        .addQueryParameter("sparkline", "false")
        .addQueryParameter("per_page", "250")
        .addQueryParameter("page", page.toString())
        .build()

    val okHttpClient = OkHttpClient()

    val klaxon = Klaxon()
      .propertyStrategy(object : PropertyStrategy {

        private val ignored = arrayListOf(
          "roi",
          "ath",
          "ath_change_percentage",
          "ath_date"
        )

        override fun accept(property: KProperty<*>): Boolean = property.name !in ignored
      })
  }
}