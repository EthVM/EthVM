package com.ethvm.kafka.streams.utils

import com.ethvm.kafka.streams.config.KafkaTopic
import org.apache.avro.specific.SpecificRecord
import org.apache.kafka.streams.kstream.KStream

fun <K, V> KStream<K, V>.toTopic(topic: KafkaTopic<K, V>) =
  topic.sinkFor(this)
