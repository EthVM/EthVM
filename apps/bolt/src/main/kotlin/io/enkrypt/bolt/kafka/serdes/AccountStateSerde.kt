package io.enkrypt.bolt.kafka.serdes

import io.enkrypt.kafka.models.AccountState
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer

class AccountStateSerde : Serde<AccountState?> {

  private val serializer: AccountStateSerializer = AccountStateSerializer()
  private val deserializer: AccountStateDeserializer = AccountStateDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<AccountState?> = deserializer

  override fun serializer(): Serializer<AccountState?> = serializer

  override fun close() {}
}

class AccountStateSerializer : Serializer<AccountState?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun serialize(topic: String?, data: AccountState?): ByteArray? = data?.encoded

  override fun close() {
  }
}

class AccountStateDeserializer : Deserializer<AccountState?> {
  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserialize(topic: String?, data: ByteArray?): AccountState? {
    if (data == null || data.isEmpty()) { return null }
    return try {
      AccountState.newBuilder(data).build()
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
