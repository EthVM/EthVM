package com.ethvm.processing.cmd

import mu.KotlinLogging
import kotlin.system.exitProcess

class Reset : AbstractCliktCommand(help = "Reset processors state") {

  private val logger = KotlinLogging.logger {}

  override fun run() {

    inject()
    reset(processorsList)
  }

  private fun reset(processorList: List<String>) {

    // instantiate
    logger.info { "Instantiating processors: $processorList" }
    val processors = instantiateProcessors(processorList)

    processors
      .forEach {
        it.initialise()
        it.reset()
      }

    exitProcess(0)
  }
}
