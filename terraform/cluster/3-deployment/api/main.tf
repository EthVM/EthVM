resource "kubernetes_service" "api_service" {
  metadata {
    name = "api"

    labels {
      app                  = "api"
      "kubernetes.io/name" = "api"
    }
  }

  spec {
    selector {
      app = "api"
    }

    type = "ClusterIP"

    port {
      name = "api"
      port = 3000
    }
  }
}

resource "kubernetes_deployment" "api_deployment" {
  metadata {
    name = "api"

    labels {
      app = "api"
    }
  }

  spec {
    selector {
      app = "api"
    }

    replicas = "${var.api_nodes}"

    template {
      metadata {
        labels {
          app = "api"
        }
      }

      spec {
        container {
          name              = "api"
          image             = "enkryptio/api:${var.api_version}"
          image_pull_policy = "IfNotPresent"

          port {
            name           = "api"
            container_port = 3000
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }

          env {
            name  = "ETHVM_LOGS_LEVEL"
            value = "INFO"
          }

          env {
            name  = "ETHVM_MONGO_DB_URL"
            value = "mongodb://mongodb:27017/"
          }

          env {
            name  = "ETHVM_MONGO_DB_NAME"
            value = "ethvm_mainnet"
          }

          env {
            name  = "ETHVM_DATA_STORE_REDIS_HOST"
            value = "redis-master"
          }

          env {
            name  = "ETHVM_ETH_TRIE_DB_REDIS_HOST"
            value = "redis-master"
          }
        }
      }
    }
  }
}
