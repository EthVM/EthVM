resource "google_dns_managed_zone" "primary" {
  name        = "ethvm-prod-zone"
  description = "DNS zone for the EthVM domain"
  dns_name    = "${var.domain_name}"
}

resource "google_dns_record_set" "a_ethvm" {
  name = "${google_dns_managed_zone.primary.dns_name}"
  type = "A"
  ttl  = 300

  managed_zone = "${google_dns_managed_zone.primary.name}"

  rrdatas = ["${google_compute_global_address.ethvm_static_ip.address}"]
}
