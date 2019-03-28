variable "instance_type" {
  default = "i3.large"
}

variable "ami" {}
variable "availability_zone" {}
variable "security_group" {}
variable "key_name" {}
variable "subnet_id" {}

variable "name" {
  default = "ethereum"
}

variable "volume_size" {
  default = 100
}

variable "volume_iops" {
  default = 100
}

variable "ethstats_server" {}

variable "ethstats_secret" {}
variable "client_image" {}
