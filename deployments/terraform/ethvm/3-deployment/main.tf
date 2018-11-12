module "meta" {
  source = "./meta"
}

module "zookeeper" {
  source = "./zookeeper"

  zookeeper_version      = "${var.zookeeper_version}"
  zookeeper_nodes        = "${var.zookeeper_nodes}"
  zookeeper_storage_size = "${var.zookeeper_storage_size}"
  zookeeper_storage_type = "${var.zookeeper_storage_type}"
}

# module "kafka" {
#   source = "./kafka"

#   kafka_version      = "${var.kafka_version}"
#   kafka_brokers      = "${var.kafka_brokers}"
#   kafka_storage_size = "${var.kafka_storage_size}"
#   kafka_storage_type = "${var.kafka_storage_type}"
# }

# module "mongo" {
#   source = "./mongo"
# }

# module "redis" {
#   source = "./redis"

#   redis_version      = "${var.redis_version}"
#   redis_storage_size = "${var.redis_storage_size}"
#   redis_storage_type = "${var.redis_storage_type}"
# }

# module "ethereumj" {
#   source = "./ethereumj"
# }

# module "api" {
#   source = "./api"
# }

# module "traefik" {
#   source = "./traefik"
# }
