package com.ethvm.kafka.connect.transforms

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

abstract class SnakeCase<R : ConnectRecord<R>> : Transformation<R> {

  private val logger = KotlinLogging.logger {}

  lateinit var schemaUpdateCache: Cache<Schema, Schema>

  var whitelist = emptyList<String>()

  override fun config() = ConfigDef()

  @Suppress("UNCHECKED_CAST")
  override fun configure(config: MutableMap<String, *>) {
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
        updatedValue.put(field, value.get(field.name().snakeToCamelCase()))
      }

    return newRecord(record, updatedSchema, updatedValue)
  }

  @Suppress("UNCHECKED_CAST")
  private fun applySchemaless(record: R): R? {

    // if value is null we are processing a tombstone so just forward it on
    val value = operatingValue(record) ?: return null

    require(value is Map<*, *>) { "Only map objects are supported when there is no schema" }

    val valueMap = (value as Map<String, *>)
      .mapKeys { (k, _) -> k.camelToSnakeCase() }

    return newRecord(record, null, valueMap)
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
      .forEach { field -> builder.field(field.name().camelToSnakeCase(), field.schema()) }

    return builder.build()
  }

  abstract fun operatingSchema(record: R): Schema?

  abstract fun operatingValue(record: R): Any?

  protected abstract fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any): R

  class Key<R : ConnectRecord<R>> : SnakeCase<R>() {

    override fun operatingSchema(record: R) = record.keySchema()

    override fun operatingValue(record: R) = record.key()

    override fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any) =
      record.newRecord(record.topic(), record.kafkaPartition(), updatedSchema, updatedValue, record.valueSchema(), record.value(), record.timestamp())
  }

  class Value<R : ConnectRecord<R>> : SnakeCase<R>() {

    override fun operatingSchema(record: R) = record.valueSchema()

    override fun operatingValue(record: R) = record.value()

    override fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any) =
      record.newRecord(record.topic(), record.kafkaPartition(), record.keySchema(), record.key(), updatedSchema, updatedValue, record.timestamp())
  }
}
