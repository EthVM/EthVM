package io.enkrypt.bolt

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.default
import com.github.ajalt.clikt.parameters.options.option

class Cli : CliktCommand() {

  // Kafka
  private val applicationId: String by option(help = "Identifier for the stream processing application").default(DEFAULT_APPLICATION_ID)
  private val bootstrapServers: String by option(help = "A list of host/port pairs to use for establishing the initial connection to the Kafka cluster").default(DEFAULT_BOOTSTRAP_SERVERS)
  private val startingOffset: String by option(help = "From which offset is going to start Bolt processing events").default(DEFAULT_AUTO_OFFSET)

  private val schemaRegistryUrl: String by option(help = "Specifies in which server are stored avro schemas").default(DEFAULT_SCHEMA_REGISTRY_URL)

  private val rawBlocksTopic: String by option(help = "Name of the raw blocks stream topic on which Bolt will listen").default(DEFAULT_RAW_BLOCK_TOPIC)
  private val rawPendingTxsTopic: String by option(help = "Name of the raw blocks stream topic on which Bolt will listen").default(DEFAULT_RAW_PENDING_TXS_TOPIC)

  private val processedBlocksTopic: String by option(help = "Name of the processed blocks topic on which Bolt will write").default(DEFAULT_PROCESSED_BLOCKS_TOPIC)
  private val processedBlockStatsTopic: String by option(help = "Name of the processed block stats topic on which Bolt will write").default(DEFAULT_PROCESSED_BLOCK_STATS_TOPIC)
  private val processedTxsTopic: String by option(help = "Name of the processed pending txs topic on which Bolt will write").default(DEFAULT_PROCESSED_TXS_TOPIC)
  private val processedAccountsTopic: String by option(help = "Name of the processed accounts topic on which Bolt will write").default(DEFAULT_PROCESSED_ACCOUNTS_TOPIC)

  override fun run() {
    Bolt(
      // General
      applicationId,
      bootstrapServers,
      startingOffset,
      schemaRegistryUrl,

      // Input Topics
      rawBlocksTopic,
      rawPendingTxsTopic,

      // Output Topics
      processedBlocksTopic,
      processedBlockStatsTopic,
      processedTxsTopic,
      processedAccountsTopic
      ).start()
  }

  companion object {
    const val DEFAULT_APPLICATION_ID = "bolt"
    const val DEFAULT_BOOTSTRAP_SERVERS = "kafka:9092"
    const val DEFAULT_AUTO_OFFSET = "earliest"
    const val DEFAULT_SCHEMA_REGISTRY_URL = "http://localhost:8081"

    const val DEFAULT_RAW_BLOCK_TOPIC = "raw-blocks"
    const val DEFAULT_RAW_PENDING_TXS_TOPIC = "raw-pending-txs"

    const val DEFAULT_PROCESSED_BLOCKS_TOPIC = "blocks"
    const val DEFAULT_PROCESSED_BLOCK_STATS_TOPIC = "block-stats"
    const val DEFAULT_PROCESSED_TXS_TOPIC = "pending-txs"
    const val DEFAULT_PROCESSED_ACCOUNTS_TOPIC = "accounts"
  }
}
