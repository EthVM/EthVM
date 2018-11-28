module "traefik" {
  source = "./traefik"

  traefik_acme_email    = "${var.email}"
  traefik_domain        = "${var.domain}"
  traefik_api_subdomain = "${var.api_subdomain_name}"
}
