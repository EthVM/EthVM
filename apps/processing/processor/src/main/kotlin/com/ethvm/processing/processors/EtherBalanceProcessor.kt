package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.processing.BalanceDeltaType
import com.ethvm.avro.processing.TokenType
import com.ethvm.common.extensions.bigInteger
import com.ethvm.common.extensions.hexToBI
import com.ethvm.db.Tables.*
import com.ethvm.db.tables.records.BalanceDeltaRecord
import com.ethvm.processing.cache.FungibleBalanceCache
import com.ethvm.processing.cache.InternalTxsCountsCache
import com.ethvm.processing.extensions.toBalanceDeltas
import com.ethvm.processing.extensions.toDbRecords
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import org.koin.core.inject
import org.koin.core.qualifier.named
import java.math.BigDecimal
import java.math.BigInteger
import java.sql.Timestamp
import java.time.Duration
import java.util.Properties

class EtherBalanceProcessor : AbstractProcessor<TraceListRecord>("ether-balance-processor") {

  override val logger = KotlinLogging.logger {}

  private val topicTraces: String by inject(named("topicTraces"))

  override val topics: List<String> = listOf(topicTraces)

  override val kafkaProps: Properties = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 16)
    }

  private val fungibleBalanceCache = FungibleBalanceCache(memoryDb, diskDb, scheduledExecutor, TokenType.ETHER)

  private val internalTxsCountsCache = InternalTxsCountsCache(memoryDb, diskDb, scheduledExecutor)

  override val maxTransactionTime = Duration.ofMillis(300)

  override fun blockHashFor(value: TraceListRecord): String = value.blockHash

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {
    fungibleBalanceCache.initialise(txCtx)
    internalTxsCountsCache.initialise(txCtx)
  }

  override fun reset(txCtx: DSLContext) {

    txCtx.truncate(TRACE).execute()

    fungibleBalanceCache.reset(txCtx)
    internalTxsCountsCache.reset(txCtx)
  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    fungibleBalanceCache.rewindUntil(txCtx, blockNumber)
    internalTxsCountsCache.rewindUntil(txCtx, blockNumber)

    txCtx
      .deleteFrom(TRACE)
      .where(TRACE.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .execute()
  }

  override fun process(txCtx: DSLContext, record: ConsumerRecord<CanonicalKeyRecord, TraceListRecord>) {

    val blockNumber = record.key().number.bigInteger()

    var deltas =
      if (blockNumber > BigInteger.ZERO) {
        emptyList()
      } else {
        // Premine balance allocations from Genesis block

        val genesisBlock = netConfig.genesis

        var timestampMs = genesisBlock.timestamp
        if (timestampMs == 0L) {
          timestampMs = System.currentTimeMillis()
        }

        genesisBlock
          .allocations
          .map { (address, balance) ->

            BalanceDeltaRecord().apply {
              this.address = address
              this.counterpartAddress = null
              this.blockNumber = BigDecimal.ZERO
              this.blockHash = genesisBlock.hash
              this.deltaType = BalanceDeltaType.PREMINE_BALANCE.toString()
              this.tokenType = TokenType.ETHER.toString()
              this.amount = balance.balance.hexToBI().toBigDecimal()
              this.timestamp = Timestamp(timestampMs)
              this.isReceiving = true
            }
          }
      }

    // hard forks

    val blockHash = blockHashFor(record.value())

    deltas = deltas + netConfig
      .chainConfigForBlock(blockNumber)
      .hardForkBalanceDeltas(blockNumber, blockHash, Timestamp(record.timestamp()))

    // deltas for traces

    val traceList = record.value()

    deltas = deltas + record.value().toBalanceDeltas()

    deltas.forEach { delta ->

      when (val tokenType = delta.tokenType) {
        TokenType.ETHER.toString() -> fungibleBalanceCache.add(delta)
        else -> throw UnsupportedOperationException("Unexpected token type: $tokenType")
      }
    }

    // internal tx counts
    deltas
      .groupBy { it.blockNumber }
      .forEach { internalTxsCountsCache.count(it.value, it.key.toBigInteger()) }

    // transaction traces

    val traceRecords = traceList.toDbRecords()
    txCtx.batchInsert(traceRecords).execute()

    // write delta records

    txCtx.batchInsert(deltas).execute()

    // write balance records

    fungibleBalanceCache.writeToDb(txCtx)

    // write count records
    internalTxsCountsCache.writeToDb(txCtx)
  }
}
