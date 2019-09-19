package com.ethvm.processing.cmd

import mu.KotlinLogging
import org.koin.core.Koin
import java.util.concurrent.ExecutorService

class Process : AbstractCliktCommand(help = "Process blocks") {

  private val logger = KotlinLogging.logger {}

  override fun run() {

    val app = inject()
    runAsServer(app.koin, processorsList)
  }

  private fun runAsServer(koin: Koin, processorList: List<String>) {

    // instantiate
    logger.info { "Instantiating processors: $processorList" }
    val processors = instantiateProcessors(processorList)

    // register shutdown hook

    val executor = koin.get<ExecutorService>()

    Runtime.getRuntime()
      .addShutdownHook(Thread(Runnable {

        logger.info { "Shutdown detected, stopping processors" }

        processors
          .forEach { it.stop() }

        logger.info { "All processors stopped" }
      }))

    // initialise

    logger.info { "Initialising processors" }

    val initFutures = processors
      .map { processor ->
        logger.info { "Initialising ${processor.javaClass}" }
        executor.submit{ processor.initialise() }
      }
      .toList()

    initFutures.forEach{ it.get() }

    // run

    logger.info { "Starting processors" }

    processors
      .forEach { processor ->
        logger.info { "Starting ${processor.javaClass}" }
        executor.submit(processor)
      }
  }
}
