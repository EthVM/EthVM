package io.enkrypt.kafka.streams.processors

import arrow.core.Option
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.InternalTransactionRecord
import io.enkrypt.avro.capture.TransactionReceiptRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.MetricKeyRecord
import io.enkrypt.avro.processing.MetricRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceRecord
import io.enkrypt.kafka.streams.Serdes
import io.enkrypt.kafka.streams.Topics
import io.enkrypt.common.extensions.amountBI
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.kafka.streams.models.BlockStatistic
import io.enkrypt.kafka.streams.models.BlockStatistics
import io.enkrypt.kafka.streams.models.ChainEvent
import io.enkrypt.kafka.streams.models.ChainEventType
import io.enkrypt.kafka.streams.models.StaticAddresses
import io.enkrypt.kafka.streams.utils.ERC20Abi
import io.enkrypt.kafka.streams.utils.ERC721Abi
import io.enkrypt.kafka.streams.utils.StandardTokenDetector
import mu.KotlinLogging
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
import java.math.BigInteger
import java.time.Instant
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class BlockProcessor : AbstractKafkaProcessor() {

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
      .stream(blocks, Consumed.with(Serdes.BlockKey(), Serdes.Block()))

    val gatedStream = blockStream
      .transform(
        TransformerSupplier { GatedBlockTransformer() },
        *GatedBlockTransformer.STORE_NAMES
      )

    gatedStream.foreach { k, _ -> logger.info { "Processing block number = ${k.getNumber().bigInteger()}" } }

    // process into a stream of chain events

    val chainEvents = gatedStream
      .flatMapValues(this::processBlock)

    // fungible token transfers

    chainEvents
      .filter { _, e -> e.type == ChainEventType.FungibleBalanceTransfer }
      .mapValues { v -> v.fungibleTransfer }
      .flatMap { _, v ->

        val reverse = v.getReverse()

        // double entry style book-keeping

        val fromBalance = KeyValue(
          FungibleTokenBalanceKeyRecord.newBuilder()
            .setContract(v.getContract())
            .setAddress(v.getFrom())
            .build(),
          FungibleTokenBalanceRecord.newBuilder()
            .setAmount(
              if (reverse) {
                v.getAmount()
              } else {
                v.amountBI!!.negate().byteBuffer()
              }
            )
            .build()
        )

        val toBalance = KeyValue(
          FungibleTokenBalanceKeyRecord.newBuilder()
            .setContract(v.getContract())
            .setAddress(v.getTo())
            .build(),
          FungibleTokenBalanceRecord.newBuilder()
            .setAmount(
              if (reverse) {
                v.amountBI!!.negate().byteBuffer()
              } else {
                v.getAmount()
              }
            )
            .build()
        )

        listOf(fromBalance, toBalance)
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.FungibleTokenBalanceKey(), Serdes.FungibleTokenBalance())
      )

    // non fungible token transfers

    chainEvents
      .filter { _, e -> e.type == ChainEventType.NonFungibleBalanceTransfer }
      .mapValues { v -> v.nonFungibleTransfer }
      .map { _, v ->

        val reverse = v.getReverse()

        KeyValue(
          NonFungibleTokenBalanceKeyRecord.newBuilder()
            .setContract(v.getContract())
            .setTokenId(v.getTokenId())
            .build(),
          NonFungibleTokenBalanceRecord.newBuilder()
            .setAddress(
              if (reverse) {
                v.getFrom()
              } else {
                v.getTo()
              }
            )
            .build()
        )
      }.to(
        Topics.NonFungibleTokenBalances,
        Produced.with(Serdes.NonFungibleTokenBalanceKey(), Serdes.NonFungibleTokenBalance())
      )

    // contract creations

    chainEvents
      .filter { _, e -> e.type == ChainEventType.ContractCreation }
      .mapValues { v -> v.contractCreation }
      .map { _, v ->

        val reverse = v.getReverse()

        KeyValue(
          ContractKeyRecord.newBuilder()
            .setAddress(v.getAddress())
            .build(),
          if (reverse) {
            null
          } else {
            v
          }
        )
      }.to(Topics.ContractCreations, Produced.with(Serdes.ContractKey(), Serdes.ContractCreation()))

    // contract suicides

    chainEvents
      .filter { _, e -> e.type == ChainEventType.ContractSuicide }
      .mapValues { v -> v.contractSuicide }
      .map { _, v ->

        val reverse = v.getReverse()

        KeyValue(
          ContractKeyRecord.newBuilder()
            .setAddress(v.getAddress())
            .build(),
          if (reverse) {
            null
          } else {
            v
          }
        )
      }.to(Topics.ContractSuicides, Produced.with(Serdes.ContractKey(), Serdes.ContractSuicide()))

    // statistics

    blockStream
      .flatMap { _, block -> calculateStatistics(block) }
      .to(Topics.BlockMetrics, Produced.with(Serdes.MetricKey(), Serdes.Metric()))

    // Generate the topology
    return builder.build()
  }

  private fun processBlock(block: BlockRecord) =
    processPremineBalances(block) +
      processBlockRewards(block) +
      processTransactions(block)

  private fun processPremineBalances(block: BlockRecord) =
    block.getPremineBalances()
      .map {
        ChainEvent.fungibleTransfer(
          StaticAddresses.EtherZero,
          it.getAddress(),
          it.getBalance(),
          block.getReverse()
        )
      }

  private fun processBlockRewards(block: BlockRecord) =
    block.getRewards()
      .map {
        ChainEvent.fungibleTransfer(
          StaticAddresses.EtherZero,
          it.getAddress(),
          it.getReward(),
          block.getReverse()
        )
      }

  private fun processTransactions(block: BlockRecord) =
    block.getTransactions()
      .zip(block.getTransactionReceipts())
      .map { (tx, receipt) -> processTransaction(block, tx, receipt) }
      .flatten()

  private fun processTransaction(
    block: BlockRecord,
    tx: TransactionRecord,
    receipt: TransactionReceiptRecord
  ): List<ChainEvent> {

    val reverse = block.getReverse()

    var events = listOf<ChainEvent>()

    val blockHash = block.getHeader().getHash()
    val txHash = tx.getHash()

    val from = tx.getFrom()
    val to = tx.getTo()
    val value = tx.getValue()
    val data = tx.getInput()

    // simple ether transfer
    if (!(from == null || to == null || value == null)) {
      events += ChainEvent.fungibleTransfer(from, to, value, reverse)
    }

    // contract creation
    if (tx.getCreates() != null) {
      val (contractType, _) = StandardTokenDetector.detect(data)
      events += ChainEvent.contractCreation(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)
    }

    // contract suicides
    receipt.getDeletedAccounts()
      .forEach { events += ChainEvent.contractSuicide(blockHash, txHash, it, reverse) }

    // token transfers

    receipt.getLogs().forEach { log ->

      val topics = log.getTopics().toList()
      val logData = log.getData().array()

      // ERC20 transfer event has the same signature as ERC721 so we use this initial match to detect any
      // transfer event

      ERC20Abi.matchEvent(log.getTopics())
        .filter { it.name == ERC20Abi.EVENT_TRANSFER }
        .fold({ Unit }, {

          val erc20Transfer = ERC20Abi.decodeTransferEvent(logData, topics)
          val erc721Transfer =
            if (erc20Transfer.isDefined()) Option.empty() else ERC721Abi.decodeTransferEvent(logData, topics)

          erc20Transfer
            .filter { it.amount != BigInteger.ZERO }
            .fold({ Unit }, {
              events += ChainEvent.fungibleTransfer(it.from, it.to, it.amount, reverse, it.contract)
            })

          erc721Transfer
            .fold({ Unit }, {
              events += ChainEvent.nonFungibleTransfer(it.contract, it.from, it.to, it.tokenId, reverse)
            })
        })
    }

    // internal transactions

    events += receipt.getInternalTxs()
      .map { processInternalTransactions(block, tx, receipt, it) }
      .flatten()

    return events
  }

  private fun processInternalTransactions(
    block: BlockRecord,
    tx: TransactionRecord,
    receipt: TransactionReceiptRecord,
    internalTx: InternalTransactionRecord
  ): List<ChainEvent> {

    val reverse = block.getReverse()
    var events = listOf<ChainEvent>()

    val blockHash = block.getHeader().getHash()
    val txHash = tx.getHash()

    val from = internalTx.getFrom()
    val to = internalTx.getTo()
    val value = internalTx.getValue()
    val data = internalTx.getInput()

    // simple ether transfer
    if (!(from == null || to == null || value == null)) {
      events += ChainEvent.fungibleTransfer(from, to, value, reverse)
    }

    // contract creation
    if (tx.getCreates() != null) {
      val (contractType, _) = StandardTokenDetector.detect(data)
      events += ChainEvent.contractCreation(contractType, from, blockHash, txHash, tx.getCreates(), data, reverse)
    }

    // contract suicides
    receipt.getDeletedAccounts()
      .forEach { events += ChainEvent.contractSuicide(blockHash, txHash, it, reverse) }

    return events
  }

  private fun calculateStatistics(block: BlockRecord): List<KeyValue<MetricKeyRecord, MetricRecord>> {

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

    val reverse = block.getReverse()
    val intMultiplier = if (reverse) {
      -1
    } else {
      1
    }
    val bigIntMultiplier = if (reverse) {
      BigInteger.ONE.negate()
    } else {
      BigInteger.ONE
    }

    val instant = Instant.ofEpochSecond(block.getHeader().getTimestamp())
    val dateTime = ZonedDateTime.ofInstant(instant, ZoneOffset.UTC)
    val startOfDayEpoch = dateTime.truncatedTo(ChronoUnit.DAYS).toInstant().epochSecond

    val keyBuilder = MetricKeyRecord
      .newBuilder()
      .setDate(startOfDayEpoch)

    return listOf(
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalTxs.name).build(),
        MetricRecord.newBuilder().setIntValue(totalTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.NumSuccessfulTxs.name).build(),
        MetricRecord.newBuilder().setIntValue(numSuccessfulTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.NumFailedTxs.name).build(),
        MetricRecord.newBuilder().setIntValue(numFailedTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.NumPendingTxs.name).build(),
        MetricRecord.newBuilder().setIntValue(numPendingTxs * intMultiplier).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalDifficulty.name).build(),
        MetricRecord.newBuilder().setBigIntegerValue(totalDifficulty.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalGasPrice.name).build(),
        MetricRecord.newBuilder().setBigIntegerValue(totalGasPrice.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.AvgGasPrice.name).build(),
        MetricRecord.newBuilder().setBigIntegerValue(avgGasPrice.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.TotalTxsFees.name).build(),
        MetricRecord.newBuilder().setBigIntegerValue(totalTxsFees.times(bigIntMultiplier).byteBuffer()).build()
      ),
      KeyValue(
        keyBuilder.setName(BlockStatistic.AvgTxsFees.name).build(),
        MetricRecord.newBuilder().setBigIntegerValue(avgTxsFees.times(bigIntMultiplier).byteBuffer()).build()
      )
    )
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
      Serdes.BlockKey(), Serdes.Block()
    )

    fun metadataStore() = Stores.keyValueStoreBuilder(
      Stores.persistentKeyValueStore(STORE_NAME_METADATA),
      KafkaSerdes.String(), Serdes.BlockKey()
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

    val highKey =
      metaStore.get(META_HIGH) ?: BlockKeyRecord.newBuilder().setNumber(BigInteger.ZERO.byteBuffer()).build()
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
