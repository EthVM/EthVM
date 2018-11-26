variable "api_version" {
  description = "Version of API"
  default     = "0.1.0"
}

variable "api_nodes" {
  description = "Number of API nodes"
  default     = 1
}

variable "namespace" {
  description = "Which namespace the resources should belong to"
}

variable "chain" {
  description = "Name of the chain (will be used for DB names)"
}
