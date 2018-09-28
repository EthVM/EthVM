package io.enkrypt.bolt.serdes

import com.sun.xml.internal.ws.encoding.soap.DeserializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.core.BlockSummary

class RLPBlockSummarySerde : Serde<BlockSummary> {

  private val serializer: RLPBlockSummarySerializer = RLPBlockSummarySerializer()
  private val deserializer: RLPBlockSummaryDeserializer = RLPBlockSummaryDeserializer()

  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun close() {}

  override fun serializer(): Serializer<BlockSummary> = serializer

  override fun deserializer(): Deserializer<BlockSummary> = deserializer
}

class RLPBlockSummarySerializer : Serializer<BlockSummary> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun serialize(topic: String, data: BlockSummary?): ByteArray =
    if (data == null) ByteArray(0) else data.encoded

  override fun close() {}
}

class RLPBlockSummaryDeserializer : Deserializer<BlockSummary> {

  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun deserialize(topic: String, data: ByteArray?): BlockSummary? {
    if (data == null) {
      return null
    }
    return try {
      BlockSummary(data)
    } catch (e: Exception) {
      throw DeserializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
