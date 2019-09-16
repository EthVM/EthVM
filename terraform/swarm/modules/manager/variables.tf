variable "ssh_key_name" {
}

variable "ssh_key_path" {
}

variable "ami" {
}

variable "availability_zones" {
  type = list(string)
}

variable "instance_type" {
}

variable "subnet_id" {
  type = list(string)
}

variable "connection_timeout" {
}

variable "security_groups" {
  type = list(string)
}

variable "num" {
}

variable "name" {
}

variable "provision_user" {
}

variable "aws_access_key" {
}

variable "aws_secret_key" {
}

variable "aws_region" {
}

variable "bastion_host" {
}

variable "swarm_id" {
}
