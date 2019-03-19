variable "subnet_ids" {
  type    = "list"
  default = []
}

variable "encrypted" {
  default = false
}

variable "performance_mode" {
  default = "generalPurpose"
}

variable "name" {
  default = "efs-volume"
}

variable "security_group_id" {}
