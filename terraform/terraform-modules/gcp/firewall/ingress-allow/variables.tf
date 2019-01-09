variable "name" {
  description = "The name of the firewall rule"
}

variable "description" {
  description = "The description of the firewall rule"
}

variable "network" {
  description = "The network this firewall rule applies to"
  default     = "default"
}

variable "priority" {
  description = "The firewall rule priority"
  default     = "1000"
}

variable "protocol" {
  description = "The name of the protocol to allow"
  default     = "tcp"
}

variable "ports" {
  description = "A list of ports and/or port ranges to allow"
  type        = "list"
}

variable "source_ranges" {
  description = "A list of source CIDR ranges that this firewall applies to"
  default     = ["0.0.0.0/0"]
}

variable "source_tags" {
  description = "A list of source tags for this firewall rule"
  default     = []
}

variable "target_tags" {
  description = "A list of target tags for this firewall rule"
  default     = []
}
