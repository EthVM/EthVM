package io.enkrypt.bolt.kafka.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.util.ByteUtil
import org.ethereum.util.ByteUtil.hexStringToBytes
import org.ethereum.util.ByteUtil.toHexString

class HexStringSerde : Serde<String?> {

  private val serializer: HexStringSerializer = HexStringSerializer()
  private val deserializer: HexStringDeserializer = HexStringDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<String?> = deserializer

  override fun serializer(): Serializer<String?> = serializer

  override fun close() {}
}

class HexStringSerializer : Serializer<String?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {
  }

  override fun serialize(topic: String?, data: String?): ByteArray? {
    return if(data != null) { hexStringToBytes(data) } else null
  }

  override fun close() {
    TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
  }
}

class HexStringDeserializer : Deserializer<String?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String, data: ByteArray?): String? {
    if (data == null || data.isEmpty()) { return null }
    return try {
      toHexString(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
