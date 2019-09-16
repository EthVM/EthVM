variable "aws_access_key" {
}

variable "aws_secret_key" {
}

variable "aws_region" {
}

variable "availability_zones" {
  type = list(string)
}

variable "security_groups" {
  type = list(string)
}

variable "ssh_key_name" {
}

variable "ssh_key_path" {
}

variable "ami" {
}

variable "instance_type" {
}

variable "subnet_ids" {
  type = list(string)
}

variable "num" {
}

variable "name" {
}

variable "provision_user" {
}

variable "manager_private_ip" {
}

variable "swarm_tokens" {
  type = map(string)
}

variable "swarm_id" {
}
