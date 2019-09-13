variable "alb_name" {
}

variable "alb_subnets" {
  type = list(string)
}

variable "alb_security_group" {
}

variable "alb_target_group_vpc_id" {
}

variable "alb_target_list" {
  type = list(string)
}

variable "alb_target_count" {
}

variable "enable_ssl_cert" {
  default = false
}

variable "ssl_cert_arn" {
}

variable "swarm_id" {
}

variable "explorer_url" {
}

variable "api_url" {
}
