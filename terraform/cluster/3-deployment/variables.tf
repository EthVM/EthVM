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
