package io.enkrypt.bolt.kafka.extractors

import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.streams.processor.TimestampExtractor
import org.ethereum.core.BlockSummary

class BlockSummaryTimestampExtractor : TimestampExtractor {

  override fun extract(record: ConsumerRecord<Any, Any>?, previousTimestamp: Long): Long {
    var timestamp: Long = -1
    val summary = record?.value() as BlockSummary
    if (summary != null) {
      timestamp = summary.block.timestamp * 1000   // timestamp is in unix time
    }
    return if (timestamp < 0) {
      // Invalid timestamp!  Attempt to estimate a new timestamp,
      // otherwise fall back to wall-clock time (processing-time).
      if (previousTimestamp >= 0) {
        previousTimestamp
      } else {
        System.currentTimeMillis()
      }
    } else timestamp
  }

}
