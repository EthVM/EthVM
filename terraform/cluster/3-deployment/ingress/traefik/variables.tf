variable "traefik_version" {
  description = "The version of Traefik to use"
  default     = "1.7.3"
}

variable "traefik_acme_email" {
  description = "The email for ACME (Let's Enkrypt certificate)"
}

variable "traefik_domain" {
  description = "Domain Traefik should ask for ACME (Let's Encrypt certificates)"
}

variable "traefik_api_subdomain" {
  description = "Subdomain for API"
}
