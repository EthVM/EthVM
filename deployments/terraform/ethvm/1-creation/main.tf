# 1 - Create network to run cluster instances
module "ethvm_network" {
  source = "../../terraform-modules/gcp/vpc"
  name   = "${var.ntw_name}"
}

# 2 - Create cluster default pool
module "ethvm_cluster" {
  source             = "../../terraform-modules/gcp/cluster"
  name               = "${var.name}"
  description        = "${var.description}"
  zone               = "${var.zone}"
  initial_node_count = "${var.default_cluster_node_count}"
  network            = "${module.ethvm_network.name}"
}

# 3 - create kafka node pool
# module "ethvm_kafka_np" {
#   source       = "../../terraform-modules/gcp/node-pool"
#   cluster_name = "${module.ethvm_cluster.name}"
#   name         = "${var.kafka_np_name}"
#   zone         = "${var.zone}"
#   node_count   = "${var.kafka_np_count}"
# }
