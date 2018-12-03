variable "domain" {
  description = "Default domain on which EthVM will be running"
}

variable "api_subdomain_name" {
  description = "Subdomain name for API"
  default     = "api"
}

variable "email" {
  description = "Default email address to register on Let's Encrypt for issuing SSL certificate"
}

variable "chain" {
  description = "Name of the chain (will be used for DB names mainly)"
  default     = "eth_mainnet"
}
