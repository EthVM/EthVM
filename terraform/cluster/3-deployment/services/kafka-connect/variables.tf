variable "kafka_connect_version" {
  description = "Version of Kafka Connect"
  default     = "5.0.0-1"
}

variable "kafka_connect_ethvm_init_version" {
  description = "Version of Kafka Connect Ethvm Init"
  default     = "0.1.0"
}

variable "kafka_connect_storage_size" {
  description = "Storage size for Kafka Connect"
  default     = "5Gi"
}

variable "kafka_connect_storage_type" {
  description = "Storage type to be used by Kafka Connect nodes"
  default     = "ssd"
}
