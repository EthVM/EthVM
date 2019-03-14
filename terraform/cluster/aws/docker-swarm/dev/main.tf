provider "aws" {
  region                  = "${var.region}"
  shared_credentials_file = "${var.shared_credentials_file}"
  profile                 = "${var.aws_profile}"
}

module "managers" {
  source = "./modules/manager"

  ami                = "${var.ec2_ami_manager}"
  availability_zone  = "${var.region}a"
  instance_type      = "${var.ec2_instance_type_manager}"
  security_group     = "${aws_security_group.ingress-manager.id}"
  key_name           = "${var.ssh_key_name}"
  subnet_id          = "${aws_subnet.subnet-1.id}"
  ssh_key_path       = "${var.ssh_key_path}"
  connection_timeout = "${var.connection_timeout}"
  total_instances    = "${var.total_manager_instances}"
}
