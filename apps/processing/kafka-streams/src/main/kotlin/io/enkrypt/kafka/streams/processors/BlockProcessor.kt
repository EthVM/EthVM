package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.capture.BlockHeaderRecord
import io.enkrypt.avro.capture.BlockKeyRecord
import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.capture.BlockRewardRecord
import io.enkrypt.avro.capture.TransactionKeyRecord
import io.enkrypt.avro.capture.UncleKeyRecord
import io.enkrypt.avro.processing.AddressMetadataKeyRecord
import io.enkrypt.avro.processing.AddressMetadataRecord
import io.enkrypt.avro.processing.AddressMetadataType
import io.enkrypt.avro.processing.BalanceType
import io.enkrypt.avro.processing.ChainEventRecord
import io.enkrypt.avro.processing.ChainEventType
import io.enkrypt.avro.processing.ContractCreateRecord
import io.enkrypt.avro.processing.ContractDestroyRecord
import io.enkrypt.avro.processing.ContractKeyRecord
import io.enkrypt.avro.processing.DaoHfBalanceTransferRecord
import io.enkrypt.avro.processing.PremineBalanceRecord
import io.enkrypt.avro.processing.TokenBalanceKeyRecord
import io.enkrypt.avro.processing.TokenBalanceRecord
import io.enkrypt.avro.processing.TokenTransferKeyRecord
import io.enkrypt.avro.processing.TokenTransferRecord
import io.enkrypt.avro.processing.TxFeeRecord
import io.enkrypt.common.extensions.byteArray
import io.enkrypt.common.extensions.byteBuffer
import io.enkrypt.common.extensions.isFungible
import io.enkrypt.common.extensions.isNonFungible
import io.enkrypt.common.extensions.unsignedBigInteger
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
import org.apache.kafka.streams.kstream.KStream
import org.apache.kafka.streams.kstream.Produced
import org.apache.kafka.streams.kstream.TransformerSupplier
import java.nio.ByteBuffer
import java.security.MessageDigest
import java.util.Properties
import org.apache.kafka.common.serialization.Serdes as KafkaSerdes

typealias BlockStream = KStream<BlockKeyRecord, BlockRecord>
typealias ChainEventStream = KStream<BlockKeyRecord, ChainEventRecord>
typealias BalanceStream = KStream<TokenBalanceKeyRecord, TokenBalanceRecord>

class BlockProcessor : AbstractKafkaProcessor() {

  private val emptyByteBuffer = ByteBuffer.allocate(0)

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

    val blocks = builder
      .stream(Topics.Blocks, Consumed.with(Serdes.BlockKey(), Serdes.Block()))
      // calculate block time
      .transform(
        TransformerSupplier { BlockTimeTransformer(appConfig.unitTesting) },
        *BlockTimeTransformer.STORE_NAMES
      )
      .peek { k, _ -> logger.info { "Processing block number = ${k.getNumber().unsignedBigInteger()}" } }

    //

    val chainEvents = blocks
      .transform(
        TransformerSupplier { ChainEventsTransformer(netConfig, appConfig.unitTesting) },
        *ChainEventsTransformer.STORE_NAMES
      )

    val tokenTransferChainEvents = chainEvents
      .filter { _, e -> e.getType() == ChainEventType.TOKEN_TRANSFER }

    // extract transactions and publish to their own topic
    extractTransactions(blocks)

    // extract uncles and publish to their own topic
    extractUncles(blocks)

    // identify miners
    identifyMiners(chainEvents)

    // premine balances
    etherMovementsForPremineBalance(chainEvents)

    // DAO Hard fork
    etherMovementsForDaoHardFork(chainEvents)

    // block rewards
    etherMovementsForRewards(chainEvents)

    // tx fees
    etherMovementsForTxFees(chainEvents)

    // summary info
    generateAccountSummaryInfo(chainEvents)

    // for persisting in whichever downstream storage is used e.g. Mongo
    persistTokenTransferEvents(tokenTransferChainEvents)

    // publish fungible token movements for aggregation
    fungibleContractTokenMovements(tokenTransferChainEvents)

    // publish non fungible token balances
    nonFungibleContractTokenMovements(tokenTransferChainEvents)

    // contract creations
    contractCreations(chainEvents)

    // contract destruction
    contractDestructions(chainEvents)

    // metrics
    blockMetrics(blocks)

    // Generate the topology
    return builder.build()
  }

  private fun blockMetrics(blocks: BlockStream) {

    blocks
      .mapValues { block -> BlockMetrics.forBlock(block) }
      .to(Topics.BlockMetricsByBlock, Produced.with(Serdes.BlockKey(), Serdes.BlockMetrics()))

    // TODO refactor to avoid re-calculation of metrics

    blocks
      .flatMap { _, block -> BlockMetrics.forAggregation(block, BlockMetrics.forBlock(block)) }
      .to(Topics.BlockMetricsByDay, Produced.with(Serdes.MetricKey(), Serdes.Metric()))

  }

  private fun contractDestructions(chainEvents: ChainEventStream) =
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

  private fun contractCreations(chainEvents: ChainEventStream) =
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

  private fun nonFungibleContractTokenMovements(tokenTransferEvents: ChainEventStream) =
    tokenTransferEvents
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
      }.to(Topics.Balances, Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))

  private fun fungibleContractTokenMovements(tokenTransferEvents: ChainEventStream) {

    tokenTransferEvents
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
  }

  private fun generateAccountSummaryInfo(chainEvents: ChainEventStream) {

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


  }

  private fun persistTokenTransferEvents(tokenTransferEvents: ChainEventStream) {

    tokenTransferEvents
      .map { _, v ->

        val reverse = v.getReverse()
        val transfer = v.getValue() as TokenTransferRecord

        KeyValue(
          generateTokenTransferKey(v),
          if (reverse) null else transfer // send a tombstone to remove the entry if this is being reversed
        )
      }.to(
        Topics.TokenTransfers,
        Produced.with(Serdes.TokenTransferKey(), Serdes.TokenTransfer())
      )

  }

  private fun etherMovementsForTxFees(chainEvents: ChainEventStream) =
    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.TX_FEE }
      .flatMap { _, event ->

        val reverse = event.getReverse()
        val fee = event.getValue() as TxFeeRecord

        val from = fee.getFrom()
        val amount = fee.getAmount().unsignedBigInteger()!!
        val miner = fee.getMiner()

        // we need to re-serialise the amount as a signed big integer for aggregations later

        listOf(

          // deduct ether from sender

          KeyValue(
            TokenBalanceKeyRecord.newBuilder()
              .setBalanceType(BalanceType.ETHER)
              .setAddress(from)
              .build(),
            TokenBalanceRecord.newBuilder()
              .setAmount(if (reverse) amount.byteBuffer() else amount.negate().byteBuffer())
              .build()
          ),

          // add ether to miner

          KeyValue(
            TokenBalanceKeyRecord.newBuilder()
              .setBalanceType(BalanceType.ETHER)
              .setAddress(miner)
              .build(),
            TokenBalanceRecord.newBuilder()
              .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
              .build()
          ),

          // add to miner's tx fees count

          KeyValue(
            TokenBalanceKeyRecord.newBuilder()
              .setBalanceType(BalanceType.TX_FEE)
              .setAddress(miner)
              .build(),
            TokenBalanceRecord.newBuilder()
              .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
              .build()
          )

        )

      }.to(Topics.FungibleTokenMovements, Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))

  private fun etherMovementsForRewards(chainEvents: ChainEventStream) =
    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.REWARD }
      .flatMap { _, event ->
        val reverse = event.getReverse()
        val reward = event.getValue() as BlockRewardRecord

        val author = reward.getAuthor()
        val amount = reward.getValue().unsignedBigInteger()!!

        // we need to re-serialise the amount as a signed big integer for aggregations later

        listOf(

          KeyValue(
            TokenBalanceKeyRecord.newBuilder()
              .setBalanceType(BalanceType.ETHER)
              .setAddress(author)
              .build(),
            TokenBalanceRecord.newBuilder()
              .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
              .build()
          ),

          // track reward

          KeyValue(
            TokenBalanceKeyRecord.newBuilder()
              .setBalanceType(BalanceType.REWARD)
              .setAddress(author)
              .build(),
            TokenBalanceRecord.newBuilder()
              .setAmount(if (reverse) amount.negate().byteBuffer() else amount.byteBuffer())
              .build()
          )

        )

      }
      .to(Topics.FungibleTokenMovements, Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))


  private fun etherMovementsForDaoHardFork(chainEvents: ChainEventStream) =
    chainEvents
      .filter { _, v -> v.getType() == ChainEventType.DAO_HF_BALANCE_TRANSFER }
      .flatMap { _, event ->

        val reverse = event.getReverse()
        val transferRecord = event.getValue() as DaoHfBalanceTransferRecord

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

      }.to(Topics.FungibleTokenMovements, Produced.with(Serdes.TokenBalanceKey(), Serdes.TokenBalance()))

  private fun etherMovementsForPremineBalance(chainEvents: ChainEventStream) =
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


  private fun extractTransactions(blocks: BlockStream) =
    blocks.flatMap { _, block ->

      val txs = block.getTransactions()
      val reverse = block.getReverse()

      txs.map { tx ->
        KeyValue(
          TransactionKeyRecord.newBuilder()
            .setTxHash(tx.getHash())
            .build(),
          if (reverse) null else tx
        )
      }

    }.to(Topics.Transactions, Produced.with(Serdes.TransactionKey(), Serdes.Transaction()))


  private fun extractUncles(blocks: BlockStream) =
    blocks.flatMap { _, block ->

      val reverse = block.getReverse()

      block.getUncles()
        .mapIndexed { idx, uncle ->

          KeyValue(
            UncleKeyRecord
              .newBuilder()
              .setUncleHash(uncle.getHash())
              .build(),
            if (reverse) null
            else BlockHeaderRecord.newBuilder(uncle)
              .setBlockNumber(block.getHeader().getNumber())
              .setUncleIndex(idx)
              .build()

          )
        }
    }.to(Topics.Uncles, Produced.with(Serdes.UncleKey(), Serdes.BlockHeader()))

  private fun identifyMiners(events: ChainEventStream) =
    events
      .filter { _, event -> event.getType() == ChainEventType.REWARD }
      .map { _, event ->

        val reverse = event.getReverse()
        val value = event.getValue() as BlockRewardRecord

        KeyValue(
          AddressMetadataKeyRecord.newBuilder()
            .setAddress(value.getAuthor())
            .setType(AddressMetadataType.MINER)
            .build(),
          if (reverse) null else
            AddressMetadataRecord.newBuilder()
              .setFlag(true)
              .build()
        )
      }.to(Topics.MinerList, Produced.with(Serdes.AddressMetadataKey(), Serdes.AddressMetadata()))


  private fun generateTokenTransferKey(event: ChainEventRecord): TokenTransferKeyRecord {

    val transfer = event.getValue() as TokenTransferRecord

    // need to create a unique key for the transfer event

    val md = MessageDigest.getInstance("SHA-256")

    val keyComponents = listOf(
      event.getBlockHash().byteArray(),
      event.getTxHash().byteArray(),
      event.getTxIndex().toBigInteger().unsignedBytes(),
      transfer.getContract()?.byteArray() ?: ByteArray(0),
      transfer.getFrom().byteArray(),
      transfer.getTo().byteArray(),
      transfer.getTokenId()?.byteArray() ?: ByteArray(0),
      transfer.getAmount()?.byteArray() ?: ByteArray(0)
    )

    keyComponents.forEach { md.update(it) }

    val hash = md.digest()

    return TokenTransferKeyRecord.newBuilder()
      .setHash(hash.byteBuffer())
      .build()
  }

  override fun start(cleanUp: Boolean) {
    logger.info { "Starting ${this.javaClass.simpleName}..." }
    super.start(cleanUp)
  }
}
