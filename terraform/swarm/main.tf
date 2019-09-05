terraform {
  required_version = ">= 0.12"
}

provider "aws" {
  region                  = var.aws_region
  shared_credentials_file = var.aws_shared_credentials_file
  profile                 = var.aws_profile
}

module "users" {
  source    = "./modules/users"
  user_name = "${var.swarm_id}"
}

module "cloudwatch" {
  source                = "./modules/cloudwatch"
  log_group_name        = "${var.swarm_id}/${var.cw_log_group_name}"
  log_retention_in_days = var.cw_log_retention_in_days
}

module "bastion" {
  source             = "./modules/bastion"
  name               = "bastion"
  swarm_id           = var.swarm_id
  ami                = var.manager_ec2_ami
  instance_type      = var.bastion_ec2_instance
  availability_zone  = "${var.aws_region}${var.bastion_zone}"
  security_group     = aws_security_group.bastion.id
  key_name           = var.aws_ssh_key_name
  ssh_key_path       = var.aws_ssh_key_path
  subnet_id          = aws_subnet.bastion.id
  connection_timeout = var.ssh_connection_timeout
  provision_user     = var.provision_user
}

module "managers" {
  source             = "./modules/manager"
  name               = "manager"
  swarm_id           = var.swarm_id
  ami                = var.manager_ec2_ami
  instance_type      = var.manager_ec2_instance
  num                = var.manager_instances
  availability_zones = var.manager_deployment_zones
  security_groups    = [aws_security_group.managers.id]
  subnet_id          = aws_subnet.managers.*.id
  ssh_key_name       = var.aws_ssh_key_name
  ssh_key_path       = var.aws_ssh_key_path
  connection_timeout = var.ssh_connection_timeout
  provision_user     = var.provision_user
  aws_access_key     = module.users.user_id
  aws_secret_key     = module.users.user_secret
  aws_region         = var.aws_region
  bastion_host       = aws_eip.bastion_ip.public_ip
}

module "web_workers" {
  source             = "./modules/worker"
  name               = "web-worker"
  swarm_id           = var.swarm_id
  ami                = var.worker_ec2_ami
  instance_type      = var.web_worker_ec2_instance
  num                = var.web_worker_instances
  availability_zones = var.web_worker_deployment_zones
  security_groups    = [aws_security_group.workers.id]
  subnet_ids         = aws_subnet.workers.*.id
  ssh_key_name       = var.aws_ssh_key_name
  ssh_key_path       = var.aws_ssh_key_path
  provision_user     = var.provision_user
  manager_private_ip = module.managers.root_manager_private_ip
  swarm_tokens       = module.managers.swarm_tokens
  aws_access_key     = module.users.user_id
  aws_secret_key     = module.users.user_secret
  aws_region         = var.aws_region
}

module "kafka_workers" {
  source             = "./modules/worker"
  name               = "kafka-worker"
  swarm_id           = var.swarm_id
  ami                = var.worker_ec2_ami
  instance_type      = var.kafka_worker_ec2_instance
  num                = var.kafka_worker_instances
  availability_zones = var.kafka_worker_deployment_zones
  security_groups    = [aws_security_group.workers.id]
  subnet_ids         = aws_subnet.workers.*.id
  ssh_key_name       = var.aws_ssh_key_name
  ssh_key_path       = var.aws_ssh_key_path
  provision_user     = var.provision_user
  manager_private_ip = module.managers.root_manager_private_ip
  swarm_tokens       = module.managers.swarm_tokens
  aws_access_key     = module.users.user_id
  aws_secret_key     = module.users.user_secret
  aws_region         = var.aws_region
}

module "processing_workers" {
  source             = "./modules/worker"
  name               = "processing-worker"
  swarm_id           = var.swarm_id
  ami                = var.worker_ec2_ami
  instance_type      = var.processing_worker_ec2_instance
  num                = var.processing_worker_instances
  availability_zones = var.processing_worker_deployment_zones
  security_groups    = [aws_security_group.workers.id]
  subnet_ids         = aws_subnet.workers.*.id
  ssh_key_name       = var.aws_ssh_key_name
  ssh_key_path       = var.aws_ssh_key_path
  provision_user     = var.provision_user
  manager_private_ip = module.managers.root_manager_private_ip
  swarm_tokens       = module.managers.swarm_tokens
  aws_access_key     = module.users.user_id
  aws_secret_key     = module.users.user_secret
  aws_region         = var.aws_region
}

module "storage_workers" {
  source             = "./modules/worker"
  name               = "storage-worker"
  swarm_id           = var.swarm_id
  ami                = var.worker_ec2_ami
  instance_type      = var.storage_worker_ec2_instance
  num                = var.storage_worker_instances
  availability_zones = var.storage_worker_deployment_zones
  security_groups    = [aws_security_group.workers.id]
  subnet_ids         = aws_subnet.workers.*.id
  ssh_key_name       = var.aws_ssh_key_name
  ssh_key_path       = var.aws_ssh_key_path
  provision_user     = var.provision_user
  manager_private_ip = module.managers.root_manager_private_ip
  swarm_tokens       = module.managers.swarm_tokens
  aws_access_key     = module.users.user_id
  aws_secret_key     = module.users.user_secret
  aws_region         = var.aws_region
}

module "alb" {
  source                  = "./modules/alb"
  swarm_id                = var.swarm_id
  alb_name                = "${var.swarm_id}-alb-balancer"
  alb_target_group_vpc_id = aws_vpc.vpc.id
  alb_subnets             = aws_subnet.public_workers.*.id
  alb_security_group      = aws_security_group.loadbalancer.id
  alb_target_list         = module.web_workers.worker_ids
  alb_target_count        = var.web_worker_instances
  enable_ssl_cert         = var.alb_enable_ssl_cert
  ssl_cert_arn            = var.alb_ssl_cert_arn
}
