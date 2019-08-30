package com.ethvm.processing.processors

import com.beust.klaxon.Klaxon
import com.ethvm.avro.capture.ContractKeyRecord
import com.ethvm.avro.capture.EthListRecord
import com.ethvm.db.Tables.ETH_LIST_CONTRACT_METADATA
import com.ethvm.db.tables.records.EthListContractMetadataRecord
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.time.Duration
import java.util.Properties

class EthListProcessor(
  private val baseKafkaProps: Properties,
  private val dbContext: DSLContext
) : Processor {

  private val logger = KotlinLogging.logger {}

  private val klaxon = Klaxon()

  private val kafkaProps = Properties().apply {

    putAll(baseKafkaProps)

    put(ConsumerConfig.GROUP_ID_CONFIG, "eth-list-processor")
    put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false)
    put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
  }

  private val pollTimeout = Duration.ofSeconds(10)

  private val consumer = KafkaConsumer<ContractKeyRecord, EthListRecord>(kafkaProps)
    .apply {
      subscribe(listOf("eth_list_contract_metadata"))
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

            val ethRecord = record.value()

            EthListContractMetadataRecord()
              .apply {
                address = ethRecord.address
                name = ethRecord.name
                symbol = ethRecord.symbol
                decimals = ethRecord.decimals
                ensAddress = ethRecord.ensAddress
                type = ethRecord.type
                logo = klaxon.toJsonString(ethRecord.logo)
                support = klaxon.toJsonString(ethRecord.support)
                social = klaxon.toJsonString(ethRecord.social)
                website = ethRecord.website
              }

          }

        dbContext
          .transaction { txConfig ->

            val txCtx = DSL.using(txConfig)

            tableRecords
              .forEach{ t ->
                txCtx
                  .insertInto(ETH_LIST_CONTRACT_METADATA)
                  .set(t)
                  .onDuplicateKeyUpdate()
                  .set(ETH_LIST_CONTRACT_METADATA.NAME, t.name)
                  .set(ETH_LIST_CONTRACT_METADATA.SYMBOL, t.symbol)
                  .set(ETH_LIST_CONTRACT_METADATA.DECIMALS, t.decimals)
                  .set(ETH_LIST_CONTRACT_METADATA.ENS_ADDRESS, t.ensAddress)
                  .set(ETH_LIST_CONTRACT_METADATA.TYPE, t.type)
                  .set(ETH_LIST_CONTRACT_METADATA.LOGO, t.logo)
                  .set(ETH_LIST_CONTRACT_METADATA.SUPPORT, t.support)
                  .set(ETH_LIST_CONTRACT_METADATA.SOCIAL, t.social)
                  .set(ETH_LIST_CONTRACT_METADATA.WEBSITE, t.website)
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
