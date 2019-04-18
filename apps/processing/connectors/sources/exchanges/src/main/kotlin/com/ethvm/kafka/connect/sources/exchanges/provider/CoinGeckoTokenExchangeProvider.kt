package com.ethvm.kafka.connect.sources.exchanges.provider

import com.ethvm.avro.exchange.TokenExchangeRateKeyRecord
import com.ethvm.avro.exchange.TokenExchangeRateRecord
import com.ethvm.common.extensions.byteBuffer
import com.ethvm.kafka.connect.sources.exchanges.ExchangeRatesSourceConnector
import com.ethvm.kafka.connect.sources.exchanges.utils.AvroToConnect
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import mu.KotlinLogging
import okhttp3.HttpUrl
import okhttp3.OkHttpClient
import okhttp3.Request
import org.apache.kafka.connect.errors.RetriableException
import org.apache.kafka.connect.source.SourceRecord
import java.io.BufferedReader
import java.io.IOException
import java.time.Instant

class CoinGeckoTokenExchangeProvider(
  options: Map<String, Any> = emptyMap(),
  private val okHttpClient: OkHttpClient = CoinGeckoTokenExchangeProvider.okHttpClient,
  private val jackson: ObjectMapper = CoinGeckoTokenExchangeProvider.jackson
) : ExchangeProvider {

  private val topic: String = options.getOrDefault("topic", ExchangeRatesSourceConnector.Config.TOPIC_CONFIG_DEFAULT) as String
  @Suppress("UNCHECKED_CAST")
  private val tokenIds: List<TokenIdEntry> = options.getOrDefault("tokens_ids", emptyList<TokenIdEntry>()) as List<TokenIdEntry>
  private val currency: String = options.getOrDefault("currency", "usd") as String
  private val perPage: Int = options.getOrDefault("per_page", 50) as Int

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

        val rates = jackson.readValue<List<CoinGeckoExchangeRate>>(reader)
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
    fun COINGECKO_API_URL(ids: List<String> = emptyList(), currency: String = "usd", per_page: Int = 50, page: Int = 1): HttpUrl =
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

    val jackson = jacksonObjectMapper().apply { configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false) }
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
  val circulating_supply: String? = "0",
  val total_supply: String? = "0",
  val last_updated: String? = "0"
) {

  fun isValid() = symbol != "" && market_cap != -1.0

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
      .setCirculatingSupply(circulating_supply?.byteBuffer())
      .setTotalSupply(total_supply?.byteBuffer())
      .setLastUpdated(Instant.parse(last_updated).toEpochMilli())
}

fun main() {

  System.out.println("4.6984928".byteBuffer())

  val bat = """
    [
    {
      "id": "aeternity",
      "symbol": "ae",
      "name": "Aeternity",
      "image": "https://assets.coingecko.com/coins/images/1091/large/aeternity.png?1547035060",
      "current_price": 0.551062,
      "market_cap": 146674154,
      "market_cap_rank": 53,
      "total_volume": 55717439,
      "high_24h": 0.559853,
      "low_24h": 0.544336,
      "price_change_24h": 0.00439826,
      "price_change_percentage_24h": 0.80456,
      "market_cap_change_24h": 1236263,
      "market_cap_change_percentage_24h": 0.85003,
      "circulating_supply": 266071425.9601,
      "total_supply": 273685830.0,
      "ath": 5.69,
      "ath_change_percentage": -90.3007,
      "ath_date": "2018-04-29T03:50:39.593Z",
      "roi": {
        "times": 0.9680788374384243,
        "currency": "usd",
        "percentage": 96.80788374384242
      },
      "last_updated": "2019-04-16T10:06:36.662Z"
    },
    {
    "id": "arcblock",
    "symbol": "abt",
    "name": "Arcblock",
    "image": "https://assets.coingecko.com/coins/images/2341/large/arcblock.png?1547036543",
    "current_price": 0.253459011376833,
    "market_cap": 24985989.3415282,
    "market_cap_rank": 148,
    "total_volume": 12436347.1120452,
    "high_24h": 0.289096278899177,
    "low_24h": 0.24427203977284,
    "price_change_24h": -0.0218976264987244,
    "price_change_percentage_24h": -7.95246000520266,
    "market_cap_change_24h": -2158668.02024425,
    "market_cap_change_percentage_24h": -7.95246000520266,
    "circulating_supply": "98580000.0",
    "total_supply": 186000000,
    "ath": 1.65301512540725,
    "ath_change_percentage": -85.0826522022429,
    "ath_date": "2018-05-06T00:08:52.717Z",
    "roi": {
      "times": 1.9427570131267298,
      "currency": "eth",
      "percentage": 194.27570131267296
    },
    "last_updated": "2019-04-16T10:06:36.662Z"
  }
  ]
  """.trimIndent()

  val elems = CoinGeckoTokenExchangeProvider.jackson.readValue<List<CoinGeckoExchangeRate>>(bat)
  elems.forEach { System.out.println(it) }
}