variable "version" {
  description = "Terraform deployment version"
  default     = "0.0.1"
}

variable "shared_credentials_file" {
  description = "Your AWS credentials file path"
  default     = "~/.aws/credentials"
}

variable "aws_profile" {
  description = "Your AWS profile"
  default     = "ethvm-terraform"
}

variable "region" {
  description = "Your AWS region"
  default     = "us-east-2"
}

variable "ssh_key_name" {
  description = "Your AWS key pair name"
}

variable "ssh_key_path" {
  description = "Your AWS key path, path to .pem file"
}

variable "connection_timeout" {
  description = "Timeout for connection to servers"
  default     = "5m"
}

variable "ec2_ami_manager" {
  description = "AMI for EC2 instance"
  default     = "ami-0653e888ec96eab9b"
}

variable "ec2_ami_worker" {
  description = "AMI for EC2 instance"
  default     = "ami-0653e888ec96eab9b"
}

variable "ec2_instance_type_manager" {
  description = "Type for EC2 instance"
  default     = "t2.micro"
}

variable "ec2_instance_type_worker" {
  description = "Type for EC2 instance"
  default     = "t2.micro"
}

variable "total_manager_instances" {
  description = "Number of Managers"
  default     = "1"
}
