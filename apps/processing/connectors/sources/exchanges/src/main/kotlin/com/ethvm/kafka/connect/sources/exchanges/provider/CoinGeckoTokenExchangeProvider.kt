package com.ethvm.kafka.connect.sources.exchanges.provider

import com.beust.klaxon.Klaxon
import com.beust.klaxon.PropertyStrategy
import com.ethvm.avro.exchange.TokenExchangeRateKeyRecord
import com.ethvm.avro.exchange.TokenExchangeRateRecord
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector
import com.ethvm.kafka.connect.sources.exchanges.utils.AvroToConnect
import mu.KotlinLogging
import okhttp3.HttpUrl
import okhttp3.OkHttpClient
import okhttp3.Request
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import java.io.BufferedReader
import java.io.IOException
import kotlin.reflect.KProperty

class CoinGeckoTokenExchangeProvider(
  options: Map<String, Any> = emptyMap(),
  private val okHttpClient: OkHttpClient = CoinGeckoTokenExchangeProvider.okHttpClient,
  private val klaxon: Klaxon = CoinGeckoTokenExchangeProvider.klaxon
) : ExchangeProvider {

  private val topic: String = options.getOrDefault("topic", ExchangeRatesSourceConnector.Config.TOPIC_CONFIG_DEFAULT) as String
  private val tokenIds: List<TokenIdEntry> = options.getOrDefault("tokens_ids", emptyList<TokenIdEntry>()) as List<TokenIdEntry>
  private val currency: String = options.getOrDefault("currency", "usd") as String
  private val perPage: Int = options.getOrDefault("per_page", 250) as Int

  private val logger = KotlinLogging.logger {}

  private val sourcePartition = mapOf("id" to "coingecko")
  private val sourceOffset = emptyMap<String, Any>()

  @Throws(Exception::class)
  override fun fetch(): List<SourceRecord> {

    return tokenIds
      .chunked(perPage)
      .map { chunk ->

        val tokens = chunk.map { it.id }
        val url = COINGECKO_API_URL(tokens, currency, perPage, 1)

        logger.debug { "Fetching from: $url" }

        val request = Request.Builder()
          .url(url)
          .build()

        val response = okHttpClient
          .newCall(request)
          .execute()

        if (!response.isSuccessful) {
          val code = response.code()

          logger.error { "Unsuccessful response - Error Code: $code" }

          when (code) {
            in 100..199, in 429..429, in 500..599 -> throw RetriableException("Status code: $code. Current response: $response")
            else -> throw IOException(response.toString())
          }
        }

        val body = response.body()
        val reader = BufferedReader(body?.charStream())

        logger.debug { "Parsing into rates" }

        val rates = klaxon.parseArray<CoinGeckoExchangeRate>(reader) ?: emptyList()
        rates
          .filter { it.isValid() }
          .map { rate ->

            val address = chunk.first { rate.id == it.id }.address

            val keyRecord = TokenExchangeRateKeyRecord.newBuilder()
              .setAddress(address)
              .build()

            val valueRecord = rate
              .toExchangeRateRecord(TokenExchangeRateRecord.newBuilder(), address)
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
      }
      .flatten()
  }

  companion object {

    @Suppress("FunctionName")
    fun COINGECKO_API_URL(ids: List<String> = emptyList(), currency: String = "usd", per_page: Int = 250, page: Int = 1): HttpUrl =
      HttpUrl.Builder()
        .scheme("https")
        .host("api.coingecko.com")
        .addPathSegment("api")
        .addPathSegment("v3")
        .addPathSegment("coins")
        .addPathSegment("markets")
        .addQueryParameter("ids", ids.joinToString(separator = ","))
        .addQueryParameter("vs_currency", currency)
        .addQueryParameter("order", "market_cap_desc")
        .addQueryParameter("sparkline", "false")
        .addQueryParameter("per_page", per_page.toString())
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

data class TokenIdEntry(
  val id: String,
  val address: String
)

data class CoinGeckoExchangeRate(
  val id: String? = "",
  val symbol: String? = "",
  val name: String? = "",
  val image: String? = "",
  val current_price: Double? = -1.0,
  val market_cap: Double? = -1.0,
  val market_cap_rank: Int? = -1,
  val total_volume: Double? = -1.0,
  val high_24h: Double? = -1.0,
  val low_24h: Double? = -1.0,
  val price_change_24h: Double? = -1.0,
  val price_change_percentage_24h: Double? = -1.0,
  val market_cap_change_24h: Double? = -1.0,
  val market_cap_change_percentage_24h: Double? = -1.0,
  val circulating_supply: String? = "",
  val total_supply: Long? = -1,
  val last_updated: String? = ""
) {

  fun isValid() =
    symbol != "" &&
      total_supply != -1L &&
      market_cap != -1.0 &&
      price_change_percentage_24h != -1.0 &&
      total_volume != -1.0 &&
      current_price != -1.0

  fun toExchangeRateRecord(builder: TokenExchangeRateRecord.Builder, address: String): TokenExchangeRateRecord.Builder =
    builder
      .setSymbol(symbol)
      .setName(name)
      .setImage(image)
      .setAddress(address)
      .setCurrentPrice(current_price)
      .setMarketCap(market_cap)
      .setMarketCapRank(market_cap_rank)
      .setTotalVolume(total_volume)
      .setHigh24h(high_24h)
      .setLow24h(low_24h)
      .setPriceChange24h(price_change_24h)
      .setPriceChangePercentage24h(price_change_percentage_24h)
      .setMarketCapChange24h(market_cap_change_24h)
      .setMarketCapChangePercentage24h(market_cap_change_percentage_24h)
      .setCirculatingSupply(circulating_supply)
      .setTotalSupply(total_supply)
      .setLastUpdated(last_updated)
}
