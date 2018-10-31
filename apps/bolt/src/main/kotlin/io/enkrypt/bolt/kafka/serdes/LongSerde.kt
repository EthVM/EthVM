package io.enkrypt.bolt.kafka.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.util.ByteUtil
import java.util.Date

class LongSerde : Serde<Long?> {

  private val serializer: LongSerializer = LongSerializer()
  private val deserializer: LongDeserializer = LongDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<Long?> = deserializer

  override fun serializer(): Serializer<Long?> = serializer

  override fun close() {}
}

class LongSerializer : Serializer<Long?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: Long?): ByteArray? =
    if (data == null) null else ByteUtil.longToBytes(data)

  override fun close() {
  }
}

class LongDeserializer : Deserializer<Long?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): Long? {
    if (data == null || data.isEmpty()) {
      return null
    }
    return try {
      ByteUtil.byteArrayToLong(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
