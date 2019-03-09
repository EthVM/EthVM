provider "digitalocean" {
  token = "${var.do_token}"
}

module "managers" {
  source = "./modules/managers"

  image  = "docker-18-04"
  size   = "s-1vcpu-1gb"
  name   = "${var.manager_name}"
  region = "${var.region}"

  total_instances = "1"
  user_data       = "${var.user_data}"
  tags            = "${var.manager_tags}"

  remote_api_ca          = "${var.remote_api_ca}"
  remote_api_key         = "${var.remote_api_key}"
  remote_api_certificate = "${var.remote_api_certificate}"

  ssh_keys           = "${var.ssh_keys}"
  provision_ssh_key  = "${var.provision_ssh_key}"
  provision_user     = "${var.provision_user}"
  connection_timeout = "${var.connection_timeout}"
}

module "workers" {
  source = "./modules/workers"

  image  = "docker-18-04"
  size   = "s-6vcpu-16gb"
  name   = "${var.generic_worker_name}"
  region = "${var.region}"

  total_instances = "2"
  user_data       = "${var.user_data}"
  tags            = "${var.worker_tags}"

  manager_private_ip = "${element(module.managers.ipv4_addresses_private, 0)}"
  join_token         = "${module.managers.worker_token}"

  ssh_keys           = "${var.ssh_keys}"
  provision_ssh_key  = "${var.provision_ssh_key}"
  provision_user     = "${var.provision_user}"
  connection_timeout = "${var.connection_timeout}"
}

module "processing_workers" {
  source = "./modules/workers"

  image  = "docker-18-04"
  size   = "c-16"
  name   = "${var.processing_worker_name}"
  region = "${var.region}"

  total_instances = "3"
  user_data       = "${var.user_data}"
  tags            = "${var.worker_tags}"

  manager_private_ip = "${element(module.managers.ipv4_addresses_private, 0)}"
  join_token         = "${module.managers.worker_token}"

  ssh_keys           = "${var.ssh_keys}"
  provision_ssh_key  = "${var.provision_ssh_key}"
  provision_user     = "${var.provision_user}"
  connection_timeout = "${var.connection_timeout}"
}
