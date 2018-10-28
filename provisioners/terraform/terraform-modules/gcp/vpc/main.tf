resource "google_compute_network" "ntw" {
  name                    = "${var.name}"
  description             = "${var.description}"
  auto_create_subnetworks = "true"
}
