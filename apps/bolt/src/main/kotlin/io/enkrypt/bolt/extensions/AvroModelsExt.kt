package io.enkrypt.bolt.extensions

import io.enkrypt.bolt.models.avro.Block
import java.nio.ByteBuffer

fun Block?.rewind(): Block? {
  if (this == null) {
    return null
  }

  for (i in 0..24) {
    val field = get(i)
    if (field is ByteBuffer) {
      field.rewind()
    }
  }

  return this
}
