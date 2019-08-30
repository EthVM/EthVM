package com.ethvm.processing.processors

import com.ethvm.avro.capture.BlockRecord
import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.processing.TokenType
import com.ethvm.processing.cache.FungibleBalanceCache
import com.ethvm.processing.cache.NonFungibleBalanceCache
import com.ethvm.common.config.NetConfig
import com.ethvm.db.Tables
import com.ethvm.db.Tables.BALANCE
import com.ethvm.processing.extensions.toBalanceDeltas
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import java.math.BigInteger
import java.util.Properties
import java.util.concurrent.ScheduledExecutorService

class TokenBalanceProcessor(netConfig: NetConfig,
                            baseKafkaProps: Properties,
                            dbContext: DSLContext,
                            storageDir: String,
                            scheduledExecutor: ScheduledExecutorService,
                            topicBlocks: String) : AbstractProcessor<BlockRecord>(netConfig, baseKafkaProps, dbContext, storageDir, scheduledExecutor) {

  override val logger = KotlinLogging.logger {}

  override val processorId = "token-balance-processor"

  override val kafkaProps = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 4)
    }

  override val topics = listOf(topicBlocks)

  private lateinit var fungibleBalanceCache: FungibleBalanceCache

  private lateinit var nonFungibleBalanceCache: NonFungibleBalanceCache

  override fun blockHashFor(value: BlockRecord): String = value.header.hash

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {

    fungibleBalanceCache = FungibleBalanceCache(memoryDb, diskDb, scheduledExecutor, TokenType.ERC20)
      .apply {
        initialise(txCtx)
      }

    nonFungibleBalanceCache = NonFungibleBalanceCache(memoryDb, diskDb, scheduledExecutor, TokenType.ERC721)
      .apply {
        initialise(txCtx)
      }

  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    fungibleBalanceCache.rewindUntil(txCtx, blockNumber)
    nonFungibleBalanceCache.rewindUntil(txCtx, blockNumber)

    txCtx
      .deleteFrom(BALANCE)
      .where(BALANCE.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .and(BALANCE.CONTRACT_ADDRESS.isNotNull)
      .execute()

    txCtx
      .deleteFrom(Tables.BALANCE_DELTA)
      .where(Tables.BALANCE_DELTA.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .and(Tables.BALANCE_DELTA.CONTRACT_ADDRESS.isNotNull)
      .execute()

  }

  override fun process(txCtx: DSLContext, records: List<ConsumerRecord<CanonicalKeyRecord, BlockRecord>>) {

    val deltaRecords = records
      .map { record ->
        val block = record.value()

        block
          .receipts
          .map { it.toBalanceDeltas(block) }

      }
      .flatten()
      .flatten()

    txCtx.batchInsert(deltaRecords).execute()

    deltaRecords
      .forEach { delta ->

        when (val tokenType = delta.tokenType) {

          TokenType.ERC20.toString() ->
            fungibleBalanceCache.add(delta)

          TokenType.ERC721.toString() ->
            nonFungibleBalanceCache.assign(delta)

          else -> throw UnsupportedOperationException("Unexpected token type: $tokenType")
        }
      }

    // write changes to db

    fungibleBalanceCache.writeToDb(txCtx)
    nonFungibleBalanceCache.writeToDb(txCtx)

  }

}