variable "do_token" {
  description = "Digital Token with write access"
}

variable "spaces_access_id" {
  description = "Spaces access id value"
}

variable "spaces_secret_key" {
  description = "Spaces secret key value"
}

variable "terraform_state_storage_s3" {
  description = "Name of the S3 Terraform State Store bucket"
  default     = "ethvm-terraform-remote"
}

variable "terraform_state_storage_region" {
  description = "Region of where state is going to be stored"
  default = "sfo2"
}
