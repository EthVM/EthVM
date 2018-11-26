package io.enkrypt.bolt

import io.enkrypt.kafka.db.BlockSummaryStore
import org.ethereum.datasource.DbSettings
import org.ethereum.datasource.rocksdb.RocksDbDataSource
import org.koin.dsl.module.module

object TestModules {

  val configModule = module("config") {

    single {
      KafkaConfig(
        "test:1234",
        "earliest",
        "test",
        "test:1234",
        KafkaInputTopicsConfig(
          Cli.DEFAULT_BLOCK_SUMMARIES_TOPIC,
          Cli.DEFAULT_PENDING_TXS_TOPIC,
          Cli.DEFAULT_METADATA_TOPIC
        ))
    }

    single { AppConfig(get()) }

  }


}
