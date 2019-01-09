package io.enkrypt.kafka.streams.util

import io.kotlintest.Description
import io.kotlintest.Spec
import io.kotlintest.extensions.TestListener
import org.apache.kafka.streams.TopologyTestDriver
import org.koin.standalone.StandAloneContext.getKoin

object KafkaStreamsTestListener : TestListener {

  override fun afterSpec(description: Description, spec: Spec) {
    val koin = getKoin()
    val testDriver = koin.koinContext.get<TopologyTestDriver>(name = "blockProcessorDriver")
    testDriver.close()
  }
}
