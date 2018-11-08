module "zookeeper" {
  source            = "./zookeeper"
  zookeeper_version = "${var.zookeeper_version}"
}

# module "kafka" {
#   source = "./kafka"
# }

# module "mongo" {
#   source = "./mongo"
# }

module "redis" {
  source        = "./redis"
  redis_version = "${var.redis_version}"
}

# module "ethereumj" {
#   source = "./ethereumj"
# }

# module "api" {
#   source = "./api"
# }

# module "traefik" {
#   source = "./traefik"
# }
