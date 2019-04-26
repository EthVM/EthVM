terraform {
  backend "s3" {
    endpoint       = "nyc3.digitaloceanspaces.com"
    encrypt        = true
    bucket         = "ethvm-terraform-remote"
    dynamodb_table = "terraform-state-lock-dynamo"
    region         = "us-west-2"
    key            = "dev/test/terraform-swarm.tfstate"
    profile        = "ethvm-terraform"
    skip_requesting_account_id = true
    skip_get_ec2_platforms = true
    skip_metadata_api_check = true
  }
}
