/**
 * Copyright 2015-2018 the original author or authors.
 *
 * Modified and converted to Kotlin by enKryptIO authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
package io.enkrypt.bolt.mongo.codecs

import org.bson.BsonReader
import org.bson.BsonWriter
import org.bson.codecs.Codec
import org.bson.codecs.DecoderContext
import org.bson.codecs.EncoderContext
import java.math.BigInteger
import java.util.Arrays

class BigIntegerStringCodec(
  /**
   * If > 0 left align and zero pad the String. zeroPadding specifies the total number characters of the resulting String: sign + digits
   */
  private val zeroPadding: Int = 0
) : Codec<BigInteger> {

  override fun getEncoderClass(): Class<BigInteger> = BigInteger::class.java

  override fun encode(
    writer: BsonWriter,
    value: BigInteger,
    encoderContext: EncoderContext
  ) {
    if (zeroPadding == 0) {
      writer.writeString(value.toString())
    } else {
      writer.writeString(formatBigInteger(value))
    }
  }

  override fun decode(reader: BsonReader, decoderContext: DecoderContext): BigInteger = BigInteger(reader.readString())

  private fun formatBigInteger(bd: BigInteger): String {
    val result = CharArray(zeroPadding)
    Arrays.fill(result, '0')
    result[0] = SIGNS[bd.signum() + 1]

    var s = bd.toString()
    if (s.startsWith("-")) {
      s = s.substring(1)
    }

    val source = s.toCharArray()
    System.arraycopy(source, 0, result, result.size - source.size, source.size)

    return String(result)
  }

  companion object {

    private val SIGNS = charArrayOf('-', '+', '+')
  }
}
