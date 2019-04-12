package com.ethvm.kafka.connect.sources.exchanges.provider

import org.apache.kafka.connect.source.SourceRecord

interface ExchangeProvider {

  @Throws(Exception::class)
  fun fetch(): List<SourceRecord>
}

enum class ExchangeProviders {
  COIN_GECKO;

  companion object {
    fun of(name: String): ExchangeProviders? {
      if (name == "CoinGecko") {
        return COIN_GECKO
      }
      return null
    }
  }
}