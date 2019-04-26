variable "shared_credentials_file" {
  description = "Your AWS credentials file path"
  default     = "~/.aws/credentials"
}

variable "aws_profile" {
  description = "Your AWS profile"
  default     = "ethvm-terraform"
}

variable "region" {
  description = "Your AWS region"
  default     = "us-east-2"
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

variable "swarmprom_admin_user" {
  default = "admin"
}

variable "swarmprom_admin_password" {
  default = "password"
}

variable "swarm_manager_ip" {
  description = "IP address (public) of swarm manager"
}

variable "provision_user" {
  description = "instance user account"
  default     = "ubuntu"
}

variable "ssh_key_path" {
  description = "path of the ssh key to access swarm manager"
}

variable "connection_timeout" {
  description = "Timeout for connection to servers"
  default     = "5m"
}

variable "ethstats_secret" {
  default = "password"
}
