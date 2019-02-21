package io.enkrypt.kafka.streams.util

import io.kotlintest.Spec
import io.kotlintest.TestCase
import io.kotlintest.TestResult
import io.kotlintest.extensions.TestListener
import org.apache.kafka.streams.TopologyTestDriver
import org.koin.standalone.StandAloneContext.getKoin

object KafkaStreamsTestListener : TestListener {

  override fun afterSpecClass(spec: Spec, results: Map<TestCase, TestResult>) {
    val koin = getKoin()

    val blockProcessorDriver = koin.koinContext.get<TopologyTestDriver>(name = "blockProcessorDriver")
    blockProcessorDriver.close()

    val stateProcessorDriver = koin.koinContext.get<TopologyTestDriver>(name = "stateProcessorDriver")
    stateProcessorDriver.close()

  }

}
