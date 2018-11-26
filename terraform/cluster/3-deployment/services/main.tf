module "zookeeper" {
  source    = "./zookeeper"
  namespace = "${var.namespace}"
}

module "kafka" {
  source    = "./kafka"
  namespace = "${var.namespace}"
}

module "kafka-connect" {
  source    = "./kafka-connect"
  namespace = "${var.namespace}"
}

module "kafka-schema-registry" {
  source    = "./kafka-schema-registry"
  namespace = "${var.namespace}"
}

module "redis" {
  source    = "./redis"
  namespace = "${var.namespace}"
}

module "mongo" {
  source    = "./mongo"
  namespace = "${var.namespace}"
  chain     = "${var.chain}"
}

module "bolt" {
  source    = "./bolt"
  namespace = "${var.namespace}"
}

module "ethereumj" {
  source    = "./ethereumj"
  namespace = "${var.namespace}"
}

module "api" {
  source    = "./api"
  namespace = "${var.namespace}"
  chain     = "${var.chain}"
}

module "explorer" {
  source    = "./explorer"
  namespace = "${var.namespace}"
}
