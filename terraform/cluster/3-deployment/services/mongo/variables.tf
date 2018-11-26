variable "namespace" {
  description = "Which namespace the resources should belong to"
}

variable "chain" {
  description = "Name of the chain (will be used for DB names)"
}

variable "mongodb_version" {
  description = "Version of MongoDb"
  default     = "4.0"
}

variable "mongodb_ethvm_init_version" {
  description = "Version of MongoDb Ethvm Init"
  default     = "0.1.0"
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
