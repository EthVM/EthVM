package com.ethvm.processing.processors

import com.ethvm.avro.exchange.CoinExchangeRateKeyRecord
import com.ethvm.avro.exchange.CoinExchangeRateRecord
import com.ethvm.db.Tables.COIN_EXCHANGE_RATE
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.Duration
import java.util.Properties

class CoinExchangeRateProcessor(
  private val baseKafkaProps: Properties,
  private val dbContext: DSLContext
) : Processor {

  val logger = KotlinLogging.logger {}

  private val kafkaProps = Properties().apply {

    putAll(baseKafkaProps)

    put(ConsumerConfig.GROUP_ID_CONFIG, "coin-exchange-rate-processor")
    put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true)
    put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
  }

  private val pollTimeout = Duration.ofSeconds(10)

  private val consumer = KafkaConsumer<CoinExchangeRateKeyRecord, CoinExchangeRateRecord>(kafkaProps)
    .apply {
      subscribe(listOf("coin_exchange_rates"))
    }

  @Volatile
  private var stop = false

  override fun initialise() {
  }

  override fun stop() {
    stop = true
  }

  override fun run() {
    try {

      while (!stop) {

        dbContext
          .transaction { txConfig ->

            val txCtx = DSL.using(txConfig)

            consumer.poll(pollTimeout)
              .map { consumerRecord ->

                val key = consumerRecord.key()
                val value = consumerRecord.value()

                com.ethvm.db.tables.records.CoinExchangeRateRecord()
                  .apply {
                    this.id = key.id
                    this.currency = value.currency
                    this.price = value.price.toBigDecimal()
                    this.marketCap = value.marketCap.toBigDecimal()
                    this.vol24h = value.vol24h.toBigDecimal()
                    this.change24h = value.change24h.toBigDecimal()
                    this.lastUpdated = value.lastUpdated
                  }

              }
              .forEach { record ->

                txCtx
                  .insertInto(COIN_EXCHANGE_RATE)
                  .set(record)
                  .onDuplicateKeyUpdate()
                  .set(COIN_EXCHANGE_RATE.PRICE, record.price)
                  .set(COIN_EXCHANGE_RATE.MARKET_CAP, record.marketCap)
                  .set(COIN_EXCHANGE_RATE.VOL24H, record.vol24h)
                  .set(COIN_EXCHANGE_RATE.CHANGE24H, record.change24h)
                  .set(COIN_EXCHANGE_RATE.LAST_UPDATED, record.lastUpdated)
                  .set(COIN_EXCHANGE_RATE.PRICE, record.price)
                  .execute()

              }

          }

      }

    } catch (e: Exception) {
      logger.error(e) { "Fatal exception" }
    } finally {
      consumer.close()
    }
  }
}
