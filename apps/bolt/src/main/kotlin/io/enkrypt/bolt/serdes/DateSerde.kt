package io.enkrypt.bolt.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.util.ByteUtil
import java.util.*


class DateSerde : Serde<Date> {

  private val serializer: DateSerializer = DateSerializer()
  private val deserializer: DateDeserializer = DateDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<Date> = deserializer

  override fun serializer(): Serializer<Date> = serializer

  override fun close() {}
}

class DateSerializer : Serializer<Date> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: Date?): ByteArray =
    if (data == null) ByteArray(0) else ByteUtil.longToBytes(data.time)

  override fun close() {
  }
}

class DateDeserializer : Deserializer<Date> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): Date? {
    if (data == null) {
      return null
    }
    return try {
      Date(ByteUtil.byteArrayToLong(data))
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
