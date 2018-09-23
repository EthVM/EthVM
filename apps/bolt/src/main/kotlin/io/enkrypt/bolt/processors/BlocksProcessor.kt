package io.enkrypt.bolt.processors

import com.mongodb.MongoClient
import com.mongodb.MongoClientURI
import com.mongodb.client.model.UpdateOptions
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.avro.AccountState
import io.enkrypt.avro.Block
import io.enkrypt.avro.BlockInfo
import io.enkrypt.avro.Transaction
import io.enkrypt.bolt.AppConfig
import io.enkrypt.bolt.extensions.toByteArray
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.bson.Document
import org.ethereum.util.ByteUtil
import org.koin.standalone.KoinComponent
import org.koin.standalone.inject
import java.util.*


class BlocksProcessor : KoinComponent, Processor {

  private val appConfig: AppConfig by inject()
  private val kafkaProps: Properties by inject(name = "kafka.Properties")

  private val mongoUri: MongoClientURI by inject()
  private val mongoClient: MongoClient by inject()
  private val mongoDB by lazy { mongoClient.getDatabase(mongoUri.database!!) }

  private val blocksCollection by lazy { mongoDB.getCollection("blocks") }
  private val addressStateCollection by lazy { mongoDB.getCollection("address-state") }

  private val logger = KotlinLogging.logger {}

  private lateinit var streams: KafkaStreams

  override fun onPrepareProcessor() {


    // Avro Serdes - Specific
    val serdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to appConfig.schemaRegistryUrl)

    val blockSerde = SpecificAvroSerde<Block>().apply { configure(serdeProps, false) }
    val blockInfoSerde = SpecificAvroSerde<BlockInfo>().apply { configure(serdeProps, false) }
    val accountStateSerde = SpecificAvroSerde<AccountState>().apply { configure(serdeProps, false) }
    val transactionSerde = SpecificAvroSerde<Transaction>().apply { configure(serdeProps, false) }

    // Create stream builder
    val builder = StreamsBuilder()

    builder
      .stream("account-state", Consumed.with(Serdes.ByteArray(), accountStateSerde))
      .foreach(::persistAccountState)

    builder.stream("blocks", Consumed.with(Serdes.ByteArray(), blockSerde))
      .foreach(::persistBlock)

    builder
      .stream("info", Consumed.with(Serdes.ByteArray(), blockInfoSerde))
      .map { k, v -> KeyValue(ByteUtil.byteArrayToLong(k), v) }
      .foreach(::persistBlockInfo)

    builder.stream("transactions", Consumed.with(Serdes.ByteArray(), transactionSerde))
      .foreach(::persistTransaction)


//    // Raw Blocks Stream
//    val (blocksTopic) = appConfig.topicsConfig
//
//    val blocks = builder
//      .stream(blocksTopic, Consumed.with(Serdes.String(), blockSerde))
//      .map{ key, block -> KeyValue(key, Block.newBuilder(block).build())}
//
//    val latestBlocksWindow = blocks
//      .groupByKey(Serialized.with(Serdes.String(), blockSerde))
//      .reduce(
//        { memo, next -> next },
//        Materialized.`as`(Stores.persistentKeyValueStore("latest-blocks"))
//      )
//
//    val blockWithOperation = blocks.join(
//      latestBlocksWindow,
//      { block, lastSeenBlock ->
//
//        val isCanonical = block.getStatus() == KBlock.Status.CANONICAL.ordinal
//        var wasCanonical = lastSeenBlock?.getStatus() == KBlock.Status.CANONICAL.ordinal
//
//        if(lastSeenBlock != null) {
//          wasCanonical = (lastSeenBlock.getStatus() == KBlock.Status.CANONICAL.ordinal) ?: false
//        }
//
//        val operation = when(Pair(isCanonical, wasCanonical)) {
//          Pair(true, true) -> BlockOperation.Apply
//          Pair(true, false) -> BlockOperation.Apply
//          Pair(false, true) -> BlockOperation.Reverse
//          else -> BlockOperation.Ignore
//        }
//
//        Pair(operation, block)
//      },
//      Joined.with(Serdes.String(), blockSerde, blockSerde)
//    )
//
//    blockWithOperation
//      .map { key, (op, block) -> KeyValue(key, Pair(op, KBlock(block)))}
//      .map(::calculateStatistics)
//      .foreach(::persistToMongo)

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

//  private fun calculateStatistics(key: String, blockWithOp: Pair<BlockOperation, KBlock>): KeyValue<String, Pair<BlockOperation, KBlock>> {
//
//    val block = blockWithOp.second
//    val blockTimeMs = Period(block.timestamp, DateTime.now()).millis
//
//    var numSuccessfulTxs = 0
//    var numFailedTxs = 0
//    val totalGasPrice = BigDecimal(0)
//    val totalTxsFees = BigDecimal(0)
//    val totalTxs = 0
//    var totalInternalTxs = 0
//
//    val txs = block.transactions
//    txs.forEach { txn ->
//
//      if (txn.status == KTransaction.RECEIPT_STATUS_SUCCESSFUL) {
//        numSuccessfulTxs += 1
//      } else {
//        numFailedTxs += 1
//      }
//
//      totalGasPrice.add(txn.gasPrice!!)
//
//      val txsFee = txn.gasUsed!!.times(txn.gasPrice!!)
//      totalTxsFees.add(txsFee)
//
//      totalInternalTxs += txn.trace!!.transfers.size
//    }
//
//    val txsCount = txs.size.toBigDecimal()
//
//    var avgGasPrice = BigDecimal.ZERO
//    var avgTxsFees = BigDecimal.ZERO
//
//    if (txsCount.intValueExact() > 0) {
//      avgGasPrice = totalGasPrice.divide(txsCount, RoundingMode.CEILING)
//      avgTxsFees = totalTxsFees.divide(txsCount, RoundingMode.CEILING)
//    }
//
//    block.stats = KBlockStats(
//      blockTimeMs,
//      numFailedTxs,
//      numSuccessfulTxs,
//      totalTxs,
//      totalInternalTxs,
//      avgGasPrice,
//      avgTxsFees
//    )
//
//    return KeyValue(key, blockWithOp)
//  }
//

  private fun persistBlock(hash: ByteArray, block: Block) {

    val options = UpdateOptions().upsert(true)

    val idQuery = Document(mapOf("_id" to block.getHash().toHex()))
    val update = Document(mapOf("\$set" to block.toDocument()))

    blocksCollection.updateOne(idQuery, update, options)
    logger.debug { "Block stored: ${hash.toHex()}, $idQuery" }
  }

  private fun persistAccountState(address: ByteArray, state: AccountState?) {

    val options = UpdateOptions().upsert(true)

    val idQuery = Document(mapOf("_id" to address.toHex()?.substring(10)))

    if(state != null) {

      val update = Document(mapOf("\$set" to state.toDocument()))

      addressStateCollection.updateOne(idQuery, update, options)
      logger.info { "Account state stored: $idQuery " }
    } else {

      addressStateCollection.deleteOne(idQuery)
      logger.info { "Account state deleted: $idQuery " }

    }

  }

  private fun persistBlockInfo(number: Long, info: BlockInfo) {

    val options = UpdateOptions().upsert(true)

    val idQuery = Document(mapOf("_id" to info.getHash().toHex()))
    val isCanonical = info.getMainChain()

    val update = if (isCanonical) {
      Document(mapOf("\$set" to Document(mapOf(
        "number" to number,
        "difficulty" to info.getDifficulty().toByteArray()
      ))))
    } else {
      Document(mapOf("\$unset" to Document(mapOf(
        "number" to 1,
        "difficulty" to 1
      ))))
    }

    blocksCollection.updateOne(idQuery, update, options)
    logger.debug { "Block info stored: $number, $idQuery, $update" }
  }

  private fun persistTransaction(blockHash: ByteArray, tx: Transaction) {

    val options = UpdateOptions().upsert(true)

    val idQuery = Document(mapOf("_id" to blockHash.toHex()?.substring(10)))
    val update = Document(mapOf("\$push" to Document(mapOf("transactions" to tx.toDocument()))))

    blocksCollection.updateOne(idQuery, update, options)
    logger.debug { "Transaction stored: ${blockHash.toHex()}, $idQuery, $update" }
  }

  override fun start() {
    streams.apply {
      logger.info { "Performing cleanup" }.also { cleanUp() }
      logger.info { "Starting blocks processor..." }.also { start() }
    }

    // Add shutdown hook to respond to SIGTERM and gracefully close Kafka Streams
    Runtime.getRuntime().addShutdownHook(Thread(streams::close))
  }

}
