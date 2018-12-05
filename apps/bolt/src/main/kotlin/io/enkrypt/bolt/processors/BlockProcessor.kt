package io.enkrypt.bolt.processors

import arrow.core.Option
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.processing.ContractCreationRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.ContractSuicideRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceRecord
import io.enkrypt.bolt.BoltSerdes
import io.enkrypt.bolt.Topics
import io.enkrypt.bolt.eth.utils.ERC20Abi
import io.enkrypt.bolt.eth.utils.ERC721Abi
import io.enkrypt.bolt.eth.utils.StandardTokenDetector
import io.enkrypt.bolt.extensions.bigInteger
import io.enkrypt.bolt.extensions.byteArray
import io.enkrypt.bolt.extensions.byteBuffer
import io.enkrypt.bolt.models.BlockStatistic
import io.enkrypt.bolt.models.BlockStatistics
import mu.KotlinLogging
import org.apache.kafka.common.serialization.Serdes
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
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
import java.util.Properties

class BlockProcessor : AbstractKafkaProcessor() {

  companion object {
    val ETHER_CONTRACT_ADDRESS = Data20(ByteUtil.hexStringToBytes("0000000000000000000000000000000000000000"))
  }

  override val id: String = "block-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
      put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000L)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    builder.addStateStore(GatedBlockTransformer.blockSummariesStore())
    builder.addStateStore(GatedBlockTransformer.metadataStore())

    val (blocks) = appConfig.kafka.inputTopicsConfig

    val blockStream = builder
      .stream(blocks, Consumed.with(BoltSerdes.BlockKey(), BoltSerdes.Block()))

    val gatedStream = blockStream
      .transform(
        TransformerSupplier { GatedBlockTransformer() },
        *GatedBlockTransformer.STORE_NAMES
      )

    gatedStream.foreach { k, _ -> logger.info { "Processing block number = ${k.getNumber().bigInteger()}" } }

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
      .to(Topics.FungibleTokenMovements, Produced.with(BoltSerdes.FungibleTokenBalanceKey(), BoltSerdes.FungibleTokenBalance()))

    txEvents
      .flatMap { _, v -> v.nonFungibleBalanceDeltas }
      .mapValues { v -> NonFungibleTokenBalanceRecord.newBuilder().setAddress(v).build() }
      .to(Topics.NonFungibleTokenBalances, Produced.with(BoltSerdes.NonFungibleTokenBalanceKey(), BoltSerdes.NonFungibleTokenBalance()))

    txEvents
      .flatMap { _, v ->
        v.contractCreations.map { c ->

          val key = ContractKeyRecord.newBuilder().setAddress(c.key).build()
          val value = c.value.first
          val reverse = c.value.second

          if (reverse) {
            KeyValue(key, null)   // tombstone
          } else {
            KeyValue(key, value)
          }
        }
      }
      .to(Topics.ContractCreations, Produced.with(BoltSerdes.ContractKey(), BoltSerdes.ContractCreation()))

    txEvents
      .flatMap { _, v ->
        v.contractSuicides.map { c ->

          val key = ContractKeyRecord.newBuilder().setAddress(c.key).build()
          val value = c.value.first
          val reverse = c.value.second

          if (reverse) {
            KeyValue(key, null)   // tombstone
          } else {
            KeyValue(key, value)
          }

        }
      }
      .to(Topics.ContractSuicides, Produced.with(BoltSerdes.ContractKey(), BoltSerdes.ContractSuicide()))

    // statistics

    blockStream
      .flatMap { _, block ->

        val (
          totalTxs,
          numSuccessfulTxs,
          numFailedTxs,
          numPendingTxs,
          totalDifficulty,
          totalGasPrice,
          avgGasPrice,
          totalTxsFees,
          avgTxsFees
        ) = BlockStatistics.forBlock(block)

        val instant = Instant.ofEpochSecond(block.getHeader().getTimestamp())
        val dateTime = ZonedDateTime.ofInstant(instant, ZoneOffset.UTC)
        val startOfDayEpoch = dateTime.truncatedTo(ChronoUnit.DAYS).toInstant().epochSecond

        val keyBuilder = MetricKeyRecord
          .newBuilder()
          .setDate(startOfDayEpoch)

        listOf(
          KeyValue(
            keyBuilder.setName(BlockStatistic.TotalTxs.name).build(),
            MetricRecord.newBuilder().setIntValue(totalTxs).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.NumSuccessfulTxs.name).build(),
            MetricRecord.newBuilder().setIntValue(numSuccessfulTxs).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.NumFailedTxs.name).build(),
            MetricRecord.newBuilder().setIntValue(numFailedTxs).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.NumPendingTxs.name).build(),
            MetricRecord.newBuilder().setIntValue(numPendingTxs).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.TotalDifficulty.name).build(),
            MetricRecord.newBuilder().setBigIntegerValue(totalDifficulty.byteBuffer()).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.TotalGasPrice.name).build(),
            MetricRecord.newBuilder().setBigIntegerValue(totalGasPrice.byteBuffer()).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.AvgGasPrice.name).build(),
            MetricRecord.newBuilder().setBigIntegerValue(avgGasPrice.byteBuffer()).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.TotalTxsFees.name).build(),
            MetricRecord.newBuilder().setBigIntegerValue(totalTxsFees.byteBuffer()).build()
          ),
          KeyValue(
            keyBuilder.setName(BlockStatistic.AvgTxsFees.name).build(),
            MetricRecord.newBuilder().setBigIntegerValue(avgTxsFees.byteBuffer()).build()
          )
        )

      }.to(Topics.BlockMetrics, Produced.with(BoltSerdes.MetricKey(), BoltSerdes.Metric()))

    // Generate the topology
    return builder.build()
  }

  private fun generateEtherBalanceDeltas(block: BlockRecord): TransactionData {

    val reverse = block.getReverse()

    var fungible = listOf<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>>()

    // premine balances

    if (block.getPremineBalances() != null) {
      // Genesis block only
      block.getPremineBalances()
        .forEach { p ->
          fungible += generateBalanceDeltas(
            null,
            ETHER_CONTRACT_ADDRESS,
            p.getAddress(),
            p.getBalance().bigInteger()!!,
            reverse
          )
        }

    }

    // rewards

    block.getRewards()
      .forEach { e ->
        fungible += generateBalanceDeltas(
          null,
          ETHER_CONTRACT_ADDRESS,
          e.getAddress(),
          e.getReward().bigInteger()!!,
          reverse
        )
      }

    // ether transactions

    block
      .getTransactions()
      .zip(block.getTransactionReceipts())
      .filter { (tx, _) -> !(tx.getFrom() == null || tx.getTo() == null || tx.getValue() == null) }
      .forEach { (tx, _) ->
        fungible += generateBalanceDeltas(
          null,
          tx.getFrom(),
          tx.getTo(),
          tx.getValue().bigInteger()!!,
          reverse
        )
      }

    return TransactionData(fungible, emptyList(), emptyMap(), emptyMap())
  }

  private fun generateTokenData(block: BlockRecord): TransactionData {

    val reverse = block.getReverse()

    var fungible = listOf<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>>()
    var nonFungible = listOf<KeyValue<NonFungibleTokenBalanceKeyRecord, Data20>>()
    var contractCreations = mapOf<Data20, Pair<ContractCreationRecord, Boolean>>()
    var contractSuicides = mapOf<Data20, Pair<ContractSuicideRecord, Boolean>>()

    block.getTransactions()
      .zip(block.getTransactionReceipts())
      .forEach { (tx, receipt) ->

        // contract creation

        if (tx.getTo() == null && tx.getInput() != null) {

          val contractAddress = Data20(HashUtil.calcNewAddr(tx.getFrom().bytes(), tx.getNonce().byteArray()))

          // detect contract type
          val (contractType, _) = StandardTokenDetector.detect(tx.getInput().byteArray()!!)

          val value = ContractCreationRecord
            .newBuilder()
            .setType(contractType)
            .setCreator(tx.getFrom())
            .setBlockHash(block.getHeader().getHash())
            .setTxHash(tx.getHash())
            .setData(tx.getInput())
            .build()

          contractCreations += contractAddress to Pair(value, reverse)
        }

        // contract suicides

        receipt.getDeletedAccounts()
          .forEach { contractAddress ->

            val value = ContractSuicideRecord
              .newBuilder()
              .setBlockHash(block.getHeader().getHash())
              .setTxHash(tx.getHash())
              .build()

            contractSuicides += contractAddress to Pair(value, reverse)

          }

        // token transfers

        receipt.getLogs().forEach { log ->

          val topics = log.getTopics().toList()
          val data = log.getData().array()

          // ERC20 transfer event has the same signature as ERC721 so we use this initial match to detect any
          // transfer event

          ERC20Abi.matchEvent(log.getTopics())
            .filter { it.name == ERC20Abi.EVENT_TRANSFER }
            .fold({ Unit }, {

              val erc20Transfer = ERC20Abi.decodeTransferEvent(data, topics)
              val erc721Transfer = if (erc20Transfer.isDefined()) Option.empty() else ERC721Abi.decodeTransferEvent(data, topics)

              erc20Transfer
                .filter { it.amount != BigInteger.ZERO }
                .fold({ Unit }, { builder ->
                  fungible += generateBalanceDeltas(tx.getFrom(), builder.from, builder.to, builder.amount.bigInteger()!!, reverse)
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

  private fun generateBalanceDeltas(contract: Data20?, from: Data20, to: Data20, amount: BigInteger, reverse: Boolean): List<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>> {

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

class GatedBlockTransformer : Transformer<BlockKeyRecord?, BlockRecord?, KeyValue<BlockKeyRecord, BlockRecord>> {

  companion object {

    const val STORE_NAME_BLOCKS = "gated-blocks"
    const val STORE_NAME_METADATA = "gated-blocks-metadata"
    const val META_HIGH = "high"

    val STORE_NAMES = arrayOf(STORE_NAME_BLOCKS, STORE_NAME_METADATA)

    fun blockSummariesStore() = Stores.keyValueStoreBuilder(
      Stores.persistentKeyValueStore(STORE_NAME_BLOCKS),
      BoltSerdes.BlockKey(), BoltSerdes.Block()
    )

    fun metadataStore() = Stores.keyValueStoreBuilder(
      Stores.persistentKeyValueStore(STORE_NAME_METADATA),
      Serdes.String(), BoltSerdes.BlockKey()
    )
  }

  private lateinit var context: ProcessorContext

  private lateinit var blockStore: KeyValueStore<BlockKeyRecord, BlockRecord?>
  private lateinit var metaStore: KeyValueStore<String, BlockKeyRecord?>

  val logger = KotlinLogging.logger {}

  @Suppress("UNCHECKED_CAST")
  override fun init(context: ProcessorContext?) {
    this.context = context!!
    this.blockStore = context.getStateStore(STORE_NAME_BLOCKS) as KeyValueStore<BlockKeyRecord, BlockRecord?>
    this.metaStore = context.getStateStore(STORE_NAME_METADATA) as KeyValueStore<String, BlockKeyRecord?>
  }

  override fun transform(key: BlockKeyRecord?, block: BlockRecord?): KeyValue<BlockKeyRecord, BlockRecord>? {

    if (key == null) {
      logger.warn("Null key received, ignoring")
      return null
    }

    if (block == null) {
      logger.warn("Null block received, ignoring")
      return null
    }

    val lastVersion = blockStore.get(key)

    if (lastVersion == null) {

      // we've never seen any block for this block key before
      onNewBlock(key, block)

    } else if (lastVersion.getHeader().getHash() != block.getHeader().getHash()) {

      // we've received a block for block key n which does not have a block hash which matches the one we
      // have in the state store indicating a chain re-org is taking place
      onReorg(key, block)

    }

    return null
  }

  private fun onNewBlock(key: BlockKeyRecord, summary: BlockRecord) {

    logger.debug { "New block, key = ${key.getNumber().bigInteger()}" }

    // record the key -> summary
    blockStore.put(key, summary)
    metaStore.put(META_HIGH, key)

    // forward on for more processing
    context.forward(key, summary)

  }

  private fun onReorg(key: BlockKeyRecord, summary: BlockRecord) {

    logger.info { "Re-org triggered by block key = ${key.getNumber().bigInteger()}" }

    // first we reverse all the summaries from highest key back to this key in preparation for the new summaries to come
    // as part of the new chain

    // TODO see if this can be made more efficient with ranging,
    // documentation says ranging provides no ordering guarantees

    val highKey = metaStore.get(META_HIGH) ?: BlockKeyRecord.newBuilder().setNumber(BigInteger.ZERO.byteBuffer()).build()
    var numberToReverse = highKey.getNumber().bigInteger()!!
    var summaryToReverse: BlockRecord?

    do {
      summaryToReverse = blockStore.delete(highKey)

      if (summaryToReverse != null) {

        val reversal = BlockRecord
          .newBuilder(summaryToReverse)
          .setReverse(true)
          .build()

        context.forward(highKey, reversal)

        logger.info { "Reversing key = $key" }
      }

      numberToReverse -= BigInteger.ONE

    } while (summaryToReverse != null)

    // commit and publish the new version of the summary for this block key

    blockStore.put(key, summary)
    context.forward(key, summary)

  }

  override fun close() {

  }

}

data class TransactionData(
  val fungibleBalanceDeltas: List<KeyValue<FungibleTokenBalanceKeyRecord, BigInteger>>,
  val nonFungibleBalanceDeltas: List<KeyValue<NonFungibleTokenBalanceKeyRecord, Data20>>,
  val contractCreations: Map<Data20, Pair<ContractCreationRecord, Boolean>>,
  val contractSuicides: Map<Data20, Pair<ContractSuicideRecord, Boolean>>
) {

  fun concat(other: TransactionData) = TransactionData(
    fungibleBalanceDeltas + other.fungibleBalanceDeltas,
    nonFungibleBalanceDeltas + other.nonFungibleBalanceDeltas,
    contractCreations + other.contractCreations,
    contractSuicides + other.contractSuicides
  )

}
