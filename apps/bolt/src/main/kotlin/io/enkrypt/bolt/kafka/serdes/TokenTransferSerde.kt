package io.enkrypt.bolt.kafka.serdes

import io.enkrypt.kafka.models.TokenTransfer
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer

class TokenTransferSerde : Serde<TokenTransfer?> {

  private val serializer: TokenTransferSerializer = TokenTransferSerializer()
  private val deserializer: TokenTransferDeserializer = TokenTransferDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<TokenTransfer?> = deserializer

  override fun serializer(): Serializer<TokenTransfer?> = serializer

  override fun close() {}
}

class TokenTransferSerializer : Serializer<TokenTransfer?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: TokenTransfer?): ByteArray? = data?.encoded

  override fun close() {
  }
}

class TokenTransferDeserializer : Deserializer<TokenTransfer?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): TokenTransfer? {
    if (data == null || data.isEmpty()) {
      return null
    }
    return try {
      TokenTransfer.newBuilder(data).build()
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
