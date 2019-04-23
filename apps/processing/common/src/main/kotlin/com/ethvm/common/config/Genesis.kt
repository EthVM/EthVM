package com.ethvm.common.config

import com.beust.klaxon.Klaxon

enum class Genesis(private val filename: String) {

  Frontier("frontier"),
  Ropsten("ropsten");

  fun load(): GenesisFile {
    val input = javaClass.getResourceAsStream("/genesis/$filename.json")
    return Klaxon().parse<GenesisFile>(input)!!
  }
}

data class PremineAccount(val balance: String)

data class GenesisFile(val accounts: Map<String, PremineAccount>)
