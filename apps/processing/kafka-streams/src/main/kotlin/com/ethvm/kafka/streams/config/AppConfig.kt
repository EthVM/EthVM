package com.ethvm.kafka.streams.config

data class AppConfig(
  val unitTesting: Boolean,
  val kafka: KafkaConfig,
  val web3: Web3Config
)
