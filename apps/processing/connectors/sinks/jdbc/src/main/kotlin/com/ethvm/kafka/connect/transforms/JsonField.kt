package com.ethvm.kafka.connect.transforms

import com.datamountaineer.streamreactor.connect.json.SimpleJsonConverter
import com.fasterxml.jackson.databind.ObjectMapper
import mu.KotlinLogging
import org.apache.kafka.common.cache.Cache
import org.apache.kafka.common.cache.LRUCache
import org.apache.kafka.common.cache.SynchronizedCache
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.connect.connector.ConnectRecord
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.SchemaBuilder
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.transforms.Transformation

abstract class JsonField<R : ConnectRecord<R>> : Transformation<R> {

  companion object {
    const val WHITELIST = "whitelist"
  }

  private val logger = KotlinLogging.logger {}

  private val jsonConverter = SimpleJsonConverter()
  private val objectMapper = ObjectMapper()

  lateinit var schemaUpdateCache: Cache<Schema, Schema>

  var whitelist = emptyList<String>()

  override fun config() = ConfigDef().apply {
    define(WHITELIST, ConfigDef.Type.LIST, emptyList<String>(), ConfigDef.Importance.HIGH, "Fields to convert")
  }

  @Suppress("UNCHECKED_CAST")
  override fun configure(config: MutableMap<String, *>) {
    whitelist = (config[WHITELIST] as String).split(",")
    schemaUpdateCache = SynchronizedCache(LRUCache(32))
  }

  override fun close() {
  }

  override fun apply(record: R): R? {
    return when {
      operatingSchema(record) != null -> applyWithSchema(record)
      else -> applySchemaless(record)
    }
  }

  private fun applyWithSchema(record: R): R {
    val value = operatingValue(record)
    require(value is Struct) { "Value must be a struct" }

    var updatedSchema = schemaUpdateCache.get(value.schema())
    if (updatedSchema == null) {
      updatedSchema = makeUpdatedSchema(value.schema())
      schemaUpdateCache.put(value.schema(), updatedSchema)
    }

    val updatedValue = Struct(updatedSchema)

    updatedSchema.fields()
      .forEach { field ->

        when (whitelist.contains(field.name())) {

          false -> updatedValue.put(field, value.get(field))

          true -> {
            val fieldValue = value.get(field)
            if (fieldValue != null) {

              val json = jsonConverter.fromConnectData(
                // need to use original field schema for extracting
                value.schema().field(field.name()).schema(),
                value.get(field)
              )
              updatedValue.put(field, objectMapper.writeValueAsString(json))
            }
          }
        }
      }

    return newRecord(record, updatedSchema, updatedValue)
  }

  @Suppress("UNCHECKED_CAST")
  private fun applySchemaless(record: R): R? {

    // if value is null we are processing a tombstone so just forward it on
    val value = operatingValue(record) ?: return null

    require(value is Map<*, *>) { "Only map objects are supported when there is no schema" }

    val valueMap = value as Map<String, *>

    val updatedMap = valueMap + valueMap
      .filterKeys { key -> whitelist.contains(key) }
      .mapValues { fieldValue -> objectMapper.writeValueAsString(fieldValue) }

    return newRecord(record, null, updatedMap)
  }

  private fun makeUpdatedSchema(source: Schema): Schema {

    val builder = SchemaBuilder(Schema.Type.STRUCT).apply {
      name(source.name())
      version(source.version())
      doc(source.doc())

      if (source.parameters() != null) {
        parameters(source.parameters())
      }
    }

    source.fields()
      .forEach { field ->
        when (whitelist.contains(field.name())) {
          false -> builder.field(field.name(), field.schema())
          true -> {

            logger.trace { "Converting field: $field " }

            builder.field(
              field.name(),
              if (field.schema().isOptional)
                Schema.OPTIONAL_STRING_SCHEMA
              else
                Schema.STRING_SCHEMA
            )
          }
        }
      }

    return builder.build()
  }

  abstract fun operatingSchema(record: R): Schema?

  abstract fun operatingValue(record: R): Any?

  protected abstract fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any): R

  class Key<R : ConnectRecord<R>> : JsonField<R>() {

    override fun operatingSchema(record: R) = record.keySchema()

    override fun operatingValue(record: R) = record.key()

    override fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any) =
      record.newRecord(record.topic(), record.kafkaPartition(), updatedSchema, updatedValue, record.valueSchema(), record.value(), record.timestamp())
  }

  class Value<R : ConnectRecord<R>> : JsonField<R>() {

    override fun operatingSchema(record: R) = record.valueSchema()

    override fun operatingValue(record: R) = record.value()

    override fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any) =
      record.newRecord(record.topic(), record.kafkaPartition(), record.keySchema(), record.key(), updatedSchema, updatedValue, record.timestamp())
  }
}
