package io.enkrypt.bolt.blocks

import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.model.ReplaceOptions
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.AppConfig
import io.enkrypt.bolt.models.Block
import io.enkrypt.bolt.models.BlockStats
import io.enkrypt.bolt.extensions.toDocument
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.KStream
import org.bson.Document
import org.joda.time.DateTime
import org.joda.time.Period
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.*

data class AddressBalance(
  val address: String,
  val balance: Long
) {

  fun toDocument(): Document {
    return Document()
      .append("balance", this.balance)
  }
}

class BlocksProcessor : KoinComponent {

  private val appConfig: AppConfig by inject()
  private val kafkaProps: Properties by inject(name = "kafka.Properties")

  private val mongoUri: MongoClientURI by inject()
  private val mongoClient: MongoClient by inject()

  private val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database) }

  private val blocksCollection by lazy { mongoDB.getCollection("blocks") }
  private val balancesCollection by lazy { mongoDB.getCollection("balances") }

  private val mongoSession by lazy { mongoClient.startSession() }

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
      .filter { _, block -> block.getStatus() == 1 }    // canonical blocks only
      .map { key, block -> KeyValue(key, Block.newBuilder(block).build()) }
      .map { key, block ->

        val balances = mutableListOf<AddressBalance>()

        val blockTimeMs = Period(block.getTimestamp(), DateTime.now()).millis

        var numSuccessfulTxs = 0
        var numFailedTxs = 0
        var totalGasPrice = 0L
        var totalTxsFees = 0L

        val txs = block.getTransactions()
        txs.forEach { txn ->

          if (!(txn.getFrom() == null || txn.getFromBalance() === null)) {
            balances.add(AddressBalance(txn.getFrom().toString(), txn.getFromBalance()))
          }

          if (!(txn.getTo() == null || txn.getToBalance() === null)) {
            balances.add(AddressBalance(txn.getTo().toString(), txn.getToBalance()))
          }

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
      .foreach { _, (block, balances) ->
        mongoSession.startTransaction()

        try {
          val replaceOptions = ReplaceOptions().upsert(true)

          val blockQuery = Document().append("_id", block.getHash().toString())
          blocksCollection.replaceOne(mongoSession, blockQuery, block.toDocument(), replaceOptions)

          balances.forEach { balance ->
            val balanceQuery = Document().append("_id", balance.address)
            balancesCollection.replaceOne(mongoSession, balanceQuery, balance.toDocument(), replaceOptions)
          }

          mongoSession.commitTransaction()

          logger.info { "Committed block data, Number: ${block.getNumber()}, Hash: ${block.getHash()}" }
        } catch (e: Exception) {
          e.printStackTrace()
          logger.error { "Commit error: ${e.stackTrace}" }
          mongoSession.abortTransaction()
        }
      }

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
