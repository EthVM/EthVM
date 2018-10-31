package io.enkrypt.bolt.kafka.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.util.ByteUtil.hexStringToBytes
import org.ethereum.util.ByteUtil.toHexString

class AddressSerde : Serde<String?> {

  private val serializer: AddressSerializer = AddressSerializer()
  private val deserializer: AddressDeserializer = AddressDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<String?> = deserializer

  override fun serializer(): Serializer<String?> = serializer

  override fun close() {}
}

class AddressSerializer : Serializer<String?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: String?): ByteArray? =
    if (data == null) null else hexStringToBytes(data)

  override fun close() {
  }
}

class AddressDeserializer : Deserializer<String?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): String? {
    if (data == null || data.isEmpty()) { return null }
    return try {
      toHexString(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
