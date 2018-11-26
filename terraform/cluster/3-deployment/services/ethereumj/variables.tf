variable "namespace" {
  description = "Which namespace the resources should belong to"
}

variable "ethereumj_version" {
  description = "Version of EthereumJ"
  default     = "0.1.0"
}

variable "ethereumj_storage_size" {
  description = "Storage size for EthereumJ"
  default     = "5Gi"
}

variable "ethereumj_storage_type" {
  description = "Storage type to be used by EtherumJ"
  default     = "ssd"
}

variable "ethereumj_conf" {
  description = "Name of the configuration file that configures EthereumJ client"
  default     = "ethereumj-mainnet.conf"
}

variable "ethereumj_mainclass" {
  description = "Name of the class that EthereumJ will use to kickstart the client"
  default     = "io.enkrypt.kafka.EthereumKafkaStarter"
}

variable "ethereumj_kafka_bootstrap_servers" {
  description = "Initial hosts that act as the starting point for a Kafka client to discover the full set of alive servers in the cluster"
  default     = "kafka:9092"
}

variable "ethereumj_kafka_registry_url" {
  description = "URL for Schema Registry instances that can be used to register or look up schemas"
  default     = "http://kafka-schema-registry:8081"
}
