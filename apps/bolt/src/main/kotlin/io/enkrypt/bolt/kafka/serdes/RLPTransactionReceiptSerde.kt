package io.enkrypt.bolt.kafka.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.core.Transaction

class RLPTransactionSerde : Serde<Transaction> {

  private val serializer: RLPTransactionSerializer = RLPTransactionSerializer()
  private val deserializer: RLPTransactionDeserializer = RLPTransactionDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<Transaction> = deserializer

  override fun serializer(): Serializer<Transaction> = serializer

  override fun close() {}
}

class RLPTransactionSerializer : Serializer<Transaction> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun serialize(topic: String, receipt: Transaction?): ByteArray {
    return if (receipt == null) {
      ByteArray(0)
    } else receipt.encoded

  }

  override fun close() {}
}

class RLPTransactionDeserializer : Deserializer<Transaction> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun deserialize(topic: String, data: ByteArray?): Transaction? {
    if (data == null) {
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
