package io.enkrypt.bolt.serdes

import com.sun.xml.internal.ws.encoding.soap.DeserializationException
import io.enkrypt.kafka.models.Account
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer

class RLPAccountSerde : Serde<Account> {

  private val serializer: RLPAccountSerializer = RLPAccountSerializer()
  private val deserializer: RLPAccountDeserializer = RLPAccountDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<Account> = deserializer

  override fun serializer(): Serializer<Account> = serializer

  override fun close() {}
}

class RLPAccountSerializer : Serializer<Account> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: Account?): ByteArray =
    if (data == null) ByteArray(0) else data.rlpEncoded

  override fun close() {
  }
}

class RLPAccountDeserializer : Deserializer<Account> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): Account? {
    if (data == null) {
      return null
    }
    return try {
      Account(data)
    } catch (e: Exception) {
      throw DeserializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
