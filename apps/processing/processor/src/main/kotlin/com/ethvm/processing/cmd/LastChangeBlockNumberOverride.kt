package com.ethvm.processing.cmd

import mu.KotlinLogging
import java.util.concurrent.ExecutorService
import kotlin.system.exitProcess

class LastChangeBlockNumberOverride : AbstractCliktCommand(
  help = "Force caches to override their last change block number with db values"
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

    logger.info { "Overriding last change block numbers" }

    val initFutures = processors
      .map { processor ->
        logger.info { "Overriding for ${processor.javaClass}" }
        executor.submit { processor.setLastChangeBlockNumberFromDb() }
      }
      .toList()

    initFutures.forEach { it.get() }

    logger.info { "Overrides completed" }

    processors
      .forEach { it.close() }

    exitProcess(0)

  }
}
