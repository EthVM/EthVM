package com.ethvm.processing.cmd

import mu.KotlinLogging
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

    logger.info { "Logging out last change block numbers" }

    processors
      .forEach { processor ->
        logger.info { "Logging out for ${processor.javaClass}" }
        processor.logLastChangeBlockNumber()
      }

    logger.info { "Finished" }

    processors
      .forEach { it.close() }

    exitProcess(0)
  }
}
