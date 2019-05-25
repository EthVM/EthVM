package com.ethvm.kafka.streams.utils

import org.apache.avro.specific.SpecificRecord
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.streams.processor.TimestampExtractor
import org.joda.time.DateTime

class BlockEventTimestampExtractor : TimestampExtractor {

  override fun extract(record: ConsumerRecord<Any, Any>, previousTimestamp: Long): Long =
    when (val value = record.value()) {
      null -> previousTimestamp
      is SpecificRecord -> {

        // attempt to extract timestamp from
        val timestampField = value.schema.getField("timestamp")

        if(timestampField == null) {
          record.timestamp()
        } else {
          when(val fieldValue = value.get(timestampField.pos())) {
            is Long -> fieldValue
            is DateTime -> fieldValue.millis
            else -> record.timestamp()  // default to record timestamp
          }
        }

      }
      else -> record.timestamp()  // default to record timestamp
    }

}
