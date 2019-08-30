package com.ethvm.processing

import com.ethvm.common.config.NetConfig
import com.ethvm.processing.processors.BasicDataProcessor
import com.ethvm.processing.processors.BlockMetricsHeaderProcessor
import com.ethvm.processing.processors.BlockMetricsTraceProcessor
import com.ethvm.processing.processors.CoinExchangeRateProcessor
import com.ethvm.processing.processors.ContractLifecycleProcessor
import com.ethvm.processing.processors.EthListProcessor
import com.ethvm.processing.processors.EtherBalanceProcessor
import com.ethvm.processing.processors.ParitySyncStatusProcessor
import com.ethvm.processing.processors.TokenBalanceProcessor
import com.ethvm.processing.processors.TokenExchangeRateProcessor
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.confluent.kafka.serializers.KafkaAvroDeserializer
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import org.web3j.protocol.Web3j
import org.web3j.protocol.websocket.WebSocketService
import java.util.Properties
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class ProcessorApp(private val netConfig: NetConfig,
                   jdbcUrl: String,
                   dbUsername: String,
                   dbPassword: String,
                   dbMaxConnections: Int = 30,
                   kafkaBootstrapServers: String,
                   kafkaSchemaRegistryUrl: String,
                   private val storageDir: String,
                   private val topicBlocks: String,
                   private val topicTraces: String,
                   private val topicParitySyncState: String,
                   web3Url: String) {

  private val logger = KotlinLogging.logger {}

  private val dataSourceConfig = HikariConfig().apply {
    this.jdbcUrl = jdbcUrl
    this.username = dbUsername
    this.password = dbPassword
    this.maximumPoolSize = dbMaxConnections
    this.addDataSourceProperty("cachePrepStmts", "true")
    this.addDataSourceProperty("prepStmtCacheSize", "250")
    this.addDataSourceProperty("prepStmtCacheSqlLimit", "2048")
  }

  private val dataSource = HikariDataSource(dataSourceConfig)

  private val web3: Web3j by lazy {
    val wsService = WebSocketService(web3Url, false)
    wsService.connect()
    Web3j.build(wsService)
  }

  private val kafkaProps = Properties()
    .apply {
      put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaBootstrapServers)
      put("schema.registry.url", kafkaSchemaRegistryUrl)
      put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
      put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
      put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, 30000)
      put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true)
    }

  private val executor = Executors
    .newCachedThreadPool { r ->
      val thread = Thread(r)
      thread.isDaemon = false
      thread
    }

  private val scheduledExecutor = Executors.newScheduledThreadPool(6)

  fun start() {

    val dbContext = DSL.using(dataSource, SQLDialect.POSTGRES)

    val processors = listOf(
      BasicDataProcessor(netConfig, kafkaProps, dbContext, storageDir, scheduledExecutor, topicBlocks),
      EtherBalanceProcessor(netConfig, kafkaProps, dbContext, storageDir, scheduledExecutor, topicTraces),
      ContractLifecycleProcessor(netConfig, kafkaProps, dbContext, storageDir, scheduledExecutor, web3, topicTraces),
      TokenBalanceProcessor(netConfig, kafkaProps, dbContext, storageDir, scheduledExecutor, topicBlocks),
      BlockMetricsHeaderProcessor(netConfig, kafkaProps, dbContext, storageDir, scheduledExecutor, topicBlocks),
      BlockMetricsTraceProcessor(netConfig, kafkaProps, dbContext, storageDir, scheduledExecutor, topicTraces),
      ParitySyncStatusProcessor(netConfig, kafkaProps, dbContext, topicParitySyncState),
      EthListProcessor(kafkaProps, dbContext),
      TokenExchangeRateProcessor(kafkaProps, dbContext),
      CoinExchangeRateProcessor(kafkaProps, dbContext)
    )

    Runtime.getRuntime().addShutdownHook(Thread(Runnable {

      logger.info { "Shutdown hook initiated" }

      processors.map { it.stop() }

      executor.shutdown()
      executor.awaitTermination(30, TimeUnit.SECONDS)
    }))

    processors.forEach { it.initialise() }

    val futures = processors
      .map { executor.submit(it) }

    futures.map { it.get() }

  }

}

