# 1 - Create network to run cluster instances
module "ethvm_network" {
  source = "../../../terraform-modules/gcp/vpc"
  name   = "${var.ntw_name}"
}

# 2 - Create cluster
module "ethvm_cluster" {
  source                   = "../../../terraform-modules/gcp/cluster"
  zone                     = "${var.zone}"
  name                     = "${var.name}"
  description              = "${var.description}"
  network                  = "${module.ethvm_network.name}"
  initial_node_count       = 1
  remove_default_node_pool = true
}

# 3 - create generic node pool
module "ethvm_default_np" {
  source         = "../../../terraform-modules/gcp/node-pool"
  zone           = "${var.zone}"
  cluster_name   = "${module.ethvm_cluster.name}"
  name           = "${var.generic_np_name}"
  machine_type   = "${var.generic_np_machine_type}"
  node_count     = "${var.generic_cluster_np_count}"
  min_node_count = "${var.generic_cluster_np_min_node_count}"
  max_node_count = "${var.generic_cluster_np_max_node_count}"
}

# 3 - create kafka node pool
module "ethvm_kafka_np" {
  source         = "../../../terraform-modules/gcp/node-pool"
  zone           = "${var.zone}"
  cluster_name   = "${module.ethvm_cluster.name}"
  name           = "${var.kafka_np_name}"
  node_count     = "${var.kafka_np_count}"
  min_node_count = "${var.kafka_np_count}"
  max_node_count = "${var.kafka_np_count}"
  taints         = "${var.kafka_np_taints}"
}
