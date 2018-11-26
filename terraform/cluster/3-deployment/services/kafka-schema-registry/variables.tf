variable "namespace" {
  description = "Which namespace the resources should belong to"
}

variable "kafka_schema_registry_version" {
  description = "Version of Kafka Schema Registry"
  default     = "5.0.1-1"
}
