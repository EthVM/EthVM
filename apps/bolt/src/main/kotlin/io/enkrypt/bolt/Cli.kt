package io.enkrypt.bolt

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option

class Cli : CliktCommand() {

  // Bolt / Kafka
  private val applicationIdOption: String by option(help = "Identifier for the stream processing application").default(DEFAULT_APPLICATION_ID)
  private val bootstrapServersOption: String by option(help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster").default(DEFAULT_BOOTSTRAP_SERVERS)
  private val startingOffsetOption: String by option(help = "From which offset is going to start Bolt processing events").default(DEFAULT_AUTO_OFFSET)

  private val rawBlocksTopicOption: String by option(help = "Name of the raw blocks stream topic on which Bolt will listen").default(DEFAULT_RAW_BLOCK_TOPIC)
  private val rawPendingTxsTopicOption: String by option(help = "Name of the raw blocks stream topic on which Bolt will listen").default(DEFAULT_RAW_PENDING_TXS_TOPIC)

  // General
  private val verbose: Boolean by option(help = "Enable verbose mode").flag()

  override fun run() {
    Bolt(
      applicationIdOption,
      bootstrapServersOption,
      startingOffsetOption,
      rawBlocksTopicOption,
      rawPendingTxsTopicOption
    ).start()
  }

  companion object {
    const val DEFAULT_APPLICATION_ID = "bolt"
    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka:9092"
    const val DEFAULT_AUTO_OFFSET = "earliest"

    const val DEFAULT_RAW_BLOCK_TOPIC = "raw-blocks"
    const val DEFAULT_RAW_PENDING_TXS_TOPIC = "raw-pending-txs"
  }
}
