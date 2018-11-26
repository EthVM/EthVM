resource "google_compute_firewall" "default" {
  name        = "${var.name}"
  description = "${var.description}"
  network     = "${var.network}"
  priority    = "${var.priority}"

  allow {
    protocol = "${var.protocol}"
    ports    = "${var.ports}"
  }

  source_ranges = "${var.source_ranges}"
  target_tags   = "${var.target_tags}"
  source_tags   = "${var.source_tags}"
}
