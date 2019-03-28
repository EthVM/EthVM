variable "key_name" {}
variable "ami" {}
variable "availability_zone" {}
variable "instance_type" {}

variable "subnet_id" {}
variable "ssh_key_path" {}
variable "security_group" {}

variable "total_instances" {}

variable "name" {}

variable "provision_user" {}
variable "manager_public_ip" {}
variable "manager_private_ip" {}

variable "swarm_tokens" {
  type = "map"
}

variable "swarmprom_admin_user" {
  default = "admin"
}

variable "swarmprom_admin_password" {
  default = "password"
}

variable "swarmprom_slack_token" {
  default = "null"
}

variable "swarmprom_slack_channel" {
  default = "null"
}

variable "swarmprom_slack_user" {
  default = "null"
}

variable "efs_mount_target_dns" {}
