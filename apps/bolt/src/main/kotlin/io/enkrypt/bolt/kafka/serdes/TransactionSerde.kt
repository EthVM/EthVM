package io.enkrypt.bolt.kafka.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.core.Transaction

class TransactionSerde : Serde<Transaction?> {

  private val serializer: TransactionSerializer = TransactionSerializer()
  private val deserializer: TransactionDeserializer = TransactionDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<Transaction?> = deserializer

  override fun serializer(): Serializer<Transaction?> = serializer

  override fun close() {}
}

class TransactionSerializer : Serializer<Transaction?> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun serialize(topic: String, tx: Transaction?): ByteArray? = tx?.encoded

  override fun close() {}
}

class TransactionDeserializer : Deserializer<Transaction?> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun deserialize(topic: String, data: ByteArray?): Transaction? {
    if (data == null || data.isEmpty()) {
      return null
    }
    try {
      return Transaction(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }

  }

  override fun close() {}
}
