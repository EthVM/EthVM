provider "aws" {
  region                  = "${var.region}"
  shared_credentials_file = "${var.shared_credentials_file}"
  profile                 = "${var.aws_profile}"
}

module "managers" {
  source             = "./modules/manager"
  name               = "swarm-manager"
  ami                = "${var.ec2_ami_manager}"
  availability_zone  = "${var.region}${var.manager_zone}"
  instance_type      = "${var.ec2_instance_type_manager}"
  security_group     = "${aws_security_group.ingress-manager.id}"
  key_name           = "${var.ssh_key_name}"
  subnet_id          = "${aws_subnet.subnet-managers.id}"
  ssh_key_path       = "${var.ssh_key_path}"
  connection_timeout = "${var.connection_timeout}"
  total_instances    = "${var.total_manager_instances}"
  provision_user     = "${var.provision_user}"
  aws_eip            = "${aws_eip.manager-ip.public_ip}"
}

module "workers" {
  source             = "./modules/worker"
  name               = "swarm-worker"
  ami                = "${var.ec2_ami_manager}"
  availability_zone  = "${var.region}${var.worker_zone}"
  instance_type      = "${var.ec2_instance_type_worker}"
  security_group     = "${aws_security_group.ingress-worker.id}"
  key_name           = "${var.ssh_key_name}"
  subnet_id          = "${aws_subnet.subnet-workers.id}"
  ssh_key_path       = "${var.ssh_key_path}"
  total_instances    = "${var.total_worker_instances}"
  provision_user     = "${var.provision_user}"
  manager_public_ip  = "${aws_eip.manager-ip.public_ip}"
  manager_private_ip = "${module.managers.root_manager.private_ip}"
  swarm_tokens       = "${module.managers.swarm_tokens}"
}

module "swarmprom" {
  source             = "./modules/swarmprom"
  admin_user         = "${var.swarmprom_admin_user}"
  admin_password     = "${var.swarmprom_admin_password}"
  slack_token        = "${var.swarmprom_slack_token}"
  slack_channel      = "${var.swarmprom_slack_channel}"
  slack_user         = "${var.swarmprom_slack_user}"
  host               = "${aws_eip.manager-ip.public_ip}"
  provision_user     = "${var.provision_user}"
  ssh_key_path       = "${var.ssh_key_path}"
  connection_timeout = "${var.connection_timeout}"
}

module "efs" {
  # depends_on        = ["aws_subnet.subnet-managers", "aws_subnet.subnet-workers"]
  source            = "./modules/efs"
  name              = "docker-swarm-volume"
  subnet_ids        = ["${aws_subnet.subnet-managers.id}", "${aws_subnet.subnet-workers.id}"]
  security_group_id = "${aws_security_group.efs.id}"
}
