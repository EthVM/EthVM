provider "google" {
  version     = "~> 1.19"
  credentials = "${file("../../config/gcp/credentials.json")}"
  project     = "${var.project_id}"
  region      = "${var.region}"
}

provider "google-beta" {
  version     = "~> 1.19"
  credentials = "${file("../../config/gcp/credentials.json")}"
  project     = "${var.project_id}"
  region      = "${var.region}"
}
