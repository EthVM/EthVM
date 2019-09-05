variable "swarm_id" {
  description = "Name of the cluster"
}

variable "aws_profile" {
  description = "Your AWS profile"
}

variable "aws_region" {
  description = "Your AWS region"
  default     = "us-east-1"
}

variable "aws_shared_credentials_file" {
  description = "Your AWS credentials file path"
  default     = "~/.aws/credentials"
}

variable "aws_ssh_key_name" {
  description = "Your AWS key pair name"
}

variable "aws_ssh_key_path" {
  description = "Your AWS key path, path to .pem file"
}

variable "ssh_connection_timeout" {
  description = "Timeout for connection to servers"
  default     = "5m"
}

variable "bastion_ec2_instance" {
  default = "t2.small"
}

variable "bastion_zone" {
  description = "Zone for the bastion"
  default     = "a"
}

variable "manager_ec2_ami" {
  description = "AMI for EC2 instance"
  default     = "ami-0015419a71c26a858"
}

variable "worker_ec2_ami" {
  description = "AMI for EC2 instance"
  default     = "ami-0015419a71c26a858"
}

variable "manager_availability_zones" {
  description = "List of availability zones for managers"
  type        = list(string)
  default     = ["a", "b", "c"]
}

variable "worker_availability_zones" {
  description = "List of availability zones for workers (all of them)"
  type        = list(string)
  default     = ["a", "b", "c"]
}

variable "manager_instances" {
  description = "Number of managers"
  default     = "3"
}

variable "manager_ec2_instance" {
  description = "Type for EC2 instance"
  default     = "t3a.medium"
}

variable "manager_deployment_zones" {
  description = "List of availability zones for managers"
  type        = list(string)
  default     = ["a", "b", "c"]
}

variable "web_worker_instances" {
  description = "Number of web workers"
  default     = "3"
}

variable "web_worker_ec2_instance" {
  description = "Type for EC2 instance"
  default     = "t3a.medium"
}

variable "web_worker_deployment_zones" {
  description = "List of availability zones for workers"
  type        = list(string)
  default     = ["a", "b", "c"]
}

variable "kafka_worker_instances" {
  description = "Number of kafka workers"
  default     = "3"
}

variable "kafka_worker_ec2_instance" {
  description = "Type for EC2 instance"
  default     = "t3a.medium"
}

variable "kafka_worker_deployment_zones" {
  description = "List of availability zones for kafka workers"
  type        = list(string)
  default     = ["a", "b", "c"]
}

variable "processing_worker_instances" {
  description = "Number of kafka workers"
  default     = "3"
}

variable "processing_worker_ec2_instance" {
  description = "Type for EC2 instance"
  default     = "t3a.medium"
}

variable "processing_worker_deployment_zones" {
  description = "List of availability zones for processing workers"
  type        = list(string)
  default     = ["a", "b", "c"]
}

variable "storage_worker_instances" {
  description = "Number of kafka workers"
  default     = "3"
}

variable "storage_worker_ec2_instance" {
  description = "Type for EC2 instance"
  default     = "t3a.medium"
}

variable "storage_worker_deployment_zones" {
  description = "List of availability zones for storage workers"
  type        = list(string)
  default     = ["a", "b", "c"]
}

variable "provision_user" {
  description = "instance user account"
  default     = "ubuntu"
}

variable "allowed_inbound_ssh" {
  description = "list of IPs with inbound ssh access"
  default     = ["0.0.0.0/0"]
}

variable "alb_target_group_name" {
  description = "Name for application load balancer target group"
  default     = "alb-targetgroup"
}

variable "cw_log_group_name" {
  description = "Name of Cloudwatch log group"
  default     = "swarm"
}

variable "cw_log_retention_in_days" {
  description = "Retention period"
  default     = "7"
}

variable "alb_enable_ssl_cert" {
  description = "Enables or disables SSL support"
  default     = false
}

variable "alb_ssl_cert_arn" {
  description = "ARN of the SSL certificate"
  default     = ""
}
