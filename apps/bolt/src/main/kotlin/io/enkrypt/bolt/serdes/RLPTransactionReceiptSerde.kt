package io.enkrypt.bolt.serdes

import com.sun.xml.internal.ws.encoding.soap.DeserializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.core.TransactionReceipt

class RLPTransactionReceiptSerde : Serde<TransactionReceipt> {

  private val serializer: RLPTransactionReceiptSerializer = RLPTransactionReceiptSerializer()
  private val deserializer: RLPTransactionReceiptDeserializer = RLPTransactionReceiptDeserializer()

  override fun configure(configs: MutableMap<String, *>?, isKey: Boolean) {}

  override fun deserializer(): Deserializer<TransactionReceipt> = deserializer

  override fun serializer(): Serializer<TransactionReceipt> = serializer

  override fun close() {}
}

class RLPTransactionReceiptSerializer : Serializer<TransactionReceipt> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun serialize(topic: String, receipt: TransactionReceipt?): ByteArray {
    return if (receipt == null) {
      ByteArray(0)
    } else receipt.encoded

  }

  override fun close() {}
}

class RLPTransactionReceiptDeserializer : Deserializer<TransactionReceipt> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun deserialize(topic: String, data: ByteArray?): TransactionReceipt? {
    if (data == null) {
      return null
    }
    try {
      return TransactionReceipt(data)
    } catch (e: Exception) {
      throw DeserializationException("Error deserializing value", e)
    }

  }

  override fun close() {}
}
