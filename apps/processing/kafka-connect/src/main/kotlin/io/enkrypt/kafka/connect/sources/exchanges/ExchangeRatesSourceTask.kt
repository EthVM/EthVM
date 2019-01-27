package io.enkrypt.kafka.connect.sources.exchanges

import com.beust.klaxon.Klaxon
import com.beust.klaxon.PropertyStrategy
import io.enkrypt.kafka.connect.utils.Versions
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.SchemaBuilder
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.source.SourceRecord
import org.apache.kafka.connect.source.SourceTask
import java.net.URL
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.concurrent.TimeUnit
import kotlin.reflect.KProperty

class ExchangeRatesSourceTask : SourceTask() {

  private val klaxon = Klaxon()
    .propertyStrategy(object : PropertyStrategy {

      private val ignored = arrayListOf(
        "roi",
        "ath",
        "ath_change_percentage",
        "ath_date"
      )

      override fun accept(property: KProperty<*>): Boolean = property.name !in ignored
    })

  private lateinit var topic: String
  private var syncIntervalSeconds: Int = -1

  private var lastSyncAt: Instant = Instant.EPOCH

  override fun start(props: MutableMap<String, String>) {
    topic = ExchangeRatesSourceConnector.Config.topic(props)
    syncIntervalSeconds = ExchangeRatesSourceConnector.Config.syncInterval(props)
  }

  override fun stop() {
    // do nothing
  }

  override fun version(): String = Versions.CURRENT

  override fun poll(): List<SourceRecord> {
    if (!shouldSync()) {
      Thread.sleep(SLEEP)
      return emptyList()
    }

    val sourcePartition = mapOf("url" to COINGECKO_API_URL)
    val sourceOffset = emptyMap<String, Any>()

    var rates: List<ExchangeRate> = emptyList()

    var page = 1
    do {
      val api = COINGECKO_API_URL.replace("{PAGE}", page.toString())
      val stream = URL(api).openStream()
      val raw = klaxon.parseArray<ExchangeRate>(stream) ?: emptyList()
      rates += raw
      page = page.inc()
    } while (raw.isNotEmpty())

    val records = rates.map { e ->
      SourceRecord(
        sourcePartition,
        sourceOffset,
        topic,
        ExchangeRateMetadataKeySchema,
        ExchangeRateKey(e.id).toStruct(),
        ExchangeRateMetadataSchema,
        e.toStruct()
      )
    }

    lastSyncAt = Instant.now()

    return records
  }

  private fun shouldSync(): Boolean = ChronoUnit.SECONDS.between(lastSyncAt, Instant.now()) > syncIntervalSeconds

  companion object {

    const val COINGECKO_API_URL =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page={PAGE}&sparkline=false"

    val SLEEP: Long = TimeUnit.MINUTES.toMillis(1)

    val ExchangeRateMetadataKeySchema: SchemaBuilder = SchemaBuilder(Schema.Type.STRUCT)
      .name("io.enkrypt.avro.exchange.ExchangeRateKeyRecord")
      .field("symbol", Schema.STRING_SCHEMA)

    val ExchangeRateMetadataSchema: SchemaBuilder = SchemaBuilder(Schema.Type.STRUCT)
      .name("io.enkrypt.avro.exchange.ExchangeRateRecord")
      .field("id", Schema.STRING_SCHEMA)
      .field("symbol", Schema.STRING_SCHEMA)
      .field("name", Schema.STRING_SCHEMA)
      .field("image", Schema.STRING_SCHEMA)
      .field("current_price", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("market_cap", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("market_cap_rank", Schema.OPTIONAL_INT32_SCHEMA)
      .field("total_volume", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("high_24h", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("low_24h", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("price_change_24h", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("price_change_percentage_24h", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("market_cap_change_24h", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("market_cap_change_percentage_24h", Schema.OPTIONAL_FLOAT64_SCHEMA)
      .field("circulating_supply", Schema.OPTIONAL_STRING_SCHEMA)
      .field("total_supply", Schema.OPTIONAL_INT64_SCHEMA)
      .field("last_updated", Schema.OPTIONAL_STRING_SCHEMA)

    data class ExchangeRateKey(
      val symbol: String
    ) {

      fun toStruct(): Struct =
        Struct(ExchangeRateMetadataKeySchema).apply {
          put("symbol", symbol)
        }
    }

  }

  data class ExchangeRate(
    val id: String,
    val symbol: String,
    val name: String,
    val image: String,
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

    fun toStruct(): Struct =
      Struct(ExchangeRateMetadataSchema).apply {
        put("id", id)
        put("symbol", symbol)
        put("name", name)
        put("image", image)
        put("current_price", current_price)
        put("market_cap", market_cap)
        put("market_cap_rank", market_cap_rank)
        put("total_volume", total_volume)
        put("high_24h", high_24h)
        put("low_24h", low_24h)
        put("price_change_24h", price_change_24h)
        put("price_change_percentage_24h", price_change_percentage_24h)
        put("market_cap_change_24h", market_cap_change_24h)
        put("market_cap_change_percentage_24h", market_cap_change_percentage_24h)
        put("circulating_supply", circulating_supply)
        put("total_supply", total_supply)
        put("last_updated", last_updated)
      }
  }

}
