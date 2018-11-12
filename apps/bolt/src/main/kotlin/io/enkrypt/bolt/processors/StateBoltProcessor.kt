package io.enkrypt.bolt.processors

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.*
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.bolt.extensions.toBigInteger
import io.enkrypt.bolt.extensions.toByteBuffer
import io.enkrypt.bolt.extensions.toDocument
import io.enkrypt.bolt.extensions.toHex
import io.enkrypt.bolt.kafka.processors.MongoProcessor
import io.enkrypt.bolt.kafka.serdes.BoltSerdes
import io.enkrypt.kafka.models.AccountState
import io.enkrypt.kafka.models.TokenTransfer
import io.enkrypt.kafka.models.TokenTransferKey
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.Serialized
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.bson.Document
import java.math.BigInteger
import java.nio.ByteBuffer
import java.util.*

/**
 * This processor processes addresses balances and type (if is a smart contract or not).
 */
class StateBoltProcessor : AbstractBoltProcessor() {

  override val id: String = "state-processor"

  private val kafkaProps: Properties = Properties(baseKafkaProps)
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
    }

  override val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {

    // Create stream builder
    val builder = StreamsBuilder()

    val (_, _, accountStateTopic, tokenTransfersTopic) = appConfig.kafka.topicsConfig

    val fungibleBalances = builder
      .stream("fungible-token-movements", Consumed.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))
      .groupByKey(Serialized.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))
      .reduce(
        { memo, next -> FungibleTokenBalanceRecord
          .newBuilder(memo)
          .setAmount(ByteBuffer.wrap(memo.getAmount().toBigInteger()!!.add(next.getAmount().toBigInteger()).toByteArray()))
          .build()
        },
        Materialized.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance())
      )

    fungibleBalances
      .toStream()
      .to("fungible-token-balances", Produced.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))

    //

    val blockMetricsStream = builder
      .stream("block-metrics", Consumed.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    val blockMetricsByDayCount = blockMetricsStream
      .groupByKey(Serialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))
      .count(Materialized.with(BoltSerdes.MetricKey(), Serdes.Long()))

    blockMetricsStream
      .groupByKey(Serialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))
      .reduce(
        { memo, next ->

          val metricBuilder = MetricRecord.newBuilder(memo)

          if(next.getIntValue() != null){ metricBuilder.setIntValue(memo.getIntValue() + next.getIntValue()) }
          if(next.getLongValue() != null){ metricBuilder.setLongValue(memo.getLongValue() + next.getLongValue()) }
          if(next.getFloatValue() != null){ metricBuilder.setFloatValue(memo.getFloatValue() + next.getFloatValue()) }
          if(next.getDoubleValue() != null){ metricBuilder.setDoubleValue(memo.getDoubleValue() + next.getDoubleValue()) }

          if(next.getBigIntegerValue() != null){
            val memoBigInt = memo.getBigIntegerValue().toBigInteger()!!
            val nextBigInt = next.getBigIntegerValue().toBigInteger()
            metricBuilder.setBigIntegerValue(memoBigInt.add(nextBigInt).toByteBuffer())
          }

          metricBuilder.build()
        },
        Materialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric())
      ).join(
        blockMetricsByDayCount,
        { aggMetric, metricsCount ->

          if(metricsCount < 2) {
            aggMetric
          } else {

            val metricBuilder = MetricRecord.newBuilder(aggMetric)

            if(aggMetric.getIntValue() != null){ metricBuilder.setIntValue(aggMetric.getIntValue() / metricsCount.toInt()) }
            if(aggMetric.getLongValue() != null){ metricBuilder.setLongValue(aggMetric.getLongValue() / metricsCount) }
            if(aggMetric.getFloatValue() != null){ metricBuilder.setFloatValue(aggMetric.getFloatValue() / metricsCount ) }
            if(aggMetric.getDoubleValue() != null){ metricBuilder.setDoubleValue(aggMetric.getDoubleValue() / metricsCount) }

            if(aggMetric.getBigIntegerValue() != null){
              val aggBigInt = aggMetric.getBigIntegerValue().toBigInteger()!!
              metricBuilder.setBigIntegerValue(aggBigInt.divide(BigInteger.valueOf(metricsCount)).toByteBuffer())
            }

            metricBuilder.build()

          }

        },
        Materialized.with(BoltSerdes.MetricKey(), BoltSerdes.Metric())
      ).toStream()
      .to("block-statistics", Produced.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)
  }

}

class AccountStateMongoProcessor : MongoProcessor<String?, AccountState?>() {

  private val accountsCollection: MongoCollection<Document> by lazy {
    mongoDB.getCollection(config.mongo.accountsCollection)
  }

  override val batchSize = 100

  private var batch = mapOf<String?, AccountState?>()
  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: String?, value: AccountState?) {
    batch += key to value
    if (batch.size == batchSize) {
      tryToWrite()
    }
  }

  private fun tryToWrite() {
    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val replaceOptions = ReplaceOptions().upsert(true)

    val ops = batch.toList()
      .filter { it.first != null }
      .map<Pair<String?, AccountState?>, WriteModel<Document>> { pair ->

        val address = pair.first
        val state = pair.second

        val filter = Document(mapOf("_id" to address))

        if (state == null || state.isEmpty) {
          UpdateOneModel(filter, Document(mapOf("deleted" to true)))
        } else {
          val update = state.toDocument(address!!)
          ReplaceOneModel(filter, update, replaceOptions)
        }
      }

    try {

      accountsCollection.bulkWrite(ops)

      context.commit()

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} accounts updated in $elapsedMs ms" }

      batch = emptyMap()

    } catch (e: Exception) {
      logger.error { "Failed to update accounts. $e" }
    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}

class TokenTransferMongoProcessor : MongoProcessor<TokenTransferKey, TokenTransfer?>() {

  private val tokenTransfersCollection: MongoCollection<Document> by lazy {
    mongoDB.getCollection(config.mongo.tokenTransfersCollection)
  }

  private val tokenBalancesCollection: MongoCollection<Document> by lazy {
    mongoDB.getCollection(config.mongo.tokenBalancesCollection)
  }

  override val batchSize = 100

  private var batch = mapOf<TokenTransferKey, TokenTransfer?>()
  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun process(key: TokenTransferKey, value: TokenTransfer?) {
    batch += key to value
    if (batch.size == batchSize) {
      tryToWrite()
    }
  }

  private fun tryToWrite() {
    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val updateOptions = UpdateOptions().upsert(true)
    val replaceOptions = ReplaceOptions().upsert(true)

    val ops = batch.toList()
      .filter { it.second != null }
      .map { Pair(it.first, it.second!!) }
      .map { pair ->

        val key = pair.first
        val transfer = pair.second

        val contractAddress = transfer.address.toHex()!!
        val fromAddress = transfer.from.toHex()!!
        val toAddress = transfer.to.toHex()!!

        val balanceUpdates = listOf(
          erc721BalanceUpdate(contractAddress, fromAddress, toAddress, transfer.tokenId)
        ).flatten()

        val transferReplace = ReplaceOneModel(
          Document(mapOf("_id" to key.toDocument())), transfer.toDocument(key), replaceOptions
        )

        Pair(transferReplace, balanceUpdates)
      }

    try {

      val transfers = ops.map { it.first }
      val balanceUpdates = ops.map { it.second }.flatten()

      tokenTransfersCollection.bulkWrite(transfers)
      tokenBalancesCollection.bulkWrite(balanceUpdates)

      context.commit()

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} token transfers processed in $elapsedMs ms" }

      batch = emptyMap()

    } catch (e: Exception) {
      logger.error { "Failed to update. $e" }
    }

  }

  private fun erc20BalanceUpdate(contract: String, address: String, balance: BigInteger?, updateOptions: UpdateOptions): List<WriteModel<Document>> =
    when (balance) {
      null -> emptyList()
      BigInteger.ZERO -> listOf(DeleteOneModel(Document(mapOf("_id" to mapOf("c" to contract, "a" to address)))))
      else -> listOf(
        UpdateOneModel(
          Document(mapOf("_id" to mapOf("c" to contract, "a" to address))),
          Document(mapOf("\$set" to mapOf("contract" to contract, "address" to address, "balance" to balance))),
          updateOptions
        )
      )
    }

  private fun erc721BalanceUpdate(contract: String, fromAddress: String, toAddress: String, tokenId: BigInteger?): List<WriteModel<Document>> =
    when (tokenId) {
      null -> emptyList()
      else -> {

        var result = emptyList<WriteModel<Document>>()

        // remove the token from one address
        result += UpdateOneModel(
          Document(mapOf("_id" to mapOf("c" to contract, "a" to fromAddress))),
          Document(mapOf("\$pull" to mapOf("contract" to contract, "address" to fromAddress, "tokenIds" to tokenId)))
        )

        // add the token to the other address
        result += UpdateOneModel(
          Document(mapOf("_id" to mapOf("c" to contract, "a" to toAddress))),
          Document(mapOf("\$push" to mapOf("contract" to contract, "address" to toAddress, "tokenIds" to tokenId)))
        )

        // delete from balance if it's empty
        result += DeleteOneModel(Document(mapOf("_id" to mapOf("c" to contract, "a" to fromAddress), "tokenIds" to mapOf("\$size" to 0))))

        result
      }
    }


  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}
