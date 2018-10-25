package io.enkrypt.bolt.kafka.serdes

import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.apache.kafka.common.serialization.Serde
import org.apache.kafka.common.serialization.Serializer
import org.ethereum.core.BlockStatistics

class RLPBlockStatisticsSerde : Serde<BlockStatistics> {

  private val serializer: RLPBlockStatisticsSerializer = RLPBlockStatisticsSerializer()
  private val deserializer: RLPBlockStatisticsDeserializer = RLPBlockStatisticsDeserializer()

  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun close() {}

  override fun serializer(): Serializer<BlockStatistics> = serializer

  override fun deserializer(): Deserializer<BlockStatistics> = deserializer
}

class RLPBlockStatisticsSerializer : Serializer<BlockStatistics> {
  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun serialize(topic: String, data: BlockStatistics?): ByteArray =
    if (data == null) ByteArray(0) else data.encoded

  override fun close() {}
}

class RLPBlockStatisticsDeserializer : Deserializer<BlockStatistics> {

  override fun configure(configs: Map<String, *>, isKey: Boolean) {}

  override fun deserialize(topic: String, data: ByteArray?): BlockStatistics? {
    if (data == null || data.isEmpty()) {
      return null
    }
    return try {
      BlockStatistics(data)
    } catch (e: Exception) {
      throw SerializationException("Error deserializing value", e)
    }
  }

  override fun close() {}
}
