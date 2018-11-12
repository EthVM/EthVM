package io.enkrypt.bolt.processors

import arrow.core.Option
import arrow.core.getOrElse
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.*
import io.enkrypt.avro.capture.BlockSummaryRecord
import io.enkrypt.avro.common.DataWord
import io.enkrypt.avro.processing.*
import io.enkrypt.bolt.contracts.ERC20Abi
import io.enkrypt.bolt.contracts.ERC721Abi
import io.enkrypt.bolt.eth.utils.StandardTokenDetector
import io.enkrypt.bolt.extensions.*
import io.enkrypt.bolt.kafka.serdes.BoltSerdes
import io.enkrypt.bolt.kafka.transformers.MongoTransformer
import io.enkrypt.bolt.models.Contract
import mu.KotlinLogging
import org.apache.commons.lang3.ArrayUtils
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.kstream.TransformerSupplier
import org.apache.kafka.streams.processor.Cancellable
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.processor.PunctuationType
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.Stores
import org.bson.Document
import org.ethereum.core.BlockSummary
import org.ethereum.crypto.HashUtil
import org.ethereum.util.ByteUtil
import java.math.BigInteger
import java.nio.ByteBuffer
import java.time.Instant
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.*

data class TransactionData(val fungibleBalanceDeltas: List<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>>,
                           val nonFungibleBalanceDeltas: List<KeyValue<NonFungibleTokenBalanceKeyRecord, ByteBuffer>>,
                           val contractCreations: Map<ContractKeyRecord, Pair<ContractCreationRecord, Boolean>>,
                           val contractSuicides: Map<ContractKeyRecord, Pair<ContractSuicideRecord, Boolean>>) {

  fun concat(other: TransactionData) = TransactionData(
    fungibleBalanceDeltas + other.fungibleBalanceDeltas,
    nonFungibleBalanceDeltas + other.nonFungibleBalanceDeltas,
    contractCreations + other.contractCreations,
    contractSuicides + other.contractSuicides
  )

}

data class BlockStatistics(val totalTxs: Int,
                           val numSuccessfulTxs: Int,
                           val numFailedTxs: Int,
                           val numPendingTxs: Int,
                           val totalDifficulty: BigInteger,
                           val totalGasPrice: BigInteger,
                           val avgGasPrice: BigInteger,
                           val totalTxsFees: BigInteger,
                           val avgTxsFees: BigInteger) {

  companion object {
    fun forBlockSummary(summary: BlockSummaryRecord): BlockStatistics {
      val block = summary.getBlock()

      val receipts = block.getTransactions()

      val totalDifficulty = summary.getTotalDifficulty().toBigInteger()
      val numPendingTxs = summary.getNumPendingTxs()
      val totalTxs = receipts.size

      var numSuccessfulTxs = 0
      var numFailedTxs = 0
      var totalInternalTxs = 0

      var totalGasPrice = BigInteger.ZERO
      var totalTxsFees = BigInteger.ZERO

      receipts.forEach { receipt ->

        totalInternalTxs += receipt.getInternalTxs().size
        if (receipt.isSuccess()) numSuccessfulTxs += 1 else numFailedTxs += 1

        totalGasPrice = totalGasPrice.add(receipt.getGasPrice().toBigInteger())
        totalTxsFees = totalTxsFees.add(receipt.getGasPrice().toBigInteger())

      }

      var avgGasPrice = BigInteger.ZERO
      var avgTxsFees = BigInteger.ZERO

      if(totalTxs > 0) {
        avgGasPrice = totalGasPrice.divide(totalTxs.toBigInteger())
        avgTxsFees = totalTxsFees.divide(totalTxs.toBigInteger())
      }

      return BlockStatistics(totalTxs, numSuccessfulTxs, numFailedTxs, numPendingTxs, totalDifficulty!!, totalGasPrice, avgGasPrice, totalTxsFees, avgTxsFees)
    }
  }


}


/**
 *
 */
class BlockSummaryBoltProcessor : AbstractBoltProcessor() {

  companion object {
    val ETHER_CONTRACT_ADDRESS = ByteUtil.hexStringToBytes("0000000000000000000000000000000000000000").toByteBuffer()!!
  }

  override val id: String = "block-summaries-processor"

  private val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
      put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000L)
    }

  override val logger = KotlinLogging.logger {}

  override fun onPrepareProcessor() {

    // Create stream builder
    val builder = StreamsBuilder()

    builder.addStateStore(GatedBlockSummaryTransformer.blockSummariesStore())
    builder.addStateStore(GatedBlockSummaryTransformer.metadataStore())

    val (blocksTopic) = appConfig.kafka.topicsConfig

    val blockSummaryStream = builder
      .stream("blocks", Consumed.with(Serdes.Long(), BoltSerdes.BlockSummaryRecord()))

    val gatedStream = blockSummaryStream
      .transform(
        TransformerSupplier { GatedBlockSummaryTransformer() },
        *GatedBlockSummaryTransformer.STORE_NAMES
      )

    gatedStream.foreach { k, _ -> logger.info { "Processing block number = $k" } }

    //

    val txData = gatedStream
      .mapValues { _, v ->
        val etherDeltas = this.generateEtherBalanceDeltas(v)
        val tokenData = this.generateTokenData(v)
        etherDeltas.concat(tokenData)
      }

    txData
      .flatMap { _, v -> v.fungibleBalanceDeltas }
      .mapValues { v -> FungibleTokenBalanceRecord.newBuilder().setAmount(ByteBuffer.wrap(v.toByteArray())).build() }
      .to("fungible-token-movements", Produced.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))

    txData
      .flatMap { _, v -> v.nonFungibleBalanceDeltas }
      .mapValues { v -> NonFungibleTokenBalanceRecord.newBuilder().setAddress(v).build() }
      .to("non-fungible-token-balances", Produced.with(BoltSerdes.NonFungibleTokenBalanceKey(), BoltSerdes.NonFungibleTokenBalance()))

    txData
      .flatMap{ _, v -> v.contractCreations.map{ c ->

        val key = c.key
        val value = c.value.first
        val reverse = c.value.second

        if(reverse)
          KeyValue(key, null)   // tombstone
        else
          KeyValue(key, value)

      }}
      .to("contract-creations", Produced.with(BoltSerdes.ContractKey(), BoltSerdes.ContractCreation()))

    txData
      .flatMap{ _, v -> v.contractSuicides.map{ c ->

        val key = c.key
        val value = c.value.first
        val reverse = c.value.second

        if(reverse)
          KeyValue(key, null)   // tombstone
        else
          KeyValue(key, value)

      }}
      .to("contract-suicides", Produced.with(BoltSerdes.ContractKey(), BoltSerdes.ContractSuicide()))


    // statistics

    blockSummaryStream
      .flatMap { _, summary ->

        val (totalTxs, numSuccessfulTxs, numFailedTxs, numPendingTxs, totalDifficulty, totalGasPrice, avgGasPrice, totalTxsFees, avgTxsFees) = BlockStatistics.forBlockSummary(summary)

        val instant = Instant.ofEpochSecond(summary.getBlock().getHeader().getTimestamp())
        val dateTime = ZonedDateTime.ofInstant(instant, ZoneOffset.UTC)
        val startOfDayEpoch = dateTime.truncatedTo(ChronoUnit.DAYS).toInstant().epochSecond

        val keyBuilder = MetricKeyRecord
          .newBuilder()
          .setDate(startOfDayEpoch)

        listOf(
          KeyValue(keyBuilder.setName("totalTxs").build(), MetricRecord.newBuilder().setIntValue(totalTxs).build()),
          KeyValue(keyBuilder.setName("numSuccessfulTxs").build(), MetricRecord.newBuilder().setIntValue(numSuccessfulTxs).build()),
          KeyValue(keyBuilder.setName("numFailedTxs").build(), MetricRecord.newBuilder().setIntValue(numFailedTxs).build()),
          KeyValue(keyBuilder.setName("numPendingTxs").build(), MetricRecord.newBuilder().setIntValue(numPendingTxs).build()),
          KeyValue(keyBuilder.setName("totalDifficulty").build(), MetricRecord.newBuilder().setBigIntegerValue(totalDifficulty.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName("totalGasPrice").build(), MetricRecord.newBuilder().setBigIntegerValue(totalGasPrice.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName("avgGasPrice").build(), MetricRecord.newBuilder().setBigIntegerValue(avgGasPrice.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName("totalTxsFees").build(), MetricRecord.newBuilder().setBigIntegerValue(totalTxsFees.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName("avgTxsFees").build(), MetricRecord.newBuilder().setBigIntegerValue(avgTxsFees.toByteBuffer()).build())
        )

      }.to("block-metrics", Produced.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    // Generate the topology
    val topology = builder.build()

    // Create streams
    streams = KafkaStreams(topology, kafkaProps)

  }

  private fun generateEtherBalanceDeltas(summary: BlockSummaryRecord): TransactionData {

    val reverse = summary.getReverse()

    var fungible = listOf<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>>()

    // rewards

    summary.getRewards()
      .forEach { e ->
        fungible += generateBalanceDeltas(
          ETHER_CONTRACT_ADDRESS,
          ETHER_CONTRACT_ADDRESS,
          e.getAddress(),
          e.getReward().toBigInteger()!!,
          reverse
        )
      }

    // ether transactions

    summary.getBlock().getTransactions()
      .map { it.getTx() }
      .filter { !(it.getFrom() == null || it.getTo() == null || it.getValue() == null) }
      .forEach { e ->
        fungible += generateBalanceDeltas(
          ETHER_CONTRACT_ADDRESS,
          e.getFrom(),
          e.getTo(),
          e.getValue().toBigInteger()!!,
          reverse
        )
      }

    return TransactionData(fungible, emptyList(), emptyMap(), emptyMap())
  }

  private fun generateTokenData(summary: BlockSummaryRecord): TransactionData {

    val reverse = summary.getReverse()

    var fungible = listOf<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>>()
    var nonFungible = listOf<KeyValue<NonFungibleTokenBalanceKeyRecord, ByteBuffer>>()
    var contractCreations= mapOf<ContractKeyRecord, Pair<ContractCreationRecord, Boolean>>()
    var contractSuicides = mapOf<ContractKeyRecord, Pair<ContractSuicideRecord, Boolean>>()

    summary.getBlock().getTransactions()
      .forEach { receipt ->

        val tx = receipt.getTx()

        // contract creation

        if((tx.getTo() == null || tx.getTo().capacity() == 0) && tx.getData() != null) {

          val contractAddress = ByteBuffer.wrap(HashUtil.calcNewAddr(tx.getTo().toByteArray(), tx.getNonce().toByteArray()))

          val key = ContractKeyRecord
            .newBuilder()
            .setAddress(contractAddress)
            .build()

          val value = ContractCreationRecord
            .newBuilder()
            .setCreator(tx.getFrom())
            .setBlockHash(summary.getBlock().getHeader().getHash())
            .setTxHash(tx.getHash())
            .setData(tx.getData())
            .build()

          contractCreations += key to Pair(value, reverse)
        }

        // contract suicides

        receipt.getDeletedAccounts()
          .forEach{ address ->

            val key = ContractKeyRecord
              .newBuilder()
              .setAddress(address)
              .build()

            val value = ContractSuicideRecord
              .newBuilder()
              .setBlockHash(summary.getBlock().getHeader().getHash())
              .setTxHash(tx.getHash())
              .build()

            contractSuicides += key to Pair(value, reverse)

          }

        // token transfers

        receipt.getLogInfos().forEach { log ->

          val topics: List<DataWord> = log.getTopics().toList()
          val data = log.getData().array()

          // ERC20 transfer event has the same signature as ERC721 so we use this initial match to detect any
          // transfer event

          ERC20Abi.matchEvent(log.getTopics())
            .filter { it.name == ERC20Abi.EVENT_TRANSFER }
            .fold({ Unit }, { _ ->

              val erc20Transfer = ERC20Abi.decodeTransferEvent(data, topics)
              val erc721Transfer = if (erc20Transfer.isDefined()) Option.empty() else ERC721Abi.decodeTransferEvent(data, topics)

              erc20Transfer
                .filter { it.amount != BigInteger.ZERO }
                .fold({ Unit }, { builder ->
                  fungible += generateBalanceDeltas(tx.getFrom(), builder.from, builder.to, builder.amount.toBigInteger()!!, reverse)
                })

              erc721Transfer
                .fold({ Unit }, { builder ->

                  val key = NonFungibleTokenBalanceKeyRecord.newBuilder()
                    .setContract(tx.getFrom())
                    .setTokenId(builder.tokenId)
                    .build()

                  nonFungible += KeyValue(key, if (reverse) builder.from else builder.to)

                })

            })

        }

      }

    return TransactionData(fungible, nonFungible, contractCreations, contractSuicides)
  }

  private fun generateBalanceDeltas(contract: ByteBuffer, from: ByteBuffer, to: ByteBuffer, amount: BigInteger, reverse: Boolean): List<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>> {
    var result = listOf<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>>()

    val fromKey = FungibleTokenBalanceKeyRecord
      .newBuilder()
      .setContract(contract)
      .setAddress(from)
      .build()

    val toKey = FungibleTokenBalanceKeyRecord
      .newBuilder()
      .setContract(contract)
      .setAddress(to)
      .build()

    // much like double entry book keeping we create a delta for the from address and a delta for the to address
    // taking into account whether or not it's a reversal

    if (reverse) {

      result += KeyValue(fromKey, amount)
      result += KeyValue(toKey, amount.negate())

    } else {

      result += KeyValue(fromKey, amount.negate())
      result += KeyValue(toKey, amount)

    }

    return result
  }


  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }

}

class GatedBlockSummaryTransformer : Transformer<Long?, BlockSummaryRecord?, KeyValue<Long, BlockSummaryRecord>> {

  companion object {

    val STORE_NAME_SUMMARIES = "gated-block-summaries"
    val STORE_NAME_METADATA = "gated-block-summaries-metadata"

    val STORE_NAMES = arrayOf(STORE_NAME_SUMMARIES, STORE_NAME_METADATA)

    val META_HIGH = "high"

    fun blockSummariesStore() = Stores.keyValueStoreBuilder(
      Stores.persistentKeyValueStore(STORE_NAME_SUMMARIES),
      Serdes.Long(), BoltSerdes.BlockSummaryRecord()
    )

    fun metadataStore() = Stores.keyValueStoreBuilder(
      Stores.persistentKeyValueStore(STORE_NAME_METADATA),
      Serdes.String(), Serdes.Long()
    )
  }

  private lateinit var context: ProcessorContext

  private lateinit var summariesStore: KeyValueStore<Long, BlockSummaryRecord?>
  private lateinit var metaStore: KeyValueStore<String, Long?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!
    this.summariesStore = context.getStateStore(STORE_NAME_SUMMARIES) as KeyValueStore<Long, BlockSummaryRecord?>
    this.metaStore = context.getStateStore(STORE_NAME_METADATA) as KeyValueStore<String, Long?>
  }

  override fun transform(number: Long?, summary: BlockSummaryRecord?): KeyValue<Long, BlockSummaryRecord>? {

    if (number == null) {
      logger.warn("Null number received, ignoring")
      return null
    }

    if (summary == null) {
      logger.warn("Null summary received, ignoring")
      return null
    }

    val lastSummary = summariesStore.get(number)

    if (lastSummary == null) {

      // we've never seen any summary for this block number before
      onNewBlock(number, summary)

    } else if (lastSummary.getBlock().getHeader().getHash() != summary.getBlock().getHeader().getHash()) {

      // we've received a summary for block number n which does not have a block hash which matches the one we
      // have in the state store indicating a chain re-org is taking place
      onReorg(number, summary)

    }

    return null
  }

  private fun onNewBlock(number: Long, summary: BlockSummaryRecord) {

    logger.debug { "New block, number = $number" }

    // record the number -> summary
    summariesStore.put(number, summary)
    metaStore.put(META_HIGH, number)

    // forward on for more processing
    context.forward(number, summary)

  }

  private fun onReorg(number: Long, summary: BlockSummaryRecord) {

    logger.info { "Re-org triggered by block number = $number" }

    // first we reverse all the summaries from highest number back to this number in preparation for the new summaries to come
    // as part of the new chain

    // TODO see if this can be made more efficient with ranging,
    // documentation says ranging provides no ordering guarantees

    var numberToReverse = metaStore.get(META_HIGH) ?: 0L
    var summaryToReverse: BlockSummaryRecord?

    do {
      summaryToReverse = summariesStore.delete(numberToReverse)

      if (summaryToReverse != null) {

        val reversal = BlockSummaryRecord
          .newBuilder(summaryToReverse)
          .setReverse(true)
          .build()

        context.forward(numberToReverse, reversal)

        logger.info { "Reversing number = $number" }
      }

      numberToReverse -= 1L
    } while (summaryToReverse != null)

    // commit and publish the new version of the summary for this block number

    summariesStore.put(number, summary)
    context.forward(number, summary)

  }

  override fun close() {

  }

}


class BlockMongoTransformer : MongoTransformer<Long, BlockSummary?>() {

  private val blocksCollection: MongoCollection<Document>by lazy {
    mongoDB.getCollection(config.mongo.blocksCollection)
  }

  override val batchSize = 50
  private val batch: MutableList<Pair<Long, BlockSummary?>> = ArrayList()

  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun transform(key: Long, value: BlockSummary?): KeyValue<Long, BlockSummary?>? {

    if (value != null) {
      batch.add(Pair(key, value))
    }

    if (batch.size == batchSize) {
      tryToWrite()
    }

    // we will forward later
    return null
  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val replaceOptions = ReplaceOptions().upsert(true)

    val blocksOps = batch
      .map { pair ->

        val number = pair.first
        val summary = pair.second

        val blockQuery = Document(mapOf("_id" to number))

        Option.fromNullable(summary)
          .map { s ->

            val block = s.block
            val blockUpdate = block.toDocument(s)
            ReplaceOneModel(blockQuery, blockUpdate, replaceOptions)

          }.getOrElse {
            // delete the block entry
            DeleteOneModel<Document>(blockQuery)
          }

      }

    try {

      val bulkOptions = BulkWriteOptions().ordered(false)
      blocksCollection.bulkWrite(blocksOps, bulkOptions)

      // forward to downstream processors and commit
      batch.forEach { pair -> context.forward(pair.first, pair.second) }

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.info { "${batch.size} blocks stored in $elapsedMs ms" }

      batch.clear()

    } catch (e: Exception) {

      // TODO handle error
      logger.error { "Failed to store blocks. $e" }

    }

  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }

}

class TokenDetectorTransformer : MongoTransformer<Long, BlockSummary?>() {

  private val accountsCollection: MongoCollection<Document>by lazy {
    mongoDB.getCollection(config.mongo.accountsCollection)
  }

  override val batchSize = 50
  private val batch: MutableList<Contract> = ArrayList()

  private var scheduledWrite: Cancellable? = null

  override fun init(context: ProcessorContext) {
    super.init(context)
    this.scheduledWrite = context.schedule(timeoutMs, PunctuationType.WALL_CLOCK_TIME) { _ -> tryToWrite() }
  }

  override fun transform(key: Long, value: BlockSummary?): KeyValue<Long, BlockSummary?>? {

    if (value == null) return null

    val block = value.block
    val txs = block?.transactionsList ?: emptyList()

    txs
      .asSequence()
      .filter { it.isContractCreation }
      .map { c ->
        val type = StandardTokenDetector.detect(ArrayUtils.nullToEmpty(c.data))

        logger.info { "Smart contract detected: ${c.contractAddress.toHex()} | Type: $type" }

        val contract = Contract(c.contractAddress, type.first)

        batch.add(contract)
      }

    if (batch.size == batchSize) {
      tryToWrite()
    }

    return KeyValue(key, value) // Don't change the state as this transformer just only reads information on the fly
  }

  private fun tryToWrite() {

    if (!running || batch.isEmpty()) {
      return
    }

    val startMs = System.currentTimeMillis()

    val contractOps = batch.map { contract ->
      // Mongo
      val updateOptions = UpdateOptions().upsert(true)

      // Contracts
      val query = Document(mapOf("_id" to contract.address.toHex()))
      val document = Document(mapOf("\$set" to contract.toDocument()))

      UpdateOneModel<Document>(query, document, updateOptions)
    }

    try {

      val bulkOptions = BulkWriteOptions().ordered(false)
      accountsCollection.bulkWrite(contractOps, bulkOptions)

      val elapsedMs = System.currentTimeMillis() - startMs
      logger.debug { "${batch.size} contracts accounts updated in $elapsedMs ms" }

      batch.clear()

    } catch (e: Exception) {

      // TODO handle error
      logger.error { "Failed to store smart contracts detection. Error: $e" }

    }
  }

  override fun close() {
    running = false
    scheduledWrite?.cancel()
  }
}
