# ---------------------------------------
#   Plugins
# ---------------------------------------

provider "digitalocean" {
  token = "${var.do_token}"
}

# ---------------------------------------
#   Resources
# ---------------------------------------

resource "digitalocean_tag" "cluster" {
  name = "ethvm-cluster"
}

resource "digitalocean_tag" "manager" {
  name = "manager"
}

resource "digitalocean_tag" "worker" {
  name = "worker"
}

# ---------------------------------------
#   Modules
# ---------------------------------------

module "managers" {
  source = "./modules/managers"

  image  = "${var.image}"
  size   = "s-1vcpu-1gb"
  name   = "${var.manager_name}"
  region = "${var.region}"

  total_instances = "${var.total_manager_instances}"
  user_data       = "${var.user_data}"
  tags            = ["${digitalocean_tag.cluster.id}", "${digitalocean_tag.manager.id}"]

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

  image  = "${var.image}"
  size   = "s-6vcpu-16gb"
  name   = "${var.worker_name}"
  region = "${var.region}"

  total_instances = "${var.total_worker_instances}"
  user_data       = "${var.user_data}"
  tags            = ["${digitalocean_tag.cluster.id}", "${digitalocean_tag.worker.id}"]

  manager_private_ip = "${element(module.managers.ipv4_addresses_private, 0)}"
  join_token         = "${module.managers.worker_token}"

  ssh_keys           = "${var.ssh_keys}"
  provision_ssh_key  = "${var.provision_ssh_key}"
  provision_user     = "${var.provision_user}"
  connection_timeout = "${var.connection_timeout}"
}
