variable "admin_user" {
  default = "admin"
}

variable "admin_password" {
  default = "password"
}

variable "slack_token" {
  default = "null"
}

variable "slack_channel" {
  default = "null"
}

variable "slack_user" {
  default = "null"
}

variable "host" {}

variable "provision_user" {}
variable "ssh_key_path" {}
variable "connection_timeout" {}

variable "ethstats_secret" {}
