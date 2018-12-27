package io.enkrypt.util

import org.ethereum.crypto.ECKey

object Blockchains {

  val Coinbase = ECKey()

  object Users {

    val Bob = ECKey()
    val Alice = ECKey()
    val Terence = ECKey()
  }
}
