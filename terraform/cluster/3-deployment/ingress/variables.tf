variable "email" {
  description = "The email for ACME (Let's Enkrypt certificate) to register"
}

variable "domain" {
  description = "Main domain to use (e.g: ethvm.org)"
}

variable "api_subdomain_name" {
  description = "Subdomain name for API (final URL will be: https://api.ethvm.org)"
  default = "api"
}
