variable "bolt_version" {
  description = "Version of Bolt"
  default     = "0.1.0"
}

variable "bolt_nodes" {
  description = "Number of nodes running Bolt"
  default     = 1
}

variable "namespace" {
  description = "Which namespace the resources should belong to"
}
