resource "kubernetes_deployment" "bolt_deployment" {
  metadata {
    name      = "bolt"
    namespace = "${var.namespace}"

    labels {
      app = "bolt"
    }
  }

  spec {
    selector {
      app = "bolt"
    }

    replicas = "${var.bolt_nodes}"

    template {
      metadata {
        labels {
          app = "bolt"
        }
      }

      spec {
        container {
          name              = "bolt"
          image             = "enkryptio/bolt:${var.bolt_version}"
          image_pull_policy = "IfNotPresent"

          env {
            name  = "KAFKA_BOOTSTRAP_SERVERS"
            value = "kafka:9092"
          }

          env {
            name  = "MONGO_URI"
            value = "mongodb://localhost:27017/"
          }
        }
      }
    }
  }
}
