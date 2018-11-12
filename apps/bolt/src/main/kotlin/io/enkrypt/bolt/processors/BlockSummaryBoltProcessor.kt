package io.enkrypt.bolt.processors

import arrow.core.Option
import io.enkrypt.avro.capture.BlockSummaryRecord
import io.enkrypt.avro.common.DataWord
import io.enkrypt.avro.processing.*
import io.enkrypt.bolt.eth.utils.ERC20Abi
import io.enkrypt.bolt.eth.utils.ERC721Abi
import io.enkrypt.bolt.extensions.toBigInteger
import io.enkrypt.bolt.extensions.toByteArray
import io.enkrypt.bolt.extensions.toByteBuffer
import io.enkrypt.bolt.BoltSerdes
import io.enkrypt.bolt.models.BlockStatistic
import io.enkrypt.bolt.models.BlockStatistics
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.Transformer
import org.apache.kafka.streams.kstream.TransformerSupplier
import org.apache.kafka.streams.processor.ProcessorContext
import org.apache.kafka.streams.state.KeyValueStore
import org.apache.kafka.streams.state.Stores
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

    val (blocksSummariesTopic) = appConfig.kafka.topicsConfig

    val blockSummaryStream = builder
      .stream(blocksSummariesTopic, Consumed.with(Serdes.Long(), BoltSerdes.BlockSummaryRecord()))

    val gatedStream = blockSummaryStream
      .transform(
        TransformerSupplier { GatedBlockSummaryTransformer() },
        *GatedBlockSummaryTransformer.STORE_NAMES
      )

    gatedStream.foreach { k, _ -> logger.info { "Processing block number = $k" } }

    // generate various events based on tx data

    val txEvents = gatedStream
      .mapValues { _, v ->
        val etherDeltas = this.generateEtherBalanceDeltas(v)
        val tokenData = this.generateTokenData(v)
        etherDeltas.concat(tokenData)
      }

    // forward the tx events to their relevant topics

    txEvents
      .flatMap { _, v -> v.fungibleBalanceDeltas }
      .mapValues { v -> FungibleTokenBalanceRecord.newBuilder().setAmount(ByteBuffer.wrap(v.toByteArray())).build() }
      .to("fungible-token-movements", Produced.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))

    txEvents
      .flatMap { _, v -> v.nonFungibleBalanceDeltas }
      .mapValues { v -> NonFungibleTokenBalanceRecord.newBuilder().setAddress(v).build() }
      .to("non-fungible-token-balances", Produced.with(BoltSerdes.NonFungibleTokenBalanceKey(), BoltSerdes.NonFungibleTokenBalance()))

    txEvents
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

    txEvents
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
          KeyValue(keyBuilder.setName(BlockStatistic.TotalTxs.name).build(), MetricRecord.newBuilder().setIntValue(totalTxs).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.NumSuccessfulTxs.name).build(), MetricRecord.newBuilder().setIntValue(numSuccessfulTxs).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.NumFailedTxs.name).build(), MetricRecord.newBuilder().setIntValue(numFailedTxs).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.NumPendingTxs.name).build(), MetricRecord.newBuilder().setIntValue(numPendingTxs).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.TotalDifficulty.name).build(), MetricRecord.newBuilder().setBigIntegerValue(totalDifficulty.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.TotalGasPrice.name).build(), MetricRecord.newBuilder().setBigIntegerValue(totalGasPrice.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.AvgGasPrice.name).build(), MetricRecord.newBuilder().setBigIntegerValue(avgGasPrice.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.TotalTxsFees.name).build(), MetricRecord.newBuilder().setBigIntegerValue(totalTxsFees.toByteBuffer()).build()),
          KeyValue(keyBuilder.setName(BlockStatistic.AvgTxsFees.name).build(), MetricRecord.newBuilder().setBigIntegerValue(avgTxsFees.toByteBuffer()).build())
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

    // premine balances

    summary.getPremineBalances()
      .forEach{ p ->
        fungible += generateBalanceDeltas(
          ETHER_CONTRACT_ADDRESS,
          ETHER_CONTRACT_ADDRESS,
          p.getAddress(),
          p.getAmount().toBigInteger()!!,
          reverse
        )
      }

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
