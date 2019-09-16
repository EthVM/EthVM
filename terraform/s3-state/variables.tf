variable "region" {
  description = "Your AWS region"
  default     = "us-east-1"
}

variable "shared_credentials_file" {
  description = "Your AWS credentials file path"
}

variable "aws_profile" {
  description = "Your AWS profile"
}

variable "terraform_state_storage_s3" {
  description = "Name of the S3 Terraform State Store bucket"
  default     = "ethvm-terraform-remote"
}

variable "dynamodb_terraform_state_lock" {
  description = "DynamoDB Terraform State Lock Table"
  default     = "terraform-state-lock-dynamo"
}
