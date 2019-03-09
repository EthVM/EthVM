variable "namespace" {
  description = "Which namespace the resources should belong to"
}

variable "kafka_streams_version" {
  description = "Version of Kafka Streams"
  default     = "0.1.0"
}

variable "kafka_streams_nodes" {
  description = "Number of nodes running Kafka Streams"
  default     = 1
}
