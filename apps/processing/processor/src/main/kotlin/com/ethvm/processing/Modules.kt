package com.ethvm.processing

import com.ethvm.common.config.NetConfig
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.confluent.kafka.serializers.KafkaAvroDeserializer
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import org.koin.core.qualifier.named
import org.koin.dsl.module
import org.web3j.protocol.Web3j
import org.web3j.protocol.websocket.WebSocketService
import java.util.Properties
import java.util.concurrent.Executors
import javax.sql.DataSource

data class DbConfig(
  val url: String,
  val username: String,
  val password: String,
  val maxConnections: Int
)

data class KafkaConfig(
  val bootstrapServers: String,
  val schemaRegistryUrl: String
)

val dbModule = module {

  single<DataSource> {

    val dbConfig = get<DbConfig>()

    val dataSourceConfig = HikariConfig()
      .apply {
        this.jdbcUrl = dbConfig.url
        this.username = dbConfig.username
        this.password = dbConfig.password
        this.maximumPoolSize = dbConfig.maxConnections
        this.addDataSourceProperty("cachePrepStmts", "true")
        this.addDataSourceProperty("prepStmtCacheSize", "250")
        this.addDataSourceProperty("prepStmtCacheSqlLimit", "2048")
      }

    HikariDataSource(dataSourceConfig)
  }

  single<DSLContext> {
    DSL.using(get<DataSource>(), SQLDialect.POSTGRES)
  }
}

val web3Module = module {

  single<Web3j> {

    val web3Url = get<String>(named("wsUrl"))

    val wsService = WebSocketService(web3Url, false)
    wsService.connect()
    Web3j.build(wsService)
  }
}

val kafkaModule = module {

  single(named("baseKafkaProps")) {

    val kafkaConfig = get<KafkaConfig>()

    Properties()
      .apply {
        put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaConfig.bootstrapServers)
        put("schema.registry.url", kafkaConfig.schemaRegistryUrl)
        put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
        put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
        put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, 30000)
        put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true)
        put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 1) // we process one block's worth of data at a time
      }
  }

  single(named("topicBlocks")) {
    val netConfig = get<NetConfig>()
    "${netConfig.chainId.name.toLowerCase()}_blocks"
  }

  single(named("topicTraces")) {
    val netConfig = get<NetConfig>()
    "${netConfig.chainId.name.toLowerCase()}_traces"
  }

  single(named("topicParitySyncState")) {
    val netConfig = get<NetConfig>()
    "${netConfig.chainId.name.toLowerCase()}_parity_sync_state"
  }
}

val threadingModule = module {

  single() {
    Executors.newCachedThreadPool()
  }

  single() {
    val count = get<Int>(named("scheduledThreadCount"))
    Executors.newScheduledThreadPool(count)
  }
}
