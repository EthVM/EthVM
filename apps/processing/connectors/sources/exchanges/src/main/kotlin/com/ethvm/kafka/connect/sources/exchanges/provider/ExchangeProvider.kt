package com.ethvm.kafka.connect.sources.exchanges.provider

import arrow.core.Option
import org.apache.kafka.connect.source.SourceRecord

interface ExchangeProvider {

  @Throws(Exception::class)
  fun fetch(): List<SourceRecord>
}

enum class ExchangeProviders {
  COIN_GECKO;

  companion object {
    fun of(name: String): Option<ExchangeProviders> =
      when (name) {
        "CoinGecko" -> Option.just(COIN_GECKO)
        else -> Option.empty()
      }
  }
}
