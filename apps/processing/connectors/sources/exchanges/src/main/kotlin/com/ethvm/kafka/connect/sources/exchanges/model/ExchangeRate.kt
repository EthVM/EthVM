package com.ethvm.kafka.connect.sources.exchanges.model

import com.ethvm.avro.exchange.TokenExchangeRateRecord

data class ExchangeRate(
  val id: String? = "",
  val symbol: String? = "",
  val name: String? = "",
  val image: String? = "",
  val address: String? = "",
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

  fun toExchangeRateRecord(builder: TokenExchangeRateRecord.Builder): TokenExchangeRateRecord.Builder =
    builder
      .setId(id)
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