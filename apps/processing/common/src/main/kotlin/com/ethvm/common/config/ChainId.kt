package com.ethvm.common.config

enum class ChainId(val number: Int) {

  Mainnet(1),
  Ropsten(3),
  Dev(17);

  companion object {

    fun forName(name: String) = values().firstOrNull { it.name.toLowerCase() == name.toLowerCase() }

    fun forHex(hex: String) = forNumber(Integer.parseInt(hex.replace("0x", ""), 16))

    fun forNumber(number: Int) = values().firstOrNull { it.number == number }
  }
}
