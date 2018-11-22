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
