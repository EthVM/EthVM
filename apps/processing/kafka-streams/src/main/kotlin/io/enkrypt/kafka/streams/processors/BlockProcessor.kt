package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.BlockRewardRecord
import io.enkrypt.avro.capture.PremineBalanceRecord
import io.enkrypt.avro.capture.TransactionKeyRecord
import io.enkrypt.avro.capture.TransactionRecord
import io.enkrypt.avro.capture.UncleKeyRecord
import io.enkrypt.avro.processing.AddressMetadataKeyRecord
import io.enkrypt.avro.processing.AddressMetadataRecord
import io.enkrypt.avro.processing.AddressMetadataType
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.ChainEventType
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.DaoHfBalanceTransferRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.avro.processing.TokenTransferKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.common.extensions.byteArray
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.isFungible
import io.enkrypt.common.extensions.isNonFungible
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.common.extensions.unsignedByteBuffer
import io.enkrypt.common.extensions.unsignedBytes
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.processors.block.BlockMetrics
import io.enkrypt.kafka.streams.processors.block.BlockTimeTransformer
import io.enkrypt.kafka.streams.processors.block.ChainEventsTransformer
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KotlinLogging
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.math.BigInteger
import java.nio.ByteBuffer
import java.security.MessageDigest
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

class BlockProcessor : AbstractKafkaProcessor() {

  val emptyByteBuffer = ByteBuffer.allocate(0)

  override val id: String = "block-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
      put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000L)
      put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 2000000000)
    }

  override val logger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder().apply {
      addStateStore(ChainEventsTransformer.chainEventsStore(appConfig.unitTesting))
      addStateStore(ChainEventsTransformer.indexStore(appConfig.unitTesting))
      addStateStore(BlockTimeTransformer.blockTimesStore(appConfig.unitTesting))
    }

    val blockStream = builder
      .stream(Topics.Blocks, Consumed.with(Serdes.BlockKey(), Serdes.Block()))
      // calculate block time
      .transform(
        TransformerSupplier { BlockTimeTransformer(appConfig.unitTesting) },
        *BlockTimeTransformer.STORE_NAMES
      )
      .peek { k, _ -> logger.info { "Processing block number = ${k.getNumber().unsignedBigInteger()}" } }

    // extract transactions and publish to their own topic

    blockStream
      .flatMap { _, block ->

        val txs = block.getTransactions()
        val receipts = block.getTransactionReceipts()

        val reverse = block.getReverse()

        txs.zip(receipts)
          .map { (tx, receipt) ->
            KeyValue(
              TransactionKeyRecord.newBuilder()
                .setTxHash(tx.getHash())
                .build(),
              if (reverse) null else TransactionRecord.newBuilder(tx)
                .setBlockNumber(block.getHeader().getNumber())
                .setReceipt(receipt)
                .build()
            )
          }
      }.to(
        Topics.Transactions,
        Produced.with(Serdes.TransactionKey(), Serdes.Transaction())
      )

    // extract uncles and publish to their own topic

    blockStream
      .flatMap { _, block ->

        val reverse = block.getReverse()

        // a miner can appear multiple times within the rewards list so we need to aggregate

        val rewardsListByAddress = block.getRewards()
          .map { Pair(it.getAddress(), it.getReward().unsignedBigInteger()!!) }
          .groupBy { it.first }

        val rewardsCountByAuthor = rewardsListByAddress
          .mapValues { it.value.size }
          .toMap()

        val rewardsByAddress = rewardsListByAddress
          .entries.map { (address, list) -> address to list.map { it.second }.fold(BigInteger.ZERO) { memo, next -> memo + next } }
          .toMap()

        block.getUncles()
          .mapIndexed { idx, uncle ->

            val author = uncle.getAuthor()

            val uncleReward = rewardsByAddress[author]!! / rewardsCountByAuthor[author]!!.toBigInteger()

            KeyValue(
              UncleKeyRecord
                .newBuilder()
                .setUncleHash(uncle.getHash())
                .build(),
              if (reverse) null
              else BlockHeaderRecord.newBuilder(uncle)
                .setBlockNumber(block.getHeader().getNumber())
                .setUncleReward(uncleReward.unsignedByteBuffer())
                .setUncleIndex(idx)
                .build()
            )
          }
      }.to(
        Topics.Uncles,
        Produced.with(Serdes.UncleKey(), Serdes.BlockHeader())
      )

    // track miners

    blockStream
      .flatMap { _, v ->
        v.getRewards().map {
          KeyValue(
            AddressMetadataKeyRecord.newBuilder()
              .setAddress(it.getAddress())
              .setType(AddressMetadataType.MINER)
              .build(),
            if (v.getReverse()) null else
              AddressMetadataRecord.newBuilder()
                .setFlag(true)
                .build()
          )
        }
      }.to(Topics.MinerList, Produced.with(Serdes.AddressMetadataKey(), Serdes.AddressMetadata()))

    //

    val chainEvents = blockStream
      .transform(
        TransformerSupplier { ChainEventsTransformer(netConfig, appConfig.unitTesting) },
        *ChainEventsTransformer.STORE_NAMES
      )

    // premine balances

    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.PREMINE_BALANCE }
      .map { _, v ->

        val reverse = v.getReverse()
        val premineBalance = v.getValue() as PremineBalanceRecord
        val amount = premineBalance.getBalance().unsignedBigInteger()!!

        KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setAddress(premineBalance.getAddress())
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
            .build()
        )
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    // DAO Hard fork

    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.DAO_HF_BALANCE_TRANSFER }
      .flatMap { _, v ->

        val reverse = v.getReverse()
        val transferRecord = v.getValue() as DaoHfBalanceTransferRecord

        val from = transferRecord.getFrom()
        val to = transferRecord.getTo()
        val amount = transferRecord.getAmount().unsignedBigInteger()!!
        val balanceType = BalanceType.ETHER

        val fromBalance = KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setBalanceType(balanceType)
            .setAddress(from)
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(if (reverse) amount.byteBuffer() else amount.negate().byteBuffer())
            .build()
        )

        val toBalance = KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setBalanceType(balanceType)
            .setAddress(to)
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
            .build()
        )

        listOf(fromBalance, toBalance)
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    // block rewards

    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.BLOCK_REWARD }
      .map { _, v ->

        val reverse = v.getReverse()
        val reward = v.getValue() as BlockRewardRecord
        val amount = reward.getReward().unsignedBigInteger()!!

        KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setAddress(reward.getAddress())
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
            .build()
        )
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    val tokenTransfersStream = chainEvents
      .filter { _, e -> e.getType() == ChainEventType.TOKEN_TRANSFER }

    // publish all transfer events for entry into mongo

    tokenTransfersStream
      .map { _, v ->

        val reverse = v.getReverse()
        val transfer = v.getValue() as TokenTransferRecord

        // need to create a unique key for the transfer event

        val md = MessageDigest.getInstance("SHA-256")

        val keyComponents = listOf(
          transfer.getBlockHash().bytes(),
          transfer.getTxHash().bytes(),
          transfer.getTxIndex().toBigInteger().unsignedBytes(),
          transfer.getContract()?.bytes() ?: ByteArray(0),
          (transfer.getInternalTxIdx() ?: 0).toBigInteger().unsignedBytes(),
          transfer.getFrom().bytes(),
          transfer.getTo().bytes(),
          transfer.getTokenId()?.byteArray() ?: ByteArray(0),
          transfer.getAmount()?.byteArray() ?: ByteArray(0)
        )

        keyComponents.forEach { md.update(it) }

        val hash = md.digest()

        KeyValue(
          TokenTransferKeyRecord.newBuilder()
            .setHash(hash.byteBuffer())
            .build(),
          if (reverse) null else transfer // send a tombstone to remove the entry if this is being reversed
        )
      }.to(
        Topics.TokenTransfers,
        Produced.with(Serdes.TokenTransferKey(), Serdes.TokenTransfer())
      )

    chainEvents
      // only ether transfers for now
      .filter { _, v ->
        v.getType() == ChainEventType.TOKEN_TRANSFER &&
        (v.getValue() as TokenTransferRecord).getTransferType() == BalanceType.ETHER
      }.flatMap { _, v ->

        val reverse = v.getReverse()
        val transfer = v.getValue() as TokenTransferRecord

        listOf(
          KeyValue(
            AddressMetadataKeyRecord.newBuilder()
              .setAddress(transfer.getFrom())
              .setType(AddressMetadataType.OUT_TX_COUNT)
              .build(),
            if (reverse) null else emptyByteBuffer // just a marker to allow for counting
          ),
          KeyValue(
            AddressMetadataKeyRecord.newBuilder()
              .setAddress(transfer.getTo())
              .setType(AddressMetadataType.IN_TX_COUNT)
              .build(),
            if (reverse) null else emptyByteBuffer // just a marker to allow for counting
          ),
          KeyValue(
            AddressMetadataKeyRecord.newBuilder()
              .setAddress(transfer.getFrom())
              .setType(AddressMetadataType.TOTAL_TX_COUNT)
              .build(),
            if (reverse) null else emptyByteBuffer // just a marker to allow for counting
          ),
          KeyValue(
            AddressMetadataKeyRecord.newBuilder()
              .setAddress(transfer.getTo())
              .setType(AddressMetadataType.TOTAL_TX_COUNT)
              .build(),
            if (reverse) null else emptyByteBuffer // just a marker to allow for counting
          )
        )
      }.to(Topics.AddressTxEvents, Produced.with(Serdes.AddressMetadataKey(), KafkaSerdes.ByteBuffer()))

    // publish fungible token movements for aggregation

    tokenTransfersStream
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
            .setBalanceType(transfer.getTransferType())
            .setContract(contract)
            .setAddress(from)
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(if (reverse) amount.byteBuffer() else amount.negate().byteBuffer())
            .build()
        )

        val toBalance = KeyValue(
          TokenBalanceKeyRecord.newBuilder()
            .setBalanceType(transfer.getTransferType())
            .setContract(contract)
            .setAddress(to)
            .build(),
          TokenBalanceRecord.newBuilder()
            .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
            .build()
        )

        listOf(fromBalance, toBalance)
      }.to(
        Topics.FungibleTokenMovements,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    // publish non fungible token balances

    tokenTransfersStream
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
            .setBalanceType(transfer.getTransferType())
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
        Topics.Balances,
        Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance())
      )

    //

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
      }.to(
        Topics.ContractDestructions,
        Produced.with(Serdes.ContractKey(), Serdes.ContractDestroy())
      )

    // metrics

    blockStream
      .mapValues { block -> BlockMetrics.forBlock(block) }
      .to(Topics.BlockMetricsByBlock, Produced.with(Serdes.BlockKey(), Serdes.BlockMetrics()))

    // TODO refactor to avoid re-calculation of metrics

    blockStream
      .flatMap { _, block -> BlockMetrics.forAggregation(block, BlockMetrics.forBlock(block)) }
      .to(
        Topics.BlockMetricsByDay,
        Produced.with(Serdes.MetricKey(), Serdes.Metric())
      )

    // Generate the topology
    return builder.build()
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
