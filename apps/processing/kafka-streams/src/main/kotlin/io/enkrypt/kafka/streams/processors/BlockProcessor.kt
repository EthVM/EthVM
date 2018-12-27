package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.FungibleTokenBalanceRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceKeyRecord
import io.enkrypt.avro.processing.NonFungibleTokenBalanceRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.common.extensions.amountBI
import io.enkrypt.common.extensions.bigInteger
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.models.ChainEventType
import io.enkrypt.kafka.streams.processors.block.BlockStatistics
import io.enkrypt.kafka.streams.processors.block.ChainEvents
import io.enkrypt.kafka.streams.serdes.Serdes
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
import org.apache.kafka.streams.state.StoreBuilder
import org.apache.kafka.streams.state.Stores
import java.math.BigInteger
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
    val builder = StreamsBuilder().apply {
      addStateStore(GatedBlockTransformer.blockSummariesStore())
      addStateStore(GatedBlockTransformer.metadataStore())
    }

    val blockStream = builder
      .stream(Topics.Blocks, Consumed.with(Serdes.BlockKey(), Serdes.Block()))

    val gatedStream = blockStream
      .transform(
        TransformerSupplier { GatedBlockTransformer() },
        *GatedBlockTransformer.STORE_NAMES
      )

    gatedStream.foreach { k, _ -> logger.info { "Processing block number = ${k.getNumber().bigInteger()}" } }

    // process into a stream of chain events

    val chainEvents = gatedStream
      .flatMapValues(ChainEvents::forBlock)

    // fungible token transfers

    chainEvents
      .filter { _, e -> e.type == ChainEventType.FungibleBalanceTransfer }
      .mapValues { v -> v.fungibleTransfer }
      .flatMap { _, v ->

        val reverse = v.getReverse()
        val amount = v.getAmount().unsignedBigInteger()!!

        // double entry style book-keeping

        val fromBalance = KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setContract(v.getContract())
            .setAddress(v.getFrom())
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(
              if (reverse) {
                amount.byteBuffer()
              } else {
                amount.negate().byteBuffer()
              }
            )
            .build()
        )

        val toBalance = KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setContract(v.getContract())
            .setAddress(v.getTo())
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(
              if (reverse) {
                amount.negate().byteBuffer()
              } else {
                amount.byteBuffer()
              }
            )
            .build()
        )

        listOf(fromBalance, toBalance)
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    // non fungible token transfers

    chainEvents
      .filter { _, e -> e.type == ChainEventType.NonFungibleBalanceTransfer }
      .mapValues { v -> v.nonFungibleTransfer }
      .map { _, v ->

        val reverse = v.getReverse()

        KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setContract(v.getContract())
            .setTokenId(v.getTokenId())
            .build(),
          TokenBalanceRecord.newBuilder()
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
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    // contract creations

    chainEvents
      .filter { _, e -> e.type == ChainEventType.ContractCreate }
      .mapValues { v -> v.contractCreate }
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
      }.to(Topics.ContractCreations, Produced.with(Serdes.ContractKey(), Serdes.ContractCreate()))

    // contract suicides

    chainEvents
      .filter { _, e -> e.type == ChainEventType.ContractDestruct }
      .mapValues { v -> v.contractDestruct }
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
      }.to(Topics.ContractSuicides, Produced.with(Serdes.ContractKey(), Serdes.ContractDestruct()))

    // statistics

    blockStream
      .flatMap { _, block -> BlockStatistics.forBlock(block) }
      .to(Topics.BlockMetrics, Produced.with(Serdes.MetricKey(), Serdes.Metric()))

    // Generate the topology
    return builder.build()
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

    fun blockSummariesStore(): StoreBuilder<KeyValueStore<BlockKeyRecord, BlockRecord>> = Stores.keyValueStoreBuilder(
      Stores.persistentKeyValueStore(STORE_NAME_BLOCKS),
      Serdes.BlockKey(), Serdes.Block()
    )

    fun metadataStore(): StoreBuilder<KeyValueStore<String, BlockKeyRecord>> = Stores.keyValueStoreBuilder(
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
      metaStore.get(META_HIGH) ?: BlockKeyRecord.newBuilder().setNumber(BigInteger.ZERO.unsignedByteBuffer()).build()
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
