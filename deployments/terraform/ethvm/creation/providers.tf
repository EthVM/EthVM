provider "google" {
  version     = "~> 1.19.1"
  credentials = "${file("../../config/gcp/credentials.json")}"
  project     = "${var.project_id}"
  region      = "${var.region}"
}
