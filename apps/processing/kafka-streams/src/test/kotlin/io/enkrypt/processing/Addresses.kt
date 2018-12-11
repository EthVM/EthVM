package io.enkrypt.processing

import io.enkrypt.processing.extensions.hex
import org.ethereum.crypto.ECKey

object Addresses {

  const val ETHER_CONTRACT = "0000000000000000000000000000000000000000"

  fun createAddress() = ECKey().address.hex()!!

}
