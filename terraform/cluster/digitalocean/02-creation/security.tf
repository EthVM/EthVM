module "swarm-firewall" {
  source              = "thojkooi/docker-swarm-firewall/digitalocean"
  version             = "1.0.0"
  prefix              = "ethvm"
  cluster_tags        = ["${digitalocean_tag.cluster.id}", "${digitalocean_tag.manager.id}", "${digitalocean_tag.worker.id}"]
  cluster_droplet_ids = []
}

module "default-firewall" {
    source  = "thojkooi/firewall-rules/digitalocean"
    version = "1.0.0"
    prefix  = "ethvm"
    tags    = ["${digitalocean_tag.cluster.id}"]

    allowed_inbound_ssh_adresses = ["${var.allowed_inbound_ssh_adresses}"]
}
