package io.enkrypt.bolt.processors

import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.model.UpdateOptions
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.Transaction
import io.enkrypt.bolt.AppConfig
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.extensions.transaction
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.bson.Document
import org.ethereum.util.ByteUtil
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.Properties

class TransactionsProcessor : KoinComponent, Processor {

  private val appConfig: AppConfig by inject()
  private val baseKafkaProps: Properties by inject(name = "kafka.Properties")

  private val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, "transactions-processor")
    }

  private val mongoUri: MongoClientURI by inject()
  private val mongoClient: MongoClient by inject()
  private val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database!!) }
  private val mongoSession by lazy { mongoClient.startSession() }

  private val blocksCollection by lazy { mongoDB.getCollection("blocks") }
  private val transactionsCollection by lazy { mongoDB.getCollection("transactions") }

  private val logger = KotlinLogging.logger {}

  private lateinit var streams: KafkaStreams

  override fun onPrepareProcessor() {
    // Avro Serdes - Specific
    val serdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)

    val transactionSerde = SpecificAvroSerde<Transaction>().apply { configure(serdeProps, false) }

    // Create stream builder
    val builder = StreamsBuilder()

    builder.stream(appConfig.topicsConfig.transactions, Consumed.with(Serdes.ByteArray(), transactionSerde))
      .map { k, v -> KeyValue(ByteUtil.toHexString(k), v) }
      .foreach(::persistTransaction)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

  private fun persistTransaction(blockHash: String, tx: Transaction) {
    val options = UpdateOptions().upsert(true)

    val txHash = tx.getHash()?.toHex()

    val idBlockQuery = Document(mapOf("_id" to blockHash))
    val updateBlock = Document(
      mapOf(
        "\$push" to Document(mapOf("transactions" to txHash)),
        "\$inc" to Document(mapOf("stats.${if (tx.getReceipt().getStatus() == 1) "numSuccessfulTxs" else "numFailedTxs"}" to 1)),
        "\$inc" to Document(mapOf("stats.totalTxs" to 1))
      )
    )

    val idTxQuery = Document(mapOf("_id" to txHash))
    val txDocument = Document(mapOf("\$set" to tx.toDocument(blockHash)))

    mongoSession.transaction {
      blocksCollection.updateOne(idBlockQuery, updateBlock, options)
      transactionsCollection.updateOne(idTxQuery, txDocument, options)
    }.also {
      when {
        it.isLeft() -> logger.info { "Transaction stored: $blockHash, $idBlockQuery, $updateBlock" }
        it.isRight() -> logger.error { "Transaction not stored: $blockHash" }
      }
    }
  }

  override fun start() {
    streams.apply {
      logger.info { "Performing cleanup" }.also { cleanUp() }
      logger.info { "Starting transactions processor..." }.also { start() }
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }

}
