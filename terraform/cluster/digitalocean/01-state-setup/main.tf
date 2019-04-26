provider "digitalocean" {
  token             = "${var.do_token}"
  spaces_access_id  = "${var.spaces_access_id}"
  spaces_secret_key = "${var.spaces_secret_key}"
}

resource "digitalocean_spaces_bucket" "terraform-state-storage-s3" {
  name   = "${var.terraform_state_storage_s3}"
  region = "${var.terraform_state_storage_region}"
}
