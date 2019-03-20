package io.enkrypt.kafka.streams.utils

import io.enkrypt.kafka.streams.config.KafkaTopic
import org.apache.kafka.streams.kstream.KStream

fun <K, V> KStream<K, V>.toTopic(topic: KafkaTopic<K, V>) =
  topic.sinkFor(this)

