module "zookeeper" {
  source = "./zookeeper"
}

module "kafka" {
  source = "./kafka"
}

module "kafka-connect" {
  source = "./kafka-connect"
}

module "kafka-schema-registry" {
  source = "./kafka-schema-registry"
}

module "redis" {
  source = "./redis"
}

module "mongo" {
  source = "./mongo"
}

# module "bolt" {
#   source = "./bolt"

#   bolt_version = "${var.bolt_version}"
# }

# module "ethereumj" {
#   source = "./ethereumj"
# }

module "api" {
  source = "./api"
}

module "explorer" {
  source = "./explorer"
}
