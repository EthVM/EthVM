variable "do_token" {
  description = "Digital Token with write access"
}

variable "image" {
  description = "Image to be used by Docker nodes"
  default = "docker-18-04"
}

variable "manager_name" {
  description = "Name of the Docker manager node(s)"
  default     = "manager"
}

variable "worker_name" {
  description = "Name of the Docker worker node(s)"
  default     = "worker"
}

variable "total_manager_instances" {
  description = "Number of Managers"
  default     = "3"
}

variable "total_worker_instances" {
  description = "Number of Managers"
  default     = "3"
}

variable "connection_timeout" {
  description = "Timeout for connection to servers"
  default     = "5m"
}

variable "ssh_keys" {
  description = "A list of SSH IDs or fingerprints to enable in the format [12345, 123456] that are added to worker nodes"
  type        = "list"
}

variable "provision_ssh_key" {
  description = "File path to SSH private key used to access the provisioned nodes. Ensure this key is listed in the manager and work ssh keys list"
  default     = "~/.ssh/id_rsa"
}

variable "provision_user" {
  description = "User used to log in to the droplets via ssh for issueing Docker commands"
  default     = "root"
}

variable "region" {
  description = "Datacenter region in which the cluster will be created"
  default     = "sfo2"
}

variable "user_data" {
  description = "User data content for worker nodes. Use this for installing a configuration management tool, such as Puppet or installing Docker"

  default = <<EOF
  #!/bin/sh
EOF
}

variable "manager_tags" {
  description = "List of DigitalOcean tag ids"
  default     = []
  type        = "list"
}

variable "worker_tags" {
  description = "List of DigitalOcean tag ids"
  type        = "list"
  default     = []
}

variable "remote_api_ca" {
  description = "CA file path for the docker remote API"
  default     = ""
}

variable "remote_api_key" {
  description = "Private key file path for the docker remote API"
  default     = ""
}

variable "remote_api_certificate" {
  description = "Certificate file path for the docker remote API"
  default     = ""
}

variable "allowed_inbound_ssh_adresses" {
  description = "An array of strings containing the IPv4 addresses, IPv6 addresses, IPv4 CIDRs, and/or IPv6 CIDRs from which the inbound SSH traffic will be accepted."
  type        = "list"
  default     = ["0.0.0.0/0", "::/0"]
}
