## -----------------------
## Generic
## -----------------------

variable "domain" {
  description = "Default domain on which EthVM will be running"
}

variable "api_subdomain" {
  description = "Subdomain for API"
  default     = "api"
}

## -----------------------
## Zookeeper configuration
## -----------------------

variable "zookeeper_version" {
  description = "Version of Zookeeper"
  default     = "3.4.13"
}

variable "zookeeper_nodes" {
  description = "Number of Zookeeper nodes"
  default     = 3
}

variable "zookeeper_storage_size" {
  description = "Storage size for Zookeeper"
  default     = "5Gi"                        # Value for production: 64Gi
}

variable "zookeeper_storage_type" {
  description = "Storage type to be used by Zookeeper nodes"
  default     = "ssd"
}

## -------------------
## Kafka configuration
## -------------------

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

## ---------------------------
## Kafka Connect configuration
## ---------------------------

variable "kafka_connect_version" {
  description = "Version of Kafka Connect"
  default     = "5.0.0-1"
}

variable "kafka_connect_storage_size" {
  description = "Storage size for Kafka Connect"
  default     = "5Gi"
}

variable "kafka_connect_storage_type" {
  description = "Storage type to be used by Kafka Connect nodes"
  default     = "ssd"
}

## -----------------------------------
## Kafka Schema Registry configuration
## -----------------------------------

variable "kafka_schema_registry_version" {
  description = "Version of Kafka Schema Registry"
  default     = "5.0.1-1"
}

## ---------------------
## MongoDb Configuration
## ---------------------

variable "mongodb_version" {
  description = "Version of MongoDb"
  default     = "4.0"
}

variable "mongodb_nodes" {
  description = "Number of MongoDb nodes"
  default     = 2
}

variable "mongodb_storage_size" {
  description = "Storage size for MongoDb"
  default     = "5Gi"
}

variable "mongodb_storage_type" {
  description = "Storage type to be used by MongoDb nodes"
  default     = "ssd"
}

## -------------------
## Redis configuration
## -------------------

variable "redis_version" {
  description = "Version of Redis"
  default     = "5.0.0"
}

variable "redis_storage_size" {
  description = "Storage size for Redis"
  default     = "ssd"
}

variable "redis_storage_type" {
  description = "Storage type to be used by Redis nodes"
  default     = "5Gi"
}

## -----------------
## API configuration
## -----------------

variable "api_version" {
  description = "Version of API"
  default     = "0.1.0"
}

variable "api_nodes" {
  description = "Number of API nodes"
  default     = 1
}

## ----------------------
## Explorer configuration
## ----------------------

variable "explorer_version" {
  description = "Version of Explorer"
  default     = "0.1.0"
}

variable "explorer_nodes" {
  description = "Number of Explorer nodes"
  default     = 1
}

## ---------------------
## Traefik configuration
## ---------------------

variable "traefik_version" {
  description = "The version of Traefik to use"
  default     = "1.7.3"
}

variable "traefik_enable_acme" {
  description = "Enables ACME (SSL) for Traefik"
  default     = true
}

variable "traefik_acme_email" {
  description = "The email for ACME (Let's Enkrypt certificate)"
  default     = "test@email.com"
}
