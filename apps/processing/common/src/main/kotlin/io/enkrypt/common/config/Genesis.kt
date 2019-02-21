package io.enkrypt.common.config

import com.beust.klaxon.Klaxon

enum class Genesis(val filename: String) {

  Frontier("frontier"),
  Ropsten("ropsten");

  fun load(): GenesisFile {
    val input = Genesis::class.java.getResourceAsStream("/genesis/$filename.json")
    return Klaxon().parse<GenesisFile>(input)!!
  }

}

class GenesisFile(val alloc: Map<String, String>)
