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
