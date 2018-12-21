package io.enkrypt.kafka.streams.models

import io.enkrypt.common.extensions.hexData20

object StaticAddresses {

  val EtherZero = "0000000000000000000000000000000000000000".hexData20()
  val EtherMax = "ffffffffffffffffffffffffffffffffffffffff".hexData20()
}
