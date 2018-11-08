# create network to run cluster instances
module "ethvm_network" {
  source = "../../terraform-modules/gcp/vpc"
  name   = "${var.ntw_name}"
}

# create kubernetes master clusters
module "ethvm_cluster" {
  source             = "../../terraform-modules/gcp/cluster"
  name               = "${var.name}"
  description        = "${var.description}"
  zone               = "${var.zone}"
  initial_node_count = "${var.cluster_node_count}"
  network            = "${module.ethvm_network.name}"
}

# create kubernetes node pool
# module "ethvm_np" {
#   source       = "../../terraform-modules/gcp/node-pool"
#   name         = "${var.node_pool_name}"
#   zone         = "${var.zone}"
#   cluster_name = "${module.ethvm_cluster.name}"
#   node_count   = "${var.node_pool_count}"
# }
