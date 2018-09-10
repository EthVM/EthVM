package io.enkrypt.bolt.blocks

import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.AppConfig
import io.enkrypt.bolt.models.Block
import io.enkrypt.bolt.models.BlockStats
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.KStream
import org.joda.time.DateTime
import org.joda.time.Period
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.Properties

class BlocksProcessor : KoinComponent {

  private val appConfig: AppConfig by inject()
  private val kafkaProps: Properties by inject(name = "kafka.Properties")

  private val logger = KotlinLogging.logger {}
  private val streams: KafkaStreams

  init {
    val (rawBlocksTopic) = appConfig.topicsConfig

    // Avro Serdes
    val blockSerdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)
    val blockSerde = SpecificAvroSerde<Block>().apply {
      configure(blockSerdeProps, false)
    }

    // Create stream builder
    val builder = StreamsBuilder()

    val blocks: KStream<String, Block> = builder.stream(rawBlocksTopic, Consumed.with(Serdes.String(), blockSerde))
    blocks
      .map { key, block ->

        val balances = mutableMapOf<String, Long>()

        val blockTimeMs = Period(block.getTimestamp(), DateTime.now()).millis

        var numSuccessfulTxs = 0
        var numFailedTxs = 0
        var totalGasPrice = 0L
        var totalTxsFees = 0L

        val txs = block.getTransactions()
        txs.forEach { txn ->
          balances[txn.getFrom().toString()] = txn.getFromBalance()
          balances[txn.getTo().toString()] = txn.getToBalance()

          if (txn.getStatus() > 0) {
            numSuccessfulTxs += 1
          } else {
            numFailedTxs += 1
          }

          totalGasPrice += txn.getGasPrice()
          totalTxsFees += txn.getGasUsed() * txn.getGasPrice()
        }

        val avgGasPrice = Math.round(Math.ceil(totalGasPrice * 1.0 / txs.size))
        val avgTxsFees = Math.round(Math.ceil(totalTxsFees * 1.0 / txs.size))

        block.setStats(
          BlockStats(
            blockTimeMs, numFailedTxs, numSuccessfulTxs, avgGasPrice, avgTxsFees
          )
        )

        KeyValue(key, Pair(block, balances))
      }
      .foreach { key, value -> logger.info { "Block - Key: $key | Number: ${value.first.getNumber()} | Canonical: ${value.first.getIsCanonical()}" } }

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  fun start() {
    logger.info { "Starting blocks processor..." }

    streams.apply {
      cleanUp()
      start()
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }

}
