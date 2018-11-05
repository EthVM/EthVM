module "zookeeper" {
  source = "./zookeeper"
}

module "kafka" {
  source = "./kafka"
}

module "mongo" {
  source = "./mongo"
}

module "redis" {
  source = "./redis"
}

module "ethereumj" {
  source = "./ethereumj"
}

module "api" {
  source = "./api"
}

module "traefik" {
  source = "./traefik"
}
