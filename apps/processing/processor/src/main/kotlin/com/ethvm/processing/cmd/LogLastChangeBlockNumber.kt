package com.ethvm.processing.cmd

import mu.KotlinLogging
import java.util.concurrent.ExecutorService
import kotlin.system.exitProcess

class LogLastChangeBlockNumber : AbstractCliktCommand(
  help = "Log out last change block number for various caches"
) {

  private val logger = KotlinLogging.logger {}

  override fun run() {

    val app = inject()
    val koin = app.koin

    // instantiate
    logger.info { "Instantiating processors: $processorsList" }
    val processors = instantiateProcessors(processorsList)

    // register shutdown hook

    val executor = koin.get<ExecutorService>()

    logger.info { "Logging out last change block numbers" }

    val initFutures = processors
      .map { processor ->
        logger.info { "Logging out for ${processor.javaClass}" }
        executor.submit { processor.logLastChangeBlockNumber() }
      }
      .toList()

    initFutures.forEach { it.get() }

    logger.info { "Finished" }

    processors
      .forEach { it.close() }

    exitProcess(0)

  }
}
