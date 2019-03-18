package io.enkrypt.kafka.streams.utils

import io.enkrypt.avro.capture.BlockHeaderRecord
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.streams.processor.TimestampExtractor
import java.lang.IllegalArgumentException

object BlockTimeExtractor : TimestampExtractor {

  override fun extract(record: ConsumerRecord<Any, Any>?, previousTimestamp: Long): Long =
    when (record) {
      is BlockHeaderRecord -> record.getTimestamp() * 1000  // unix time converted to milliseconds since epoch
      else -> System.currentTimeMillis()
    }

}
