package com.ethvm.common.config

import com.beust.klaxon.Klaxon
import java.math.BigInteger

enum class Genesis(private val filename: String) {

  Mainnet("mainnet"),
  Ropsten("ropsten"),
  Dev("dev");

  fun load(): GenesisFile {
    val input = javaClass.getResourceAsStream("/genesis/$filename.json")
    return Klaxon().parse<GenesisFile>(input)!!
  }
}

data class PremineAccount(val balance: String)

data class GenesisFile(
  val chainId: Long,
  val nonce: String,
  val timestamp: Long,
  val parentHash: String,
  val hash: String,
  val extraData: String,
  val gasLimit: String,
  val difficulty: String,
  val mixHash: String,
  val coinbase: String,
  val allocations: Map<String, PremineAccount>
)
