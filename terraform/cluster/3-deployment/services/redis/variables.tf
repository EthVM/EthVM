variable "redis_version" {
  description = "Version of Redis"
  default     = "5.0.0"
}

variable "redis_storage_size" {
  description = "Storage size for Redis"
  default     = "5Gi"
}

variable "redis_storage_type" {
  description = "Storage type to be used by Redis nodes"
  default     = "ssd"
}

variable "namespace" {
  description = "Which namespace the resources should belong to"
}
