package com.ethvm.kafka.streams.utils

import com.ethvm.avro.common.TraceLocationRecord
import org.apache.avro.specific.SpecificRecord
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.streams.processor.TimestampExtractor
import org.joda.time.DateTime

class BlockEventTimestampExtractor : TimestampExtractor {

  override fun extract(record: ConsumerRecord<Any, Any>, previousTimestamp: Long): Long =
    when (val value = record.value()) {
      null -> previousTimestamp
      is SpecificRecord -> {

        val timestampField = value.schema.getField("timestamp")
        val traceLocationField = value.schema.getField("traceLocation")

        val timestampValue = when {
            timestampField != null -> value.get(timestampField.pos())
            traceLocationField != null -> {
              val traceLocation = value.get(traceLocationField.pos()) as TraceLocationRecord
              traceLocation.timestamp
            }
            else -> record.timestamp()
        }

        when(timestampValue) {
          is Long -> timestampValue
          is DateTime -> timestampValue.millis
          else -> throw IllegalArgumentException("Timestamp field must be a Long or DateTime")
        }

      }
      else -> record.timestamp()  // default to record timestamp
    }

}
