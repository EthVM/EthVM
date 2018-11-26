variable "namespace" {
  description = "Which namespace the resources should belong to"
}

variable "kafka_version" {
  description = "Version of Kafka"
  default     = "5.0.1"
}

variable "kafka_ethvm_init_version" {
  description = "Version of Kafka Ethvm Init"
  default     = "0.1.0"
}

variable "kafka_brokers" {
  description = "Number of Kafka brokers"
  default     = 3
}

variable "kafka_storage_size" {
  description = "Storage size for Kafka"
  default     = "5Gi"
}

variable "kafka_storage_type" {
  description = "Storage type to be used by Kafka nodes"
  default     = "ssd"
}
