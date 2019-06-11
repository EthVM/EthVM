package com.ethvm.kafka.connect.transforms

import mu.KotlinLogging
import org.apache.kafka.common.config.ConfigDef
import org.apache.kafka.connect.connector.ConnectRecord
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.transforms.Transformation

abstract class StringClean<R : ConnectRecord<R>> : Transformation<R> {

  companion object {
    const val WHITELIST = "whitelist"
  }

  private val logger = KotlinLogging.logger {}

  private val filterRegex = Regex("[\\p{C}\\p{Z}]")

  var whitelist = emptyList<String>()


  override fun config() = ConfigDef().apply {
    define(WHITELIST, ConfigDef.Type.LIST, emptyList<String>(), ConfigDef.Importance.HIGH, "Fields to cleanup")
  }

  @Suppress("UNCHECKED_CAST")
  override fun configure(config: MutableMap<String, *>) {
    whitelist = (config[WHITELIST] as String).split(",")
  }

  override fun close() {
  }

  override fun apply(record: R): R {
    return when {
      operatingSchema(record) != null -> applyWithSchema(record)
      else -> applySchemaless(record)
    }
  }

  private fun applyWithSchema(record: R): R {
    val value = operatingValue(record)
    require(value is Struct) { "Value must be a struct" }

    val schema = value.schema()
    val updatedValue = Struct(value.schema())

    schema
      .fields()
      .forEach { field ->

        val fieldName = field.name()
        val fieldSchema = field.schema()

        when {
          whitelist.contains(fieldName) && (fieldSchema == Schema.STRING_SCHEMA || fieldSchema == Schema.OPTIONAL_STRING_SCHEMA) -> {
            // remove control characters and other non printable characters
            val fieldValue = value.get(field) as String?
            updatedValue.put(field, fieldValue?.replace(filterRegex, ""))
          }
          else -> updatedValue.put(field, value.get(field))
        }

      }

    return newRecord(record, schema, updatedValue)
  }

  @Suppress("UNCHECKED_CAST")
  private fun applySchemaless(record: R): R {

    val value = operatingValue(record)

    require(value is Map<*, *>) { "Only map objects are supported when there is no schema" }

    val valueMap = value as Map<String, *>

    val updatedMap = valueMap + valueMap
      .filterKeys { k -> whitelist.contains(k) }
      .mapValues{ (_, v) -> v as String? }
      .mapValues { (k, v) -> k to v?.replace(filterRegex, "") }

    return newRecord(record, null, updatedMap)
  }

  abstract fun operatingSchema(record: R): Schema?

  abstract fun operatingValue(record: R): Any?

  protected abstract fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any): R

  class Key<R : ConnectRecord<R>> : StringClean<R>() {

    override fun operatingSchema(record: R) = record.keySchema()

    override fun operatingValue(record: R) = record.key()

    override fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any) =
      record.newRecord(record.topic(), record.kafkaPartition(), updatedSchema, updatedValue, record.valueSchema(), record.value(), record.timestamp())
  }

  class Value<R : ConnectRecord<R>> : StringClean<R>() {

    override fun operatingSchema(record: R) = record.valueSchema()

    override fun operatingValue(record: R) = record.value()

    override fun newRecord(record: R, updatedSchema: Schema?, updatedValue: Any) =
      record.newRecord(record.topic(), record.kafkaPartition(), record.keySchema(), record.key(), updatedSchema, updatedValue, record.timestamp())
  }
}
