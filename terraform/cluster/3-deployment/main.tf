module "k8s" {
  source = "./k8s"
}

module "zookeeper" {
  source = "./zookeeper"

  zookeeper_version      = "${var.zookeeper_version}"
  zookeeper_nodes        = "${var.zookeeper_nodes}"
  zookeeper_storage_size = "${var.zookeeper_storage_size}"
  zookeeper_storage_type = "${var.zookeeper_storage_type}"
}

module "kafka" {
  source = "./kafka"

  kafka_version            = "${var.kafka_version}"
  kafka_ethvm_init_version = "${var.kafka_ethvm_init_version}"
  kafka_brokers            = "${var.kafka_brokers}"
  kafka_storage_size       = "${var.kafka_storage_size}"
  kafka_storage_type       = "${var.kafka_storage_type}"
}

module "kafka-connect" {
  source = "./kafka-connect"

  kafka_connect_version            = "${var.kafka_connect_version}"
  kafka_connect_ethvm_init_version = "${var.kafka_connect_ethvm_init_version}"
  kafka_connect_storage_size       = "${var.kafka_connect_storage_size}"
  kafka_connect_storage_type       = "${var.kafka_connect_storage_type}"
}

module "kafka-schema-registry" {
  source = "./kafka-schema-registry"

  kafka_schema_registry_version = "${var.kafka_schema_registry_version}"
}

module "redis" {
  source = "./redis"

  redis_version      = "${var.redis_version}"
  redis_storage_size = "${var.redis_storage_size}"
  redis_storage_type = "${var.redis_storage_type}"
}

module "mongo" {
  source = "./mongo"

  mongodb_version            = "${var.mongodb_version}"
  mongodb_ethvm_init_version = "${var.mongodb_ethvm_init_version}"
  mongodb_nodes              = "${var.mongodb_nodes}"
  mongodb_storage_size       = "${var.mongodb_storage_size}"
  mongodb_storage_type       = "${var.mongodb_storage_type}"
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

  api_version = "${var.api_version}"
  api_nodes   = "${var.api_nodes}"
}

module "explorer" {
  source = "./explorer"

  explorer_version = "${var.explorer_version}"
  explorer_nodes   = "${var.explorer_nodes}"
}

# module "traefik" {
#   source = "./traefik"

#   traefik_version       = "${var.traefik_version}"
#   traefik_acme_email    = "${var.traefik_acme_email}"
#   traefik_domain        = "${var.domain}"
#   traefik_api_subdomain = "${var.api_subdomain}"
# }
