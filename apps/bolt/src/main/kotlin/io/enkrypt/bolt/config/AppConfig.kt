package io.enkrypt.bolt.config

data class AppConfig(
  val applicationId: String,
  val bootstrapServers: String,
  val startingOffset: String,
  val schemaRegistryUrl: String,
  val topicsConfig: TopicsConfig
)

