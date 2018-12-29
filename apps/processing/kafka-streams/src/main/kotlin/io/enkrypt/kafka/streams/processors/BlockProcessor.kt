package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.BlockRewardRecord
import io.enkrypt.avro.capture.PremineBalanceRecord
import io.enkrypt.avro.processing.ChainEventType
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.isFungible
import io.enkrypt.common.extensions.isNonFungible
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.processors.block.BlockStatistics
import io.enkrypt.kafka.streams.processors.block.ReorgTracker
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.util.Properties

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
      addStateStore(ReorgTracker.chainEventsStore(appConfig.unitTesting))
      addStateStore(ReorgTracker.indexStore(appConfig.unitTesting))
    }

    val blockStream = builder
      .stream(Topics.Blocks, Consumed.with(Serdes.BlockKey(), Serdes.Block()))
      .peek { k, _ -> logger.info { "Processing block number = ${k.getNumber().unsignedBigInteger()}" } }

    val chainEvents = blockStream
      .transform(
        TransformerSupplier { ReorgTracker() },
        *ReorgTracker.STORE_NAMES
      )

    // premine balances

    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.PREMINE_BALANCE }
      .mapValues { v -> v.getValue() as PremineBalanceRecord }
      .map { _, v ->

        KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setAddress(v.getAddress())
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(v.getBalance())
            .build()
        )
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    // block rewards

    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.BLOCK_REWARD }
      .mapValues { v -> v.getValue() as BlockRewardRecord }
      .map { _, v ->

        KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setAddress(v.getAddress())
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(v.getReward())
            .build()
        )
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    // fungible token transfers

    chainEvents
      .filter { _, e -> e.getType() == ChainEventType.TOKEN_TRANSFER }
      .filter { _, e -> (e.getValue() as TokenTransferRecord).isFungible() }
      .flatMap { _, v ->

        val reverse = v.getReverse()
        val transfer = v.getValue() as TokenTransferRecord

        val contract = transfer.getContract()
        val from = transfer.getFrom()
        val to = transfer.getTo()
        val amount = transfer.getAmount().unsignedBigInteger()!!

        // double entry style book-keeping

        val fromBalance = KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setContract(contract)
            .setAddress(from)
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
            .setContract(contract)
            .setAddress(to)
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
      .filter { _, e -> e.getType() == ChainEventType.TOKEN_TRANSFER }
      .filter { _, e -> (e.getValue() as TokenTransferRecord).isNonFungible() }
      .map { _, v ->

        val reverse = v.getReverse()
        val transfer = v.getValue() as TokenTransferRecord

        val contract = transfer.getContract()
        val from = transfer.getFrom()
        val to = transfer.getTo()
        val tokenId = transfer.getTokenId()

        KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setContract(contract)
            .setTokenId(tokenId)
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAddress(
              if (reverse) {
                from
              } else {
                to
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
      .filter { _, e -> e.getType() == ChainEventType.CONTRACT_CREATE }
      .map { _, v ->

        val reverse = v.getReverse()
        val create = v.getValue() as ContractCreateRecord

        KeyValue(
          ContractKeyRecord.newBuilder()
            .setAddress(create.getAddress())
            .build(),
          if (reverse) {
            null
          } else {
            create
          }
        )
      }.to(Topics.ContractCreations, Produced.with(Serdes.ContractKey(), Serdes.ContractCreate()))

    // contract suicides

    chainEvents
      .filter { _, e -> e.getType() == ChainEventType.CONTRACT_DESTROY }
      .map { _, v ->

        val reverse = v.getReverse()
        val destroy = v.getValue() as ContractDestroyRecord

        KeyValue(
          ContractKeyRecord.newBuilder()
            .setAddress(destroy.getAddress())
            .build(),
          if (reverse) {
            null
          } else {
            destroy
          }
        )
      }.to(Topics.ContractDestructions, Produced.with(Serdes.ContractKey(), Serdes.ContractDestroy()))

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
