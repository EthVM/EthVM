package com.ethvm.processing.processors

import com.ethvm.avro.capture.CanonicalKeyRecord
import com.ethvm.avro.capture.TraceListRecord
import com.ethvm.avro.processing.BalanceDeltaType
import com.ethvm.avro.processing.TokenType
import com.ethvm.common.config.NetConfig
import com.ethvm.common.extensions.bigInteger
import com.ethvm.common.extensions.getNumberBI
import com.ethvm.common.extensions.hexToBI
import com.ethvm.db.Tables.*
import com.ethvm.db.tables.records.BalanceDeltaRecord
import com.ethvm.db.tables.records.TraceRecord
import com.ethvm.processing.cache.FungibleBalanceCache
import com.ethvm.processing.cache.InternalTxsCountsCache
import com.ethvm.processing.extensions.toBalanceDeltas
import com.ethvm.processing.extensions.toDbRecords
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.jooq.DSLContext
import java.math.BigDecimal
import java.math.BigInteger
import java.sql.Timestamp
import java.util.*
import java.util.concurrent.Callable
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService

class EtherBalanceProcessor(
  netConfig: NetConfig,
  baseKafkaProps: Properties,
  dbContext: DSLContext,
  storageDir: String,
  scheduledExecutor: ScheduledExecutorService,
  topicTraces: String
) : AbstractProcessor<TraceListRecord>(netConfig, baseKafkaProps, dbContext, storageDir, scheduledExecutor) {

  override val logger = KotlinLogging.logger {}

  override val processorId: String = "ether-balance-processor"

  override val kafkaProps = Properties()
    .apply {
      put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 4)
    }

  override val topics: List<String> = listOf(topicTraces)

  private lateinit var fungibleBalanceCache: FungibleBalanceCache

  private lateinit var internalTxsCountsCache: InternalTxsCountsCache

  private val executor = Executors.newCachedThreadPool()

  override fun blockHashFor(value: TraceListRecord): String = value.blockHash

  override fun initialise(txCtx: DSLContext, latestSyncBlock: BigInteger?) {

    fungibleBalanceCache = FungibleBalanceCache(memoryDb, diskDb, scheduledExecutor, TokenType.ETHER)
    fungibleBalanceCache.initialise(txCtx)

    internalTxsCountsCache = InternalTxsCountsCache(memoryDb, diskDb, scheduledExecutor)
    internalTxsCountsCache.initialise(txCtx)

  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    fungibleBalanceCache.rewindUntil(txCtx, blockNumber)
    internalTxsCountsCache.rewindUntil(txCtx, blockNumber)

    txCtx
      .deleteFrom(TRACE)
      .where(TRACE.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .execute()

    txCtx
      .deleteFrom(BALANCE)
      .where(BALANCE.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .and(BALANCE.CONTRACT_ADDRESS.isNull)
      .execute()

    txCtx
      .deleteFrom(BALANCE_DELTA)
      .where(BALANCE_DELTA.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .and(BALANCE_DELTA.CONTRACT_ADDRESS.isNull)
      .execute()

  }

  override fun process(txCtx: DSLContext, records: List<ConsumerRecord<CanonicalKeyRecord, TraceListRecord>>) {

    val firstBlockNumber = records.first().key().getNumberBI()

    var deltas =
      if (firstBlockNumber > BigInteger.ZERO) {
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

    // scatter / gather approach to try and speed up balance delta generation

    val data = records
      .chunked(12)
      .map { chunk ->
        executor.submit(Callable {

          var traceRecords = emptyList<TraceRecord>()
          var deltas = emptyList<BalanceDeltaRecord>()

          chunk
            .map { it.value() }
            .forEach() { traceList ->

              // hard forks

              val blockNumber = traceList.blockNumber.bigInteger()

              deltas = deltas + netConfig
                .chainConfigForBlock(blockNumber)
                .hardForkBalanceDeltas(blockNumber)

              // deltas for traces

              deltas = deltas + traceList.toBalanceDeltas()
              traceRecords = traceRecords + traceList.toDbRecords()
            }

          Pair(traceRecords, deltas)
        })
      }
      .map { it.get() }

    deltas = deltas + data.map { it.second }.flatten()

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
    txCtx.batchInsert(data.map { it.first }.flatten()).execute()

    // write delta records

    txCtx.batchInsert(deltas).execute()

    // write balance records

    fungibleBalanceCache.writeToDb(txCtx)

    // write count records
    internalTxsCountsCache.writeToDb(txCtx)

  }

}
