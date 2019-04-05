package com.ethvm.common.config

enum class ChainId(val number: Int) {

  MainNet(1),
  Morden(2),
  Ropsten(3),
  Rinkleby(4),
  UbiqMainNet(8),
  UbiqTestNest(9),
  RootStockMainNet(30),
  RootStockTestNet(31),
  Kovan(42),
  EthClassicMainNet(61),
  EthClassicTestNet(62),
  EWasmTestNet(66),
  GethPrivateChains(1337),
  Görli(6284),
  Stureby(314158)
}
