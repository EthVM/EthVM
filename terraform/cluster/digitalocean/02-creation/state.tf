terraform {
  backend "s3" {
    endpoint                    = "sfo2.digitaloceanspaces.com"
    encrypt                     = true
    region                      = "us-west-2"
    key                         = "terraform.tfstate"
    skip_requesting_account_id  = true
    skip_credentials_validation = true
    skip_get_ec2_platforms      = true
    skip_metadata_api_check     = true
  }
}
