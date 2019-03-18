variable "region" {
  description = "Your AWS region"
  default     = "us-east-2"
}

variable "shared_credentials_file" {
  description = "Your AWS credentials file path"
  default     = "~/.aws/credentials"
}

variable "aws_profile" {
  description = "Your AWS profile"
  default     = "ethvm-terraform"
}

variable "terraform_state_storage_s3" {
  description = "Name of the S3 Terraform State Store bucket"
  default     = "ethvm-terraform-remote"
}

variable "dynamodb_terraform_state_lock" {
  description = "DynamoDB Terraform State Lock Table"
  default     = "terraform-state-lock-dynamo"
}
