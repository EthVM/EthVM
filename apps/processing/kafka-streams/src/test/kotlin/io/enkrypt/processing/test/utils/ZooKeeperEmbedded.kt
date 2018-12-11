package io.enkrypt.processing.test.utils

import mu.KotlinLogging
import org.apache.curator.test.TestingServer

class ZooKeeperEmbedded {

  private val log = KotlinLogging.logger {}

  private val server: TestingServer

  init {

    log.debug { "Starting embedded ZooKeeper server..." }
    server = TestingServer()
    log.debug { "Embedded ZooKeeper server at ${server.connectString} uses the temp directory at ${server.tempDirectory}" }

  }

  val connectString: String by lazy { server.connectString }

  val hostname: String by lazy { connectString.substring(0, connectString.lastIndexOf(':')) }

  fun stop() {
    log.debug { "Shutting down embedded ZooKeeper server at ${server.connectString}..." }
    server.close()
    log.debug { "Shutdown of embedded ZooKeeper server at ${server.connectString} completed" }
  }

}
