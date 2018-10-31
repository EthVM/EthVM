package io.enkrypt.bolt.kafka.serdes

import io.enkrypt.kafka.models.TokenTransferKey
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer

class TokenTransferKeySerde : Serde<TokenTransferKey?> {

  private val serializer: TokenTransferKeySerializer = TokenTransferKeySerializer()
  private val deserializer: TokenTransferKeyDeserializer = TokenTransferKeyDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<TokenTransferKey?> = deserializer

  override fun serializer(): Serializer<TokenTransferKey?> = serializer

  override fun close() {}
}

class TokenTransferKeySerializer : Serializer<TokenTransferKey?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: TokenTransferKey?): ByteArray? = data?.encoded

  override fun close() {
  }
}

class TokenTransferKeyDeserializer : Deserializer<TokenTransferKey?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): TokenTransferKey? {
    if (data == null || data.isEmpty()) {
      return null
    }
    return try {
      TokenTransferKey(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
