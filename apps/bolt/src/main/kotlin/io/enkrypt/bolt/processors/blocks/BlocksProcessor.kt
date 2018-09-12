package io.enkrypt.bolt.processors.blocks

import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.model.ReplaceOptions
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.AppConfig
import io.enkrypt.bolt.models.avro.Block
import io.enkrypt.bolt.models.Address
import io.enkrypt.bolt.models.kafka.KBlock
import io.enkrypt.bolt.processors.Processor
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.KStream
import org.bson.Document
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.*

class BlocksProcessor : KoinComponent, Processor {

  private val appConfig: AppConfig by inject()
  private val kafkaProps: Properties by inject(name = "kafka.Properties")

  private val mongoUri: MongoClientURI by inject()
  private val mongoClient: MongoClient by inject()

  private val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database!!) }
  private val mongoSession by lazy { mongoClient.startSession() }

  private val blocksCollection by lazy { mongoDB.getCollection("blocks") }
  private val addressesCollection by lazy { mongoDB.getCollection("addresses") }

  private val logger = KotlinLogging.logger {}

  private lateinit var streams: KafkaStreams

  override fun onPrepare() {
    // Avro Serdes
    val serdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)
    val blockSerde = SpecificAvroSerde<Block>().apply {
      configure(serdeProps, false)
    }

    // Create stream builder
    val builder = StreamsBuilder()

    // Raw Blocks Stream
    val (blocksTopic) = appConfig.topicsConfig
    val blocks: KStream<String, Block> = builder.stream(blocksTopic, Consumed.with(Serdes.String(), blockSerde))
    blocks
      .filter { _, block -> block.getStatus() == KBlock.Status.CANONICAL.ordinal }
      .map { key, block -> KeyValue(key, KBlock(Block.newBuilder(block).build())) }
      .map { key, block ->
        val balances = mutableListOf<Address>()

//        val blockTimeMs = Period(block.timestamp, DateTime.now()).millis
//
//        var numSuccessfulTxs = 0
//        var numFailedTxs = 0
//        val totalGasPrice = BigDecimal(0)
//        val totalTxsFees = BigDecimal(0)
//
//        val txs = block.getTransactions()
//        txs.forEach { txn ->
//
//          if (!(txn.getFrom() == null || txn.getFromBalance() === null)) {
//            balances.add(Address(txn.getFrom().toHex()!!, txn.getFromBalance().toBigDecimal()!!))
//          }
//
//          if (!(txn.getTo() == null || txn.getToBalance() === null)) {
//            balances.add(Address(txn.getTo().toHex()!!, txn.getToBalance().toBigDecimal()!!))
//          }
//
//          if (txn.getStatus().int > 0) {
//            numSuccessfulTxs += 1
//          } else {
//            numFailedTxs += 1
//          }
//
//          totalGasPrice.add(txn.getGasPrice().toBigDecimal())
//          totalTxsFees.add(txn.getGasUsed().toBigDecimal()!!.multiply(txn.getGasPrice().toBigDecimal()))
//        }
//
//        val avgGasPrice = ByteBuffer.allocate(0) //Math.round(Math.ceil(totalGasPrice * 1.0 / txs.size))
//        val avgTxsFees = ByteBuffer.allocate(0) //Math.round(Math.ceil(totalTxsFees * 1.0 / txs.size))
//
//        block.setStats(
//          BlockStats(
//            blockTimeMs, numFailedTxs, numSuccessfulTxs, avgGasPrice, avgTxsFees
//          )
//        )

        KeyValue(key, Pair(block, balances))
      }
      .foreach { _, (block, addresses) ->
        mongoSession.startTransaction()

        try {
          val replaceOptions = ReplaceOptions().upsert(true)

          val blockQuery = Document().append("_id", block.hash)
          blocksCollection.replaceOne(mongoSession, blockQuery, block.toDocument(), replaceOptions)

//          addresses.forEach { balance ->
//            val balanceQuery = Document().append("_id", balance.address)
//            addressesCollection.replaceOne(mongoSession, balanceQuery, balance.toDocument(), replaceOptions)
//          }

          mongoSession.commitTransaction()

          logger.info { "Committed block: ${block.hash}" }
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

  override fun start() {
    streams.apply {
      logger.info { "Performing cleanup" }
      cleanUp()
      logger.info { "Starting blocks processor..." }
      start()
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }

}
