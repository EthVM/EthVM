package io.enkrypt.bolt

import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig
import io.confluent.kafka.streams.serdes.avro.SpecificAvroSerde
import io.enkrypt.bolt.config.AppConfig
import io.enkrypt.bolt.models.Block
import org.apache.kafka.common.serialization.Serde
import org.koin.dsl.module.module

val serdesModule = module {

  factory<Serde<Block>> { (config: AppConfig) ->
    val serde = SpecificAvroSerde<Block>()
    val blockSerdeProps = mapOf(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG to config.schemaRegistryUrl)
    serde.configure(blockSerdeProps, false)
    serde
  }

}
