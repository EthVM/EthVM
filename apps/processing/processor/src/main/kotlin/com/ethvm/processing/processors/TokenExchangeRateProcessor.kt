package com.ethvm.processing.processors

import com.ethvm.avro.exchange.TokenExchangeRateKeyRecord
import com.ethvm.avro.exchange.TokenExchangeRateRecord
import com.ethvm.common.extensions.bigInteger
import com.ethvm.db.Tables.TOKEN_EXCHANGE_RATE
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.Duration
import java.util.Properties

class TokenExchangeRateProcessor(
  private val baseKafkaProps: Properties,
  private val dbContext: DSLContext
) : Processor {

  private val logger = KotlinLogging.logger {}

  private val kafkaProps = Properties().apply {

    putAll(baseKafkaProps)

    put(ConsumerConfig.GROUP_ID_CONFIG, "token-exchange-processor")
    put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false)
    put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
  }

  private val pollTimeout = Duration.ofSeconds(10)

  private val consumer = KafkaConsumer<TokenExchangeRateKeyRecord, TokenExchangeRateRecord>(kafkaProps)
    .apply {
      subscribe(listOf("token_exchange_rates"))
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

        val consumerRecords = consumer.poll(pollTimeout)

        if (consumerRecords.isEmpty) continue

        val tableRecords = consumerRecords
          .map { record ->

            val rateRecord = record.value()

            com.ethvm.db.tables.records.TokenExchangeRateRecord()
              .apply {
                address = rateRecord.address
                name = rateRecord?.name
                symbol = rateRecord?.symbol
                image = rateRecord?.image
                currentPrice = rateRecord?.currentPrice?.toBigDecimal()
                marketCap = rateRecord?.marketCap?.toBigDecimal()
                marketCapRank = rateRecord?.marketCapRank
                totalVolume = rateRecord?.totalVolume?.toBigDecimal()
                high24h = rateRecord.high24h?.toBigDecimal()
                low24h = rateRecord.low24h?.toBigDecimal()
                priceChange24h = rateRecord.priceChange24h?.toBigDecimal()
                priceChangePercentage24h = rateRecord.priceChangePercentage24h?.toBigDecimal()
                marketCapChange24h = rateRecord.marketCapChange24h?.toBigDecimal()
                marketCapChangePercentage24h = rateRecord.marketCapChangePercentage24h?.toBigDecimal()
                circulatingSupply = rateRecord.circulatingSupply?.bigInteger()?.toBigDecimal()
                totalSupply = rateRecord.totalSupply?.bigInteger()?.toBigDecimal()
                lastUpdated = rateRecord?.lastUpdated
              }

          }

        dbContext
          .transaction { txConfig ->

            val txCtx = DSL.using(txConfig)

            tableRecords
              .forEach{ t ->
                txCtx
                  .insertInto(TOKEN_EXCHANGE_RATE)
                  .set(t)
                  .onDuplicateKeyUpdate()
                  .set(TOKEN_EXCHANGE_RATE.NAME, t.name)
                  .set(TOKEN_EXCHANGE_RATE.SYMBOL, t.symbol)
                  .set(TOKEN_EXCHANGE_RATE.IMAGE, t.image)
                  .set(TOKEN_EXCHANGE_RATE.CURRENT_PRICE, t.currentPrice)
                  .set(TOKEN_EXCHANGE_RATE.MARKET_CAP, t.marketCap)
                  .set(TOKEN_EXCHANGE_RATE.MARKET_CAP_RANK, t.marketCapRank)
                  .set(TOKEN_EXCHANGE_RATE.TOTAL_VOLUME, t.totalVolume)
                  .set(TOKEN_EXCHANGE_RATE.HIGH24H, t.high24h)
                  .set(TOKEN_EXCHANGE_RATE.LOW24H, t.low24h)
                  .set(TOKEN_EXCHANGE_RATE.PRICE_CHANGE24H, t.priceChange24h)
                  .set(TOKEN_EXCHANGE_RATE.PRICE_CHANGE_PERCENTAGE24H, t.priceChangePercentage24h)
                  .set(TOKEN_EXCHANGE_RATE.MARKET_CAP_CHANGE24H, t.marketCapChange24h)
                  .set(TOKEN_EXCHANGE_RATE.MARKET_CAP_CHANGE_PERCENTAGE24H, t.marketCapChangePercentage24h)
                  .set(TOKEN_EXCHANGE_RATE.CIRCULATING_SUPPLY, t.circulatingSupply)
                  .set(TOKEN_EXCHANGE_RATE.TOTAL_SUPPLY, t.totalSupply)
                  .set(TOKEN_EXCHANGE_RATE.LAST_UPDATED, t.lastUpdated)
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
