# If you have enabled s3-state previously, uncomment this section and change vars accordingly.
#
# Note: Terraform doesn't allow to use variables substitution in state definition.
#       If you have created multiple environments make sure that these variables are in place
#       for the corresponding environment.

# terraform {
#  backend "s3" {
#    encrypt        = true
#    bucket         = "ethvm-terraform-remote"
#    dynamodb_table = "terraform-state-lock-dynamo"
#    region         = "us-east-1"
#    key            = "ethvm/dev/tf-swarm.tfstate"
#    profile        = ""
#  }
#}
