package io.enkrypt.bolt.kafka.serdes

import io.enkrypt.kafka.models.Account
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.core.AccountState

class RLPAccountStateSerde : Serde<AccountState> {

  private val serializer: RLPAccountSerializer = RLPAccountSerializer()
  private val deserializer: RLPAccountDeserializer = RLPAccountDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<AccountState> = deserializer

  override fun serializer(): Serializer<AccountState> = serializer

  override fun close() {}
}

class RLPAccountSerializer : Serializer<AccountState> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: AccountState?): ByteArray =
    if (data == null) ByteArray(0) else data.encoded

  override fun close() {
  }
}

class RLPAccountDeserializer : Deserializer<AccountState> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): AccountState? {
    if (data == null) {
      return null
    }
    return try {
      AccountState(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
