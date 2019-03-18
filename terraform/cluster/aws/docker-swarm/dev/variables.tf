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
  default     = "ami-0edb6536b94aa8642"
}

variable "ec2_ami_worker" {
  description = "AMI for EC2 instance"
  default     = "ami-0edb6536b94aa8642"
}

variable "ec2_instance_type_manager" {
  description = "Type for EC2 instance"
  default     = "t2.medium"
}

variable "manager_zone" {
  description = "zone for managers a,b,c"
  default     = "a"
}

variable "ec2_instance_type_worker" {
  description = "Type for EC2 instance"
  default     = "t2.medium"
}

variable "worker_zone" {
  description = "zone for workers a,b,c"
  default     = "b"
}

variable "total_manager_instances" {
  description = "Number of Managers"
  default     = "3"
}

variable "total_worker_instances" {
  description = "Number of Managers"
  default     = "3"
}

variable "provision_user" {
  description = "instance user account"
  default     = "ubuntu"
}

variable "allowed_inbound_ssh" {
  description = "list of IPs with inbound ssh access"
  default     = ["0.0.0.0/0"]
}
