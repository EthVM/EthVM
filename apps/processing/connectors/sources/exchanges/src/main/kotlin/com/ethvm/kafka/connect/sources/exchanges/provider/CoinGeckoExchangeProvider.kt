package com.ethvm.kafka.connect.sources.exchanges.provider

import com.ethvm.avro.exchange.CoinExchangeRateKeyRecord
import com.ethvm.avro.exchange.CoinExchangeRateRecord
import com.ethvm.avro.exchange.TokenExchangeRateKeyRecord
import com.ethvm.avro.exchange.TokenExchangeRateRecord
import com.ethvm.common.extensions.byteBuffer
import com.ethvm.kafka.connect.sources.exchanges.provider.CoinGeckoExchangeProvider.Companion.jackson
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

class CoinGeckoExchangeProvider(
  options: Map<String, Any> = DEFAULT_OPTS,
  okHttpClient: OkHttpClient = CoinGeckoExchangeProvider.okHttpClient,
  jackson: ObjectMapper = CoinGeckoExchangeProvider.jackson
) : ExchangeProvider {

  override val id: String = CoinGeckoExchangeProvider::class.simpleName!!

  private val providers: List<ExchangeProvider>

  init {
    val providers: MutableList<ExchangeProvider> = mutableListOf()

    if (options.containsKey("CoinGeckoCurrencyExchangeProvider")) {
      @Suppress("UNCHECKED_CAST")
      val currencyOpts: Map<String, Any> = when (val raw = options["CoinGeckoCurrencyExchangeProvider"]) {
        is Map<*, *> -> raw as Map<String, Any>
        is String -> jackson.readValue(raw)
        else -> CoinGeckoCurrencyExchangeProvider.DEFAULT_OPTS
      }
      providers.add(CoinGeckoCurrencyExchangeProvider(currencyOpts, okHttpClient, jackson))
    }

    if (options.containsKey("CoinGeckoTokenExchangeProvider")) {
      @Suppress("UNCHECKED_CAST")
      val tokensOpts: Map<String, Any> = when (val raw = options["CoinGeckoTokenExchangeProvider"]) {
        is Map<*, *> -> raw as Map<String, Any>
        is String -> jackson.readValue(raw)
        else -> CoinGeckoTokenExchangeProvider.DEFAULT_OPTS
      }
      providers.add(CoinGeckoTokenExchangeProvider(tokensOpts, okHttpClient, jackson))
    }

    this.providers = providers
  }

  override fun fetch(): List<SourceRecord> =
    providers
      .map { it.fetch() }
      .flatten()

  companion object {
    val okHttpClient = OkHttpClient()

    val jackson = jacksonObjectMapper().apply { configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false) }

    val DEFAULT_OPTS: Map<String, Any> = mapOf(
      "CoinGeckoCurrencyExchangeProvider" to CoinGeckoCurrencyExchangeProvider.DEFAULT_OPTS,
      "CoinGeckoTokenExchangeProvider" to CoinGeckoTokenExchangeProvider.DEFAULT_OPTS
    )
  }
}

class CoinGeckoCurrencyExchangeProvider(
  options: Map<String, Any> = DEFAULT_OPTS,
  private val okHttpClient: OkHttpClient = CoinGeckoExchangeProvider.okHttpClient,
  private val jackson: ObjectMapper = CoinGeckoExchangeProvider.jackson
) : ExchangeProvider {

  override val id: String = CoinGeckoCurrencyExchangeProvider::class.simpleName!!

  private val topic: String by options
  private val currency: String by options
  private val coinIds: List<String> by options

  private val logger = KotlinLogging.logger {}

  private val sourcePartition = mapOf("id" to "coingecko")
  private val sourceOffset = emptyMap<String, Any>()

  @Throws(Exception::class)
  override fun fetch(): List<SourceRecord> {

    val url = COINGECKO_API_URL(coinIds, currency)

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

    logger.debug { "Parsing into coin rates" }

    val rates = jackson.readValue<Map<String, Map<String, String>>>(reader)

    return rates
      .map { (k, v) ->

        val currency = v.filterKeys { it.length == 3 }.keys.first()

        val keyRecord = CoinExchangeRateKeyRecord.newBuilder()
          .setId("$k-$currency")
          .build()

        val valueRecord = CoinExchangeRateRecord.newBuilder()
          .setId("$k-$currency")
          .setCurrency(currency)
          .also {
            // Store rest of the elements
            v.forEach { (key, value) ->
              when {
                key.contains("market_cap") -> it.setMarketCap(value.toDouble())
                key.contains("24h_vol") -> it.setVol24h(value.toDouble())
                key.contains("24h_change") -> it.setChange24h(value.toDouble())
                key.contains("last_updated_at") -> it.setLastUpdated(value.toLong())
                else -> it.setPrice(value.toDouble())
              }
            }
          }
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

  companion object {

    @Suppress("FunctionName")
    fun COINGECKO_API_URL(ids: List<String> = emptyList(), currency: String = "usd"): HttpUrl =
      HttpUrl.Builder()
        .scheme("https")
        .host("api.coingecko.com")
        .addPathSegment("api")
        .addPathSegment("v3")
        .addPathSegment("simple")
        .addPathSegment("price")
        .addQueryParameter("ids", ids.joinToString(separator = ","))
        .addQueryParameter("vs_currencies", currency)
        .addQueryParameter("include_market_cap", "true")
        .addQueryParameter("include_24hr_vol", "true")
        .addQueryParameter("include_24hr_change", "true")
        .addQueryParameter("include_last_updated_at", "true")
        .build()

    val DEFAULT_OPTS: Map<String, Any> = mapOf(
      "topic" to "coin-exchange-rates",
      "currency" to "usd",
      "coinIds" to listOf("ethereum,bitcoin,monero")
    )
  }
}

class CoinGeckoTokenExchangeProvider(
  options: Map<String, Any> = DEFAULT_OPTS,
  private val okHttpClient: OkHttpClient = CoinGeckoExchangeProvider.okHttpClient,
  private val jackson: ObjectMapper = CoinGeckoExchangeProvider.jackson
) : ExchangeProvider {

  override val id: String = CoinGeckoTokenExchangeProvider::class.simpleName!!

  private val topic: String by options
  private val tokenIds: List<TokenIdEntry> by options
  private val currency: String by options
  private val perPage: Int by options

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

        val rates = jackson.readValue<List<CoinGeckoTokenExchangeRate>>(reader)
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

    val DEFAULT_OPTS: Map<String, Any> = mapOf(
      "topic" to "token-exchange-rates",
      "currency" to "usd",
      "tokenIds" to (
        CoinGeckoTokenExchangeProvider::class.java
          .getResourceAsStream("/coingecko/coingecko-eth.json")
          ?.let { stream -> jackson.readValue<List<TokenIdEntry>>(stream) } ?: emptyList()
        ),
      "perPage" to 50
    )
  }
}

data class TokenIdEntry(
  val id: String,
  val address: String
)

data class CoinGeckoTokenExchangeRate(
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
