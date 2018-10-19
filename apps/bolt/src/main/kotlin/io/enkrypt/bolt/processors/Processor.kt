package io.enkrypt.bolt.processors

import io.enkrypt.bolt.AppConfig
import mu.KLogger
import org.apache.kafka.streams.KafkaStreams
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.Properties

interface Processor {
  fun onPrepareProcessor()
  fun start()
}

abstract class AbstractBaseProcessor : Processor, KoinComponent {

  protected abstract val id: String
  protected abstract val logger: KLogger

  protected val appConfig: AppConfig by inject()
  protected val baseKafkaProps: Properties by inject(name = "kafka.Properties")

  protected lateinit var streams: KafkaStreams

  override fun start() {

    logger.info { "Starting ${this.javaClass.simpleName}..." }

    streams.apply {
      cleanUp()
      start()
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))

  }
}
