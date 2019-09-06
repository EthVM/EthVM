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

  // the name of the traces topic, it can change based on the chain
  private val topicTraces: String by inject(named("topicTraces"))

  // list of topics to ingest from
  override val topics: List<String> = listOf(topicTraces)

  // for tracking ether balances
  private val fungibleBalanceCache = FungibleBalanceCache(memoryDb, diskDb, scheduledExecutor, TokenType.ETHER, processorId)

  // for tracking internal txs
  private val internalTxsCountsCache = InternalTxsCountsCache(memoryDb, diskDb, scheduledExecutor, processorId)

  // increase the max transaction time as this processor is write heavy and we want to benefit a bit more from
  // the economies of scale with transaction writes
  override val maxTransactionTime = Duration.ofMillis(300)

  override fun blockHashFor(value: TraceListRecord): String = value.blockHash

  override fun initialise(txCtx: DSLContext, latestBlockNumber: BigInteger) {
    fungibleBalanceCache.initialise(txCtx)
    internalTxsCountsCache.initialise(txCtx)
  }

  override fun reset(txCtx: DSLContext) {

    txCtx.truncate(TRACE).execute()

    // reset our local state
    // note: caches are responsible for maintaining their db state
    fungibleBalanceCache.reset(txCtx)
    internalTxsCountsCache.reset(txCtx)

  }

  override fun rewindUntil(txCtx: DSLContext, blockNumber: BigInteger) {

    // rewind our local state
    // note: caches are responsible for maintaining their db state
    fungibleBalanceCache.rewindUntil(txCtx, blockNumber)
    internalTxsCountsCache.rewindUntil(txCtx, blockNumber)

    txCtx
      .deleteFrom(TRACE)
      .where(TRACE.BLOCK_NUMBER.ge(blockNumber.toBigDecimal()))
      .execute()

  }

  override fun process(txCtx: DSLContext, record: ConsumerRecord<CanonicalKeyRecord, TraceListRecord>) {

    val blockNumber = record.key().number.bigInteger()

    // Premine balance allocations from Genesis block

    var deltas =
      if (blockNumber > BigInteger.ZERO) {
        emptyList()
      } else {

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

    deltas = deltas + traceList.toBalanceDeltas()

    // for each ETHER delta we run it through the fungible balance cache to update our balances

    deltas.forEach { delta ->

      when (val tokenType = delta.tokenType) {
        TokenType.ETHER.toString() -> fungibleBalanceCache.add(delta)
        else -> throw UnsupportedOperationException("Unexpected token type: $tokenType")
      }
    }

    // for each delta we update internal tx counts

    deltas
      .groupBy { it.blockNumber }
      .forEach { internalTxsCountsCache.count(it.value, it.key.toBigInteger()) }

    // generate and insert db records for traces

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
