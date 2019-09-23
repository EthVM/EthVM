package com.ethvm.processing.cmd

import mu.KotlinLogging
import java.util.concurrent.ExecutorService
import kotlin.system.exitProcess

class Init : AbstractCliktCommand(help = "Initializes processors") {

  private val logger = KotlinLogging.logger {}

  override fun run() {

    val app = inject()
    val koin = app.koin

    // instantiate
    logger.info { "Instantiating processors: $processorsList" }
    val processors = instantiateProcessors(processorsList)

    // register shutdown hook

    val executor = koin.get<ExecutorService>()

    // initialise

    logger.info { "Initialising processors" }

    val initFutures = processors
      .map { processor ->
        logger.info { "Initialising ${processor.javaClass}" }
        executor.submit { processor.initialise() }
      }
      .toList()

    initFutures.forEach { it.get() }

    logger.info { "Processors successfully initialised" }

    processors
      .forEach { it.close() }

    exitProcess(0)
  }
}
