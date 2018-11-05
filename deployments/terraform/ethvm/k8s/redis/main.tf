resource "kubernetes_config_map" "redis-config-map" {
  metadata {
    name = "redis-sentinel"
  }

  data {}
}

resource "kubernetes_service" "redis-service" {}

resource "kubernetes_stateful_set" "redis-stateful-set" {}
