package io.enkrypt.bolt.kafka.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import java.math.BigInteger

class BigIntegerSerde : Serde<BigInteger> {

  private val serializer: BigIntegerSerializer = BigIntegerSerializer()
  private val deserializer: BigIntegerDeserializer = BigIntegerDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<BigInteger> = deserializer

  override fun serializer(): Serializer<BigInteger> = serializer

  override fun close() {}
}

class BigIntegerSerializer : Serializer<BigInteger> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: BigInteger?): ByteArray =
    if (data == null) ByteArray(0) else data.toByteArray()

  override fun close() {
  }
}

class BigIntegerDeserializer : Deserializer<BigInteger> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): BigInteger? {
    if (data == null) {
      return null
    }
    return try {
      BigInteger(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
