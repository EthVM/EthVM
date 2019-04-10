terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "ethvm-terraform-remote"
    dynamodb_table = "terraform-state-lock-dynamo"
    region         = "us-west-2"
    key            = "dev/test/terraform-ethvm.tfstate"
    profile        = "ethvm-terraform"
  }
}
